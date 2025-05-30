# src/routes/auth_routes.py
from datetime import datetime, timedelta

import MySQLdb
from flask import Blueprint, render_template, request, redirect, url_for, flash, session, current_app, jsonify
from flask_login import login_user, logout_user, login_required
from werkzeug.security import generate_password_hash

from src.models.ModelUser import ModelUser
from src.utils.email_utils import generate_verification_code, send_email

auth_routes = Blueprint('auth_routes', __name__)


@auth_routes.route('/')
def index():
    return redirect(url_for('auth_routes.login'))


@auth_routes.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        remember = request.form.get('remember') == 'true'

        logged_user = ModelUser.login(current_app.db, username, password)

        if logged_user:
            session['user_id'] = logged_user.id_usuario
            session['username'] = logged_user.username
            login_user(logged_user, remember=remember)

            # Si es una petición fetch, devolver JSON
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return jsonify(success=True, redirect_url=url_for('home_routes.sidebar'))
            else:
                return redirect(url_for('home_routes.sidebar'))

        else:
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return jsonify(success=False, message="Credenciales Incorrectas"), 200
            else:
                flash("Credenciales Incorrectas", "danger")
                return redirect(url_for('auth_routes.login'))

    return render_template('auth/login.html')


@auth_routes.route('/logout')
def logout():
    logout_user()
    session.clear()
    return redirect(url_for('auth_routes.login'))


@auth_routes.route('/verificar-correo', methods=['POST'])
def verificar_correo():
    data = request.json
    correo = data.get('correo')

    if not correo or not re.match(r"[^@]+@[^@]+\.[^@]+", correo):
        return jsonify({'success': False, 'message': 'Correo inválido.'}), 400

    conn = current_app.db.connection
    cursor = conn.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("""
                   SELECT u.id_usuario
                   FROM usuario u
                            JOIN empleado e ON u.id_empleado = e.id_empleado
                   WHERE e.correo_electronico = %s
                   """, (correo,))
    usuario = cursor.fetchone()
    cursor.close()

    if not usuario:
        return jsonify({'success': False, 'message': 'Correo no registrado.'}), 404

    # Generar código y guardar en sesión
    codigo = generate_verification_code(current_app.config['CODE_LENGTH'])
    session['recovery'] = {
        'correo': correo,
        'codigo': codigo,
        'intentos': 0,
        'expira': (datetime.utcnow() + timedelta(minutes=current_app.config['CODE_EXPIRY_MINUTES'])).isoformat()
    }

    try:
        send_email(correo, codigo)
        return jsonify({'success': True, 'message': 'Código enviado.'}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': f'Error al enviar el correo: {str(e)}'}), 500


@auth_routes.route('/verificar-codigo', methods=['POST'])
def verificar_codigo():
    data = request.json
    codigo_usuario = data.get('codigo')  # cadena de 9 dígitos

    recovery = session.get('recovery')
    if not recovery:
        return jsonify({'success': False, 'message': 'No hay proceso de recuperación activo.'}), 400

    if datetime.utcnow() > datetime.fromisoformat(recovery['expira']):
        session.pop('recovery')
        return jsonify({'success': False, 'message': 'Código expirado.'}), 410

    if recovery['intentos'] >= current_app.config['MAX_VERIFICATION_ATTEMPTS']:
        session.pop('recovery')
        return jsonify({'success': False, 'message': 'Se superó el número de intentos.'}), 403

    if codigo_usuario != recovery['codigo']:
        recovery['intentos'] += 1
        session['recovery'] = recovery
        return jsonify({'success': False, 'message': 'Código incorrecto.'}), 401

    session['verificado'] = True
    return jsonify({'success': True, 'message': 'Código verificado.'}), 200


import re


def validar_contrasena(password):
    # Al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial
    regex = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$'
    return re.match(regex, password)


@auth_routes.route('/cambiar-contrasena', methods=['POST'])
def cambiar_contrasena():
    data = request.json
    nueva_contrasena = data.get('nueva_contrasena')
    confirmar_contrasena = data.get('confirmar_contrasena')

    if not nueva_contrasena or not confirmar_contrasena:
        return jsonify({'success': False, 'message': 'Campos incompletos.'}), 400

    if nueva_contrasena != confirmar_contrasena:
        return jsonify({'success': False, 'message': 'Las contraseñas no coinciden.'}), 400

    correo = session['recovery']['correo']
    hashed_password = generate_password_hash(nueva_contrasena)

    conn = current_app.db.connection
    cursor = conn.cursor()
    cursor.execute("""
                   UPDATE usuario u
                       JOIN empleado e ON u.id_empleado = e.id_empleado
                   SET u.pwd = %s
                   WHERE e.correo_electronico = %s
                   """, (hashed_password, correo))
    conn.commit()
    cursor.close()

    # Limpiar sesión
    session.pop('recovery', None)
    session.pop('verificado', None)

    return jsonify({'success': True, 'message': 'Contraseña actualizada correctamente.'}), 200


@auth_routes.route('/reenviar-codigo', methods=['POST'])
def reenviar_codigo():
    recovery = session.get('recovery')

    if not recovery:
        return jsonify({'success': False, 'message': 'No hay recuperación activa.'}), 400

    if datetime.utcnow() > datetime.fromisoformat(recovery['expira']):
        # Generar nuevo código y reiniciar intentos
        nuevo_codigo = generate_verification_code(current_app.config['CODE_LENGTH'])
        nueva_expiracion = (
                datetime.utcnow() + timedelta(minutes=current_app.config['CODE_EXPIRY_MINUTES'])).isoformat()

        recovery['codigo'] = nuevo_codigo
        recovery['intentos'] = 0
        recovery['expira'] = nueva_expiracion
        session['recovery'] = recovery
    else:
        # Reenviar el mismo código
        nuevo_codigo = recovery['codigo']

    try:
        send_email(recovery['correo'], nuevo_codigo)
        return jsonify({'success': True, 'message': 'Código reenviado.'}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': f'Error al reenviar: {str(e)}'}), 500
