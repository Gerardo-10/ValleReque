# src/routes/auth_routes.py
from datetime import datetime, timedelta

import MySQLdb
from flask import Blueprint, render_template, request, redirect, url_for, flash, session, current_app, jsonify
from flask_login import login_user, logout_user, login_required
from werkzeug.security import generate_password_hash

from src.models.ModelUser import ModelUser
from src.models.entities.User import User
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

        result = ModelUser.login(current_app.db, username, password)

        if isinstance(result, tuple):
            logged_user, password_hash = result
            session['user_id'] = logged_user.id_usuario
            session['username'] = logged_user.username
            login_user(logged_user, remember=remember)

            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                if User.check_password(password_hash, "123456"):
                    return jsonify(success=True, cambiar_password=True)
                return jsonify(success=True, redirect_url=url_for('home_routes.sidebar'))
            else:
                return redirect(url_for('home_routes.sidebar'))

        # Mensajes personalizados
        mensaje_error = {
            'inactivo': "Usuario inactivo o no autorizado",
            'incorrecto': "Contraseña incorrecta",
            'no_encontrado': "Usuario no encontrado",
            'error': "Error interno del servidor"
        }.get(result, "Credenciales incorrectas")

        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return jsonify(success=False, message=mensaje_error), 200
        else:
            flash(mensaje_error, "danger")
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

@auth_routes.route('/actualizar_contrasena_inicial', methods=['POST'])
@login_required
def actualizar_contrasena_inicial():
    data = request.json
    password_actual = data.get('password_actual')
    password_nueva = data.get('password_nueva')
    password_confirmar = data.get('password_confirmar')

    if not password_actual or not password_nueva or not password_confirmar:
        return jsonify({'success': False, 'message': 'Completa todos los campos.'}), 400

    if password_nueva != password_confirmar:
        return jsonify({'success': False, 'message': 'Las contraseñas no coinciden.'}), 400

    if not validar_contrasena(password_nueva):
        return jsonify({'success': False, 'message': 'La nueva contraseña no cumple con los requisitos.'}), 400

    user_id = session.get('user_id')
    password_hash = ModelUser.get_password_hash_by_id(current_app.db, user_id)

    if not password_hash or not User.check_password(password_hash, password_actual):
        return jsonify({'success': False, 'message': 'La contraseña actual es incorrecta.'}), 401

    nueva_hash = generate_password_hash(password_nueva)
    ModelUser.update_password(current_app.db, user_id, nueva_hash)

    return jsonify({'success': True, 'message': 'Contraseña actualizada correctamente.'}), 200



