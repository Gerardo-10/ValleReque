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
