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
    print("ETAPAS_DICT:", etapas_dict)

    # Enlazar el nombre del proyecto a cada terreno
    for t in terrenos:
        t.nombre_proyecto = proyectos_dict.get(t.id_proyecto, 'Sin Proyecto')

    return render_template('logistica/terrenos.html', terrenos=terrenos,proyectos=proyectos,etapas_dict=etapas_dict)


@terreno_routes.route('/insertar_terreno', methods=['POST'])
@login_required
def insertar_terreno():
    try:
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            form = request.form

            id_proyecto = int(form['proyecto'])

            manzana = form['manzana'].strip()
            lote = form['lote'].strip()
            codigo_unidad = f"{manzana} - {lote}"  # Concatenación de manzana y lote

            terreno = {
                'id_proyecto': form['proyecto'],
                'etapa': form['etapa'],
                'tipoTerreno': form['tipoTerreno'],
                'area': form['area'],
                'precio': form['precio'],
                'estadoTerreno': form['estadoTerreno'],
                'manzana': manzana,
                'lote': lote,
                'codigo_unidad': codigo_unidad
            }

            # Insertar en la base de datos y recuperar ID
            id_terreno = ModelTerreno.insert(current_app.db, terreno, id_proyecto)

            proyecto = ModelProyecto.get_by_id(current_app.db, id_proyecto)
            nombre_proyecto = proyecto.nombre_proyecto

            terreno_json = {
                'id_terreno': id_terreno,
                'nombre_proyecto': nombre_proyecto,
                'etapa': terreno['etapa'],
                'area': terreno['area'],
                'precio': terreno['precio'],
                'tipo': terreno['tipoTerreno'],
                'estado': terreno['estadoTerreno'],
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
        return jsonify({'success': False, 'error': str(e)})

    return jsonify({'success': False, 'error': 'No se pudo insertar el terreno'})


@terreno_routes.route('/actualizar_terreno', methods=['POST'])
@login_required
def actualizar_terreno():
    try:
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            form = request.form

            id_terreno = int(form['id_terreno'])

            manzana = form['manzana'].strip()
            lote = form['lote'].strip()
            codigo_unidad = f"{manzana} - {lote}"

            terreno = {
                'etapa': form['etapa'],
                'tipoTerreno': form['tipoTerreno'],
                'area': form['area'],
                'precio': form['precio'],
                'estadoTerreno': form['estadoTerreno'],
                'manzana': manzana,
                'lote': lote,
                'codigo_unidad': codigo_unidad
            }

            # Actualizar en la base de datos
            ModelTerreno.update(current_app.db, id_terreno, terreno)

            nombre_proyecto = form.get('nombre_proyecto')

            terreno_response = {
                'id_terreno': id_terreno,
                'nombre_proyecto': nombre_proyecto,
                'etapa': terreno['etapa'],
                'codigo_unidad': terreno['codigo_unidad'],
                'manzana': terreno['manzana'],
                'lote': terreno['lote'],
                'area': terreno['area'],
                'precio': terreno['precio'],
                'tipoTerreno': terreno['tipoTerreno'],  # usa el mismo nombre que usas en JS
                'estadoTerreno': terreno['estadoTerreno']
            }

            return jsonify({'success': True, 'terreno': terreno_response})

    except Exception as e:
        print("Error en actualizar_terreno:", str(e))  # Agrega este print para ver el error en consola
        return jsonify({'success': False, 'error': str(e)})

    return jsonify({'success': False, 'error': 'No se pudo actualizar el terreno'})


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