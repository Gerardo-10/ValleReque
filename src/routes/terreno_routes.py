from flask import Blueprint, render_template, current_app, request, jsonify
from flask_login import login_required

from src.models.ModelProyecto import ModelProyecto
from src.models.ModelTerreno import ModelTerreno

terreno_routes = Blueprint('terreno_routes', __name__)


@terreno_routes.route('/terrenos')
@login_required
def terrenos():
    # Obtener listas de terrenos y proyectos
    terrenos = ModelTerreno.get_all(current_app.db)
    proyectos = ModelProyecto.get_all(current_app.db)

    # Crear diccionario: id_proyecto -> nombre_proyecto
    proyectos_dict = {proy.id_proyecto: proy.nombre_proyecto for proy in proyectos}
    etapas_dict = {p.id_proyecto: p.cantidad_etapas for p in proyectos}
    proyectos_dict = {proy.id_proyecto: proy.nombre_proyecto for proy in proyectos}
    # Crear diccionario de precios por proyecto
    precios_dict = {proy.id_proyecto: {
        'calle': proy.precio_calle,
        'avenida': proy.precio_avenida,
        'esquina': proy.precio_esquina,
        'parque': proy.precio_parque,
        'esquina_parque': proy.precio_esquina_parque
    } for proy in proyectos}

    print("ETAPAS_DICT:", etapas_dict)

    # Enlazar el nombre del proyecto a cada terreno
    for t in terrenos:
        t.nombre_proyecto = proyectos_dict.get(t.id_proyecto, 'Sin Proyecto')

    return render_template('logistica/terrenos.html', terrenos=terrenos,proyectos=proyectos,etapas_dict=etapas_dict, precios_dict=precios_dict)

@terreno_routes.route('/insertar_terreno', methods=['POST'])
@login_required
def insertar_terreno():
    try:
        form = request.form
        id_proyecto = int(form['proyecto'])
        manzana = form['manzana'].strip()
        lote = int(form['lote'].strip())
        estado_terreno = form['estadoTerreno']
        etapa = int(form['etapa'])

        # Llamar a la validación del terreno
        codigo_unidad_existe, etapa_valida = ModelTerreno.validar_terreno(current_app.db,id_proyecto, etapa, manzana, lote,estado_terreno)

        print(f"Código de unidad existe: {codigo_unidad_existe}, Etapa válida: {etapa_valida}")

        # Verificar si el código de unidad ya existe o si la etapa es válida
        if codigo_unidad_existe:
            print(f"Código de unidad ya existe para el terreno {manzana} - {lote}")
            return jsonify({'success': False, 'message': 'El código de unidad ya existe en esta etapa.'}), 400

        if not etapa_valida:
            print(f"Etapa no válida para el terreno {manzana} - {lote}")
            return jsonify({'success': False, 'message': 'La etapa no es válida para este proyecto.'}), 400

        # Si pasa las validaciones, crear el terreno
        codigo_unidad = f"{manzana} - {lote}"
        terreno = {
            'id_proyecto': id_proyecto,
            'etapa': etapa,
            'tipoTerreno': form['tipoTerreno'],
            'area': form['area'],
            'precio': form['precio'],
            'estadoTerreno': estado_terreno,
            'manzana': manzana,
            'lote': lote,
            'codigo_unidad': codigo_unidad
        }

        # Insertar el terreno en la base de datos
        id_terreno = ModelTerreno.insert(current_app.db, terreno, id_proyecto)

        # Obtener el nombre del proyecto
        proyecto = ModelProyecto.get_by_id(current_app.db, id_proyecto)
        nombre_proyecto = proyecto.nombre_proyecto

        # Devolver la respuesta con el terreno agregado
        terreno_json = {
            'id_terreno': id_terreno,
            'nombre_proyecto': nombre_proyecto,
            'etapa': terreno['etapa'],
            'area': float(terreno['area']),
            'precio': float(terreno['precio']),
            'estado': terreno['estadoTerreno'],
            'tipo': terreno['tipoTerreno'],
            'manzana': terreno['manzana'],
            'lote': terreno['lote'],
            'codigo_unidad': terreno['codigo_unidad']
        }

        return jsonify({
            'success': True,
            'message': 'Terreno agregado correctamente',
            'terreno': terreno_json
        })

    except Exception as e:
        print(f"Error al insertar terreno: {e}")  # Agregar más detalle en los errores
        return jsonify({'success': False, 'error': str(e)}), 500

@terreno_routes.route('/actualizar_terreno', methods=['POST'])
@login_required
def actualizar_terreno():
    try:
        form = request.form
        id_terreno = int(form['id_terreno'])  # ← esto debe coincidir con el input hidden
        id_proyecto = int(form['id_proyecto'])  # también viene oculto desde el modal

        manzana = form['manzana'].strip()
        lote = int(form['lote'].strip())
        estado_terreno = form['estadoTerreno']
        etapa = int(form['etapa'])

        codigo_unidad = f"{manzana} - {lote}"

        # Validar duplicado con el mismo SP que insertar
        codigo_unidad_existe, etapa_valida = ModelTerreno.validar_terreno(
            current_app.db,
            id_proyecto,
            etapa,
            manzana,
            lote,
            estado_terreno
        )

        # ⚠️ Validar si el código existe pero pertenece a otro terreno (distinto al actual)
        terreno_existente = ModelTerreno.get_by_codigo_unidad(current_app.db, codigo_unidad, id_proyecto, etapa)

        if terreno_existente and terreno_existente.id_terreno != id_terreno:
            print(f"Código unidad en uso por otro terreno ID={terreno_existente.id_terreno}")
            return jsonify({'success': False, 'message': 'El código de unidad ya existe en esta etapa.'}), 400

        if not etapa_valida:
            return jsonify({'success': False, 'message': 'La etapa no es válida para este proyecto.'}), 400

        # Estructura de actualización
        data = {
            'etapa': etapa,
            'tipoTerreno': form['tipoTerreno'],
            'area': float(form['area']),
            'precio': float(form['precio']),
            'estadoTerreno': estado_terreno,
            'manzana': manzana,
            'lote': lote,
            'codigo_unidad': codigo_unidad
        }

        actualizado = ModelTerreno.update(current_app.db, id_terreno, data)
        if actualizado:
            return jsonify({'success': True})
        else:
            return jsonify({'success': False, 'message': 'No se pudo actualizar el terreno.'}), 500

    except Exception as e:
        print(f"[ERROR actualizar_terreno]: {e}")
        return jsonify({'success': False, 'message': 'Error interno del servidor'}), 500


@terreno_routes.route('/eliminar_terreno', methods=['POST'])
@login_required
def eliminar_terreno():
    try:
        data = request.get_json()
        id_terreno = data.get('id_terreno')
        if not id_terreno:
            return jsonify({'success': False, 'message': 'Falta el ID del terreno'}), 400

        success = ModelTerreno.delete(current_app.db, id_terreno)

        if success:
            return jsonify({'success': True})
        else:
            return jsonify({'success': False, 'message': 'Fallo al eliminar en la base de datos'}), 500

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})