from flask import Blueprint, render_template, current_app, request, jsonify, redirect, url_for, flash
from flask_login import login_required, current_user

from src.models.ModelEmpleado import ModelEmpleado
from src.models.ModelUser import ModelUser

empleado_routes = Blueprint('empleado_routes', __name__)


@empleado_routes.route('/seguridad')
@login_required
def seguridad():
    empleados = ModelEmpleado.get_all(current_app.db)
    return render_template('seguridad.html', empleados=empleados)


@empleado_routes.route('/perfil')
@login_required
def perfil():
    empleado = ModelEmpleado.get_by_empleado_id(current_app.db, current_user.id_usuario)
    rol, estado = ModelUser.obtener_rol_estado_usuario(current_app.db, current_user.id_usuario)
    return render_template('auth/perfil.html', empleado=empleado, rol=rol, estado=estado)


@empleado_routes.route('/detalle_empleado/<int:id_empleado>')
@login_required
def empleado(id_empleado):
    empleado = ModelEmpleado.get_by_empleado_id(current_app.db, id_empleado)
    return render_template('detalle_empleado.html', empleado=empleado)


@empleado_routes.route('/insertar_empleado', methods=['POST'])
@login_required
def insertar_empleado():
    try:
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            form = request.form

            # Capturar id_area y convertirlo a int
            id_area = int(form['area'])

            # Armar el diccionario de empleado (sin el área)
            empleado = {
                'nombre': form['nombre'],
                'apellido': form['apellido'],
                'dni': form['dni'],
                'direccion': form['direccion'],
                'telefono': form['telefono'],
                'correo': form['correo'],
                'fecha_nacimiento': form['fecha_nacimiento'],
            }

            # Llamar al modelo correctamente con id_area como entero
            success, message, empleado_insertado = ModelEmpleado.insert(current_app.db, empleado, id_area)

            if success:
                return jsonify({
                    'success': True,
                    'message': message,
                    'empleado': empleado_insertado
                })
            else:
                return jsonify({'success': False, 'message': message}), 400  # Mejor 400 si es error controlado
        else:
            # Retornar error más limpio para no AJAX
            return jsonify({'success': False, 'message': 'Esta ruta solo acepta peticiones AJAX'}), 405
    except Exception as e:
        # Mejorar mensaje de error capturando el traceback opcionalmente
        return jsonify({'success': False, 'message': f'Error inesperado: {str(e)}'}), 500


@empleado_routes.route('/cambiar_estado_empleados', methods=['POST'])
@login_required
def cambiar_estado_empleados():
    try:
        datos = request.get_json()
        print("🚀 Recibido en ruta:", datos)

        ids = datos.get("ids", [])
        nuevo_estado = datos.get("estado")

        # Traducción si es texto (opcional)
        if nuevo_estado == 'activo':
            nuevo_estado = 1
        elif nuevo_estado == 'inactivo':
            nuevo_estado = 0
        else:
            nuevo_estado = int(nuevo_estado)

        if not ids or nuevo_estado is None:
            return jsonify({"success": False, "message": "Datos incompletos."}), 400

        success, message = ModelEmpleado.cambiar_estado_empleados(current_app.db, ids, nuevo_estado)

        if success:
            return jsonify({"success": True, "message": message})
        else:
            return jsonify({"success": False, "message": message}), 500
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@empleado_routes.route('/actualizar_empleado', methods=['POST'])
@login_required
def actualizar_empleado():
    try:
        data = request.get_json()
        id_empleado = data.get('id_empleado')
        print(f"Datos recibidos: {data}")
        if not id_empleado:
            return jsonify({'success': False, 'message': 'Falta el ID del empleado'}), 400

        success = ModelEmpleado.update(current_app.db, id_empleado, data)

        if success:
            return jsonify({'success': True})
        else:
            return jsonify({'success': False, 'message': 'Fallo al actualizar en la base de datos'}), 500

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})


@empleado_routes.route('/actualizar_contrasena', methods=['POST'])
@login_required
def actualizar_contrasena():
    try:
        id_empleado = request.form.get('id_empleado')
        password_actual = request.form.get('password_actual')
        password_nueva = request.form.get('password_nueva')
        password_confirmar = request.form.get('password_confirmar')

        # Validación de campos vacíos
        if not all([id_empleado, password_actual, password_nueva, password_confirmar]):
            return jsonify({'success': False, 'message': 'Todos los campos son obligatorios'})

        # Validación de coincidencia de contraseñas
        if password_nueva != password_confirmar:
            return jsonify({'success': False, 'message': 'Las contraseñas no coinciden'})

        # Validación básica de seguridad (longitud mínima y requisitos)
        if len(password_nueva) < 8:
            return jsonify({'success': False, 'message': 'La contraseña debe tener al menos 8 caracteres'})

        import re
        if not re.search(r'[A-Z]', password_nueva):
            return jsonify({'success': False, 'message': 'Debe contener al menos una letra mayúscula'})
        if not re.search(r'[0-9]', password_nueva):
            return jsonify({'success': False, 'message': 'Debe contener al menos un número'})
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password_nueva):
            return jsonify({'success': False, 'message': 'Debe contener al menos un carácter especial'})

        # Seguridad: validar que solo pueda cambiar su propia contraseña (salvo admin, opcional)
        empleado = ModelEmpleado.get_by_empleado_id(current_app.db, id_empleado)
        if not empleado or int(id_empleado) != empleado.id_empleado:
            return jsonify({'success': False, 'message': 'No tienes permisos para cambiar esta contraseña'})

        # Ejecutar la actualización
        success, message = ModelEmpleado.update_password(
            current_app.db, id_empleado, password_actual, password_nueva
        )

        return jsonify({'success': success, 'message': message})

    except Exception as e:
        print(f"[ERROR]: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'message': 'Error interno'})


@empleado_routes.route('/actualizar_cuenta_empleado', methods=['POST'])
def actualizar_cuenta_empleado():
    try:
        data = request.get_json()
        print("Data JSON recibida en actualizar_cuenta_empleado:", data)

        id_empleado = data.get('id_empleado')
        id_rol = data.get('id_rol')
        id_area = data.get('id_area')
        estado = data.get('estado')

        resultado = ModelEmpleado.actualizar_cuenta(
            current_app.db,
            id_empleado,
            id_rol,
            id_area,
            estado
        )

        if resultado:
            return jsonify({'success': True, 'message': 'Cuenta actualizada correctamente'})
        else:
            return jsonify({'success': False, 'message': 'Error al actualizar la cuenta'}), 400

    except Exception as e:
        print("Error en actualizar_cuenta_empleado:", str(e))
        return jsonify({'success': False, 'message': 'Error interno del servidor', 'error': str(e)}), 500
