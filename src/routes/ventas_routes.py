import json
from flask import Blueprint, render_template
from flask_login import login_required
from datetime import datetime
from flask_login import current_user
from flask import request, jsonify, current_app
from src.models.ModelCliente import ModelCliente
from src.models.ModelProyecto import ModelProyecto
from src.models.ModelTerreno import ModelTerreno
from src.models.ModelFinanciamiento import ModelFinanciamiento

ventas_routes = Blueprint('ventas_routes', __name__)

@ventas_routes.route('/ventas')
@login_required
def ventas():
    fecha_actual = datetime.now().strftime("%d/%m/%Y")
    asesor_nombre = current_user.username
    proyectos = ModelProyecto.get_activos(current_app.db)
    # Convertimos la lista de objetos Financiamiento a diccionarios para JSON
    financiamientos_list = ModelFinanciamiento.get_all(current_app.db)

    financiamientos_data = []
    for f in financiamientos_list:
        financiamientos_data.append({
            'id_financiamiento': f.id_financiamiento,
            'nombre': f.nombre,
            'monto_financiamiento': float(f.monto),  # <-- ¡CAMBIO AQUÍ! Usa f.monto
            'interes': float(f.interes),
            'tipo_financiamiento': f.tipo,  # <-- También es `f.tipo`, no `f.tipo_financiamiento`
            'estado_financiamiento': f.estado  # <--- Y este es `f.estado`
        })

    return render_template(
        'ventas/ventas.html',
        fecha=fecha_actual,
        asesor=asesor_nombre,
        proyectos=proyectos,
        financiamientos_json=json.dumps(financiamientos_data)
    )

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

@ventas_routes.route('/buscar_terreno', methods=['GET'])
@login_required
def buscar_terreno():
    proyecto_id_str = request.args.get('proyecto_id')
    codigo_unidad = request.args.get('codigo_unidad')
    etapa_str_from_js = request.args.get('etapa') # Renombrar para claridad

    print(f'{proyecto_id_str} , {codigo_unidad}, {etapa_str_from_js}')

    if not all([proyecto_id_str, codigo_unidad, etapa_str_from_js]):
        return jsonify({'success': False, 'message': 'Faltan parámetros de búsqueda de terreno.'}), 400

    try:
        proyecto_id = int(proyecto_id_str)
        etapa = int(etapa_str_from_js) # Convertir a int para pasar a ModelTerreno
    except ValueError:
        return jsonify({'success': False, 'message': 'El ID del proyecto y la etapa deben ser números enteros.'}), 400

    # Ahora buscar_terreno_ventas devuelve directamente un objeto Terreno o None
    terreno = ModelTerreno.buscar_terreno_ventas(current_app.db, proyecto_id, codigo_unidad, etapa)

    print(f"DEBUG: Objeto terreno recibido en la ruta (directo): {terreno}") # Nuevo print

    if terreno:
        return jsonify({
            'success': True,
            'terreno': {
                'id_terreno': terreno.id_terreno,
                'estado_terreno': terreno.estado_terreno,
                'precio': terreno.precio_terreno,
                'tipo_ubicacion': terreno.tipo_terreno,
                'area_terreno': terreno.area
            }
        })
    else:
        return jsonify({'success': False, 'message': 'Terreno no encontrado con los criterios especificados.'}), 404


@ventas_routes.route('/financiamientos', methods=['GET'])
@login_required
def buscarfinanciamientos():
    pass