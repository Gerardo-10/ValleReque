import os
import uuid
import json

from flask import Blueprint, render_template, current_app, request, jsonify
from flask_login import login_required
from werkzeug.utils import secure_filename

from src.models.ModelProyecto import ModelProyecto
from src.models.entities.Proyecto import Proyecto
from src.models.entities.Terreno import Terreno

proyecto_routes = Blueprint('proyecto_routes', __name__)


@proyecto_routes.route('/proyectos')
@login_required
def proyectos():
    proyectos = ModelProyecto.get_all(current_app.db)
    return render_template('logistica/proyectos.html', proyectos=proyectos)


@proyecto_routes.route('/insertar_proyecto', methods=['POST'])
@login_required
def insertar_proyecto():
    try:
        # ... (tu código existente para insertar_proyecto) ...
        # Obtener datos del formulario
        nombre_proyecto = request.form.get('nombreProyecto')
        direccion = request.form.get('direccion')
        inversion = request.form.get('inversion')
        cantidad_lotes = request.form.get('numLotes')
        cantidad_etapas = request.form.get('numEtapas')
        precio_parque = request.form.get('precioParque')
        precio_esquina_parque = request.form.get('precioEsquinaParque')
        precio_esquina = request.form.get('precioEsquina')
        precio_avenida = request.form.get('precioAvenida')
        precio_calle = request.form.get('precioCalle')
        estado_str = request.form.get('estado')

        estado = True if estado_str == '1' else False
        # Manejar la imagen subida
        foto_ref = None
        if 'fotoReferencia' in request.files:
            file = request.files['fotoReferencia']
            if file.filename != '':
                # Validar extensión del archivo
                allowed_extensions = {'png', 'jpg', 'jpeg', 'gif'}
                filename = secure_filename(file.filename)
                if '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions:
                    # Generar nombre único para el archivo
                    unique_filename = f"{uuid.uuid4().hex}.{filename.rsplit('.', 1)[1].lower()}"
                    save_path = os.path.join(current_app.root_path, 'static', 'img', 'proyectos', unique_filename)
                    file.save(save_path)
                    foto_ref = unique_filename

        # Crear objeto Proyecto
        proyecto = Proyecto(
            id_proyecto=None,
            nombre_proyecto=nombre_proyecto,
            direccion=direccion,
            inversion=inversion,
            cantidad_lotes=cantidad_lotes,
            cantidad_etapas=cantidad_etapas,
            precio_parque=precio_parque,
            precio_esquina=precio_esquina,
            precio_calle=precio_calle,
            precio_avenida=precio_avenida,
            precio_esquina_parque=precio_esquina_parque,
            foto_ref=foto_ref,
            estado=estado
        )

        # Insertar en la base de datos
        if ModelProyecto.insert(current_app.db, proyecto):
            return jsonify({
                'success': True,
                'message': 'Proyecto creado exitosamente',
                'proyectoId': proyecto.id_proyecto
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Error al insertar en la base de datos'
            }), 500
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500


@proyecto_routes.route('/guardar_etapas', methods=['POST'])
@login_required
def guardar_etapas():
    try:
        proyecto_id_str = request.form.get('proyectoId')
        etapas_json = request.form.get('etapas')
        completo = request.form.get('completo') == 'true'

        if not proyecto_id_str  or not etapas_json:
            return jsonify({'success': False, 'message': 'Datos incompletos para guardar etapas.'}), 400

        # Convertir a entero aquí
        try:
            proyecto_id = int(proyecto_id_str)
        except ValueError:
            return jsonify({'success': False, 'message': 'ID de proyecto inválido.'}), 400

        etapas_data = json.loads(etapas_json)

        # Obtener los precios del proyecto desde la BD
        proyecto_existente = ModelProyecto.get_by_id(current_app.db, proyecto_id)
        if not proyecto_existente:
            return jsonify({'success': False, 'message': 'Proyecto no encontrado.'}), 404

        precios_proyecto = {
            'Parque': float(proyecto_existente.precio_parque),
            'Esquina-Parque': float(proyecto_existente.precio_esquina_parque),
            'Esquina': float(proyecto_existente.precio_esquina),
            'Avenida': float(proyecto_existente.precio_avenida),
            'Calle': float(proyecto_existente.precio_calle)
        }

        # Insertar terrenos y manejar la lógica de negocio en el modelo
        if ModelProyecto.insertar_terrenos_por_etapa(current_app.db, proyecto_id, etapas_data, precios_proyecto):
            message = 'Proyecto completado y etapas guardadas exitosamente.' if completo else 'Progreso de etapas guardado.'
            return jsonify({'success': True, 'message': message})
        else:
            return jsonify({'success': False, 'message': 'Error al guardar las etapas y terrenos.'}), 500

    except json.JSONDecodeError:
        return jsonify({'success': False, 'message': 'Formato JSON inválido para las etapas.'}), 400
    except Exception as e:
        print(f"[ERROR guardar_etapas]: {e}")
        return jsonify({'success': False, 'message': f'Error interno del servidor: {str(e)}'}), 500
