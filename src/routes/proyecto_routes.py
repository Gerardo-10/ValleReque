import os
import uuid

from flask import Blueprint, render_template, current_app, request, jsonify
from flask_login import login_required
from werkzeug.utils import secure_filename

from src.models.ModelProyecto import ModelProyecto
from src.models.entities.Proyecto import Proyecto

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
            estado = estado
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
