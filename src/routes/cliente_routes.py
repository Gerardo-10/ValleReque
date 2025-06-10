from flask import Blueprint, render_template, request, jsonify, flash, redirect, url_for, current_app
from flask_login import login_required
import json
import logging

from MySQLdb._exceptions import IntegrityError

from src.models.ModelCliente import ModelCliente, ModelFamiliar  # ✅ Agregado ModelFamiliar

cliente_routes = Blueprint('cliente_routes', __name__)


@cliente_routes.route('/clientes')
@login_required
def clientes():
    cliente = ModelCliente.get_all(current_app.db)
    return render_template('logistica/clientes.html', clientes=cliente)


@cliente_routes.route('/insertar_cliente', methods=['POST'])
@login_required
def insertar_cliente():
    if request.headers.get('X-Requested-With') != 'XMLHttpRequest':
        flash('Esta ruta solo acepta peticiones AJAX', 'danger')
        return redirect(url_for('cliente_routes.clientes'))

    try:
        form = request.form
        data = {
            'nombre': form['nombre'],
            'apellido': form['apellido'],
            'dni': form['dni'],
            'direccion': form['direccion'],
            'correo': form['correo'],
            'telefono': form['telefono'],
            'ocupacion': form['ocupacion'],
            'ingreso_neto': form['ingreso_neto'],
            'estado': form['estado'],
            'carga_familiar': form['carga_familiar']
        }

        cliente_insertado = ModelCliente.insert(current_app.db, data)  # ✅ Después de esto

        # ⬇️ Aquí va tu bloque para manejar el familiar
        if data['carga_familiar'] == '1':
            nombre_familiar = form.get('nombre_familiar', '').strip()
            apellido_familiar = form.get('apellido_familiar', '').strip()
            dni_familiar = form.get('dni_familiar', '').strip()

            # Validación robusta en servidor
            if not all([nombre_familiar, apellido_familiar, dni_familiar]):
                return jsonify({'success': False, 'message': 'Faltan datos del familiar'}), 400
            if not dni_familiar.isdigit() or len(dni_familiar) != 8:
                return jsonify({'success': False, 'message': 'DNI del familiar inválido'}), 400

            try:
                ModelFamiliar.update_or_insert(
                    current_app.db,
                    cliente_insertado['id_cliente'],
                    nombre_familiar,
                    apellido_familiar,
                    dni_familiar
                )
            except Exception as e:
                import traceback
                traceback.print_exc()
                return jsonify({'success': False, 'message': 'Error al guardar familiar'}), 500

        return jsonify({
            'success': True,
            'message': 'Cliente agregado exitosamente',
            'cliente': cliente_insertado
        })

    except IntegrityError as e:
        current_app.db.connection.rollback()
        error_str = str(e)

        if 'documento_identidad' in error_str:
            mensaje = 'El DNI ingresado ya está registrado.'
        elif 'telefono' in error_str:
            mensaje = 'El número de teléfono ya está registrado.'
        elif 'correo' in error_str:
            mensaje = 'El correo electrónico ya está en uso.'
        else:
            mensaje = 'Error de integridad en la base de datos.'

        return jsonify({'success': False, 'message': mensaje}), 400

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'message': 'Error interno del servidor'}), 500


@cliente_routes.route('/eliminar_clientes', methods=['POST'])
@login_required
def eliminar_clientes():
    try:
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            data = request.form
            clientes_ids = json.loads(data.get('clientes', '[]'))

            if not clientes_ids:
                return jsonify({'success': False, 'message': 'No se enviaron IDs'}), 400

            success = ModelCliente.delete(current_app.db, clientes_ids)
            if success:
                return jsonify({'success': True, 'message': 'Clientes eliminados correctamente'})
            else:
                return jsonify({'success': False, 'message': 'Error al eliminar clientes'}), 500
        else:
            flash('Esta ruta solo acepta peticiones AJAX', 'danger')
            return redirect(url_for('cliente_routes.clientes'))
    except Exception as e:
        logging.error(f"Error al eliminar clientes: {e}")
        return jsonify({'success': False, 'message': 'Error interno del servidor'}), 500


@cliente_routes.route('/detalle_clientes/<int:id_cliente>')
@login_required
def detalle_clientes(id_cliente):
    cliente = ModelCliente.get_by_id(current_app.db, id_cliente)
    familiar = ModelFamiliar.get_by_cliente(current_app.db, id_cliente)  # ✅ Agregado
    return render_template('logistica/detalle_clientes.html', cliente=cliente, familiar=familiar)


@cliente_routes.route('/actualizar_clientes', methods=['POST'])
@login_required
def actualizar_cliente():
    try:
        data = request.get_json(force=True)
        print("JSON recibido:", data)

        id_cliente = data.get('id_cliente')
        if not id_cliente:
            return jsonify({'success': False, 'message': 'Falta el ID del cliente'}), 400

        success = ModelCliente.update(current_app.db, id_cliente, data)

        if success:
            return jsonify({'success': True})
        else:
            return jsonify({'success': False, 'message': 'Fallo al actualizar en la base de datos'}), 500

    except Exception as e:
        print("❌ Error en actualizar_cliente:", e)
        return jsonify({'success': False, 'message': str(e)}), 500


@cliente_routes.route('/actualizar_estado_clientes', methods=['POST'])
def actualizar_estado_clientes():
    try:
        clientes = request.form.get('clientes')
        estado = request.form.get('estado')

        estados_mapeo = {
            'sin-evaluar': 'SinEvaluar',
            'no-disponible': 'NoDisponible',
            'evaluado': 'Evaluado',
            'activo': 'Activo'
        }

        if estado not in estados_mapeo:
            return jsonify(success=False, message='Estado no válido'), 400

        estado_real = estados_mapeo[estado]

        if not clientes or not estado:
            return jsonify(success=False, message='Datos incompletos'), 400

        clientes = json.loads(clientes)

        if ModelCliente.update_status(current_app.db, clientes, estado_real):
            return jsonify(success=True, message='Estado actualizado correctamente')
        else:
            return jsonify(success=False, message='Error al actualizar el estado de los clientes'), 500

    except Exception as e:
        print('Error interno en actualizar_estado_clientes:', e)
        return jsonify(success=False, message='Error interno: ' + str(e)), 500


@cliente_routes.route('/obtener_cliente/<int:id_cliente>', methods=['GET'])
@login_required
def obtener_cliente(id_cliente):
    cliente = ModelCliente.get_by_id(current_app.db, id_cliente)

    if cliente is None:
        return jsonify(None), 404

    cliente_dict = {
        'id_cliente': cliente.id_cliente,
        'nombre': cliente.nombre,
        'apellido': cliente.apellido,
        'dni': cliente.dni,
        'direccion': cliente.direccion,
        'correo': cliente.correo,
        'telefono': cliente.telefono,
        'ocupacion': cliente.ocupacion,
        'ingreso_neto': cliente.ingreso_neto,
        'estado': cliente.estado,
        'carga_familiar': cliente.carga_familiar
    }

    return jsonify(cliente_dict)


# ---------------------------------------------
# ✅ NUEVAS RUTAS PARA FAMILIAR O CÓNYUGE
# ---------------------------------------------

@cliente_routes.route('/familiar/<int:id_cliente>', methods=['GET'])
def obtener_familiar(id_cliente):
    familiar = ModelFamiliar.get_by_cliente(current_app.db, id_cliente)
    if familiar:
        return jsonify(success=True, familiar=familiar.__dict__)
    return jsonify(success=False, message="No se encontró el familiar.")


from MySQLdb._exceptions import OperationalError  # Asegúrate de tener esto importado

@cliente_routes.route('/actualizar_familiar', methods=['POST'])
def actualizar_familiar():
    try:
        print("📥 FORM DATA RECIBIDO:", request.form.to_dict())

        id_cliente = request.form.get('id_cliente')
        nombre = request.form.get('nombre')
        apellido = request.form.get('apellido')
        documento = request.form.get('documento')

        if not all([id_cliente, nombre, apellido, documento]):
            return jsonify(success=False, message="Faltan datos obligatorios."), 400

        exito = ModelFamiliar.update_or_insert(current_app.db, id_cliente, nombre, apellido, documento)

        if exito:
            return jsonify(success=True, message="Familiar actualizado correctamente")
        else:
            return jsonify(success=False, message="No se pudo actualizar el familiar."), 500

    except OperationalError as oe:
        error_msg = str(oe)
        print("⚠️ Error MySQL capturado:", error_msg)
        if 'documento ya está registrado' in error_msg:
            return jsonify(success=False, message="El documento ya está registrado con otro cliente."), 400
        return jsonify(success=False, message="Error SQL: " + error_msg), 500

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify(success=False, message=f"Error inesperado: {str(e)}"), 500

@cliente_routes.route('/eliminar_clientes_y_familia', methods=['POST'])
@login_required
def eliminar_clientes_y_familia():
    try:
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            data = request.form
            clientes_ids = json.loads(data.get('clientes', '[]'))

            if not clientes_ids:
                return jsonify({'success': False, 'message': 'No se enviaron IDs'}), 400

            # Eliminar familiares asociados a los clientes
            for id_cliente in clientes_ids:
                # Elimina el familiar asociado al cliente
                if not ModelFamiliar.delete(current_app.db, id_cliente):
                    return jsonify({'success': False, 'message': 'Error al eliminar los familiares.'})

            # Eliminar los clientes
            success = ModelCliente.delete(current_app.db, clientes_ids)
            if success:
                return jsonify({'success': True, 'message': 'Clientes y familiares eliminados correctamente'})
            else:
                return jsonify({'success': False, 'message': 'Error al eliminar clientes'}), 500
        else:
            flash('Esta ruta solo acepta peticiones AJAX', 'danger')
            return redirect(url_for('cliente_routes.clientes'))
    except Exception as e:
        logging.error(f"Error al eliminar clientes y familiares: {e}")
        return jsonify({'success': False, 'message': 'Error interno del servidor'}), 500