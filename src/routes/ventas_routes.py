from flask import Blueprint, render_template
from flask_login import login_required
from datetime import datetime
from flask_login import current_user
from flask import request, jsonify, current_app
from src.models.ModelCliente import ModelCliente
ventas_routes = Blueprint('ventas_routes', __name__)

@ventas_routes.route('/ventas')
@login_required
def ventas():
    fecha_actual = datetime.now().strftime("%d/%m/%Y")
    asesor_nombre = current_user.username 
    return render_template('ventas/ventas.html', fecha=fecha_actual, asesor=asesor_nombre)

@ventas_routes.route('/buscar_cliente', methods=['GET'])
@login_required
def buscar_cliente():
    dni = request.args.get('dni')
    if not dni:
        return jsonify({'success': False, 'message': 'DNI no proporcionado.'}), 400

    # Llamamos al método get_by_dni que debes implementar en tu modelo
    cliente = ModelCliente.get_by_dni(current_app.db, dni)

    if cliente:
        # Si encontramos el cliente, lo devolvemos
        return jsonify({
            'success': True,
            'cliente': {
                'nombre': cliente.nombre,
                'apellido': cliente.apellido,
                'telefono': cliente.telefono,
                'estado': cliente.estado,
                'ingreso_neto': cliente.ingreso_neto,
                'ocupacion': cliente.ocupacion,
                'carga_familiar': 'Sí' if cliente.carga_familiar else 'No'
            }
        })
    else:
        return jsonify({'success': False, 'message': 'Cliente no encontrado.'}), 404