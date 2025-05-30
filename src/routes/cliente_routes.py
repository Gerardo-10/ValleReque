from flask import Blueprint, render_template, request, jsonify, flash, redirect, url_for, current_app
from flask_login import login_required
import json
import logging

from src.models.ModelCliente import ModelCliente

cliente_routes = Blueprint('cliente_routes', __name__)


@cliente_routes.route('/clientes')
@login_required
def clientes():
    cliente = ModelCliente.get_all(current_app.db)
    return render_template('logistica/clientes.html', clientes=cliente)


@cliente_routes.route('/insertar_cliente', methods=['POST'])
@login_required
def insertar_cliente():
    try:
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
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

            cliente_insertado = ModelCliente.insert(current_app.db, data)
            if cliente_insertado:
                return jsonify({
                    'success': True,
                    'message': 'Cliente agregado exitosamente',
                    'cliente': cliente_insertado
                })
            else:
                return jsonify({'success': False, 'message': 'Error al agregar cliente'}), 500
        else:
            flash('Esta ruta solo acepta peticiones AJAX', 'danger')
            return redirect(url_for('cliente_routes.clientes'))

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


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
        logging.error(f"Error al eliminar clientes: {e}")  # Agregar log para capturar el error
        return jsonify({'success': False, 'message': 'Error interno del servidor'}), 500


@cliente_routes.route('/detalle_clientes/<int:id_cliente>')
@login_required
def detalle_clientes(id_cliente):
    cliente = ModelCliente.get_by_id(current_app.db, id_cliente)
    return render_template('logistica/detalle_clientes.html', cliente=cliente)


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

        # Mapeo de valores del frontend al ENUM exacto en BD
        estados_mapeo = {
            'sin-evaluar': 'SinEvaluar',
            'no-disponible': 'NoDisponible',
            'evaluado': 'Evaluado',
            'activo': 'Activo'
        }

        # Validación del estado recibido
        if estado not in estados_mapeo:
            return jsonify(success=False, message='Estado no válido'), 400

        estado_real = estados_mapeo[estado]

        if not clientes or not estado:
            return jsonify(success=False, message='Datos incompletos'), 400

        print(f'Recibido clientes: {clientes}, estado: {estado_real}')

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
