import os
from datetime import datetime
from flask import Blueprint, current_app, render_template, request, jsonify
from flask_login import login_required
from werkzeug.utils import secure_filename
from src.models.ModelFinanciamiento import ModelFinanciamiento

financiamiento_routes = Blueprint("financiamiento_routes", __name__)

@financiamiento_routes.route("/financiamientos")
@login_required
def financiamientos():
    # Obtener lista de financiamientos
    financiamientos = ModelFinanciamiento.get_all(current_app.db)
    return render_template('tesoreria/financiamientos.html', financiamientos=financiamientos)

@financiamiento_routes.route("/insertar_financiamiento", methods=["POST"])
@login_required
def insertar_financiamiento():
    try:
        if request.headers.get("X-Requested-With") == "XMLHttpRequest":
            form = request.form
            file = request.files['imagen']

            filename = None
            if file and file.filename != '':
                filename = secure_filename(file.filename)
                upload_path = os.path.join(current_app.root_path, 'static', 'img', 'financiamientos', filename)
                file.save(upload_path)

            # Limpiar los campos de monto e interés para eliminar comas y convertirlos a float
            monto = form["monto"].replace(",", "")  # Eliminar comas
            interes = form["interes"].replace(",", "")  # Eliminar comas

            try:
                monto = float(monto)
                interes = float(interes)
            except ValueError:
                return jsonify({"success": False, "error": "El monto o interés no son válidos"}), 400

            financiamiento = {
                "tipo": form["tipo"],
                "nombre": form["nombre"].strip(),
                "monto": monto,
                "interes": interes,
                "estado": form["estado"],
                "fecha_creacion": datetime.strptime(form["fecha_creacion"], "%Y-%m-%d"),
                "imagen": filename
            }

            # Insertar en la base de datos y recuperar ID
            id_financiamiento = ModelFinanciamiento.insert(current_app.db, financiamiento)

            if id_financiamiento:
                return jsonify({
                    "success": True,
                    "financiamiento": {
                        "id": id_financiamiento,
                        "tipo": int(financiamiento["tipo"]),
                        "nombre": financiamiento["nombre"],
                        "monto": financiamiento["monto"],
                        "interes": financiamiento["interes"],
                        "estado": financiamiento["estado"],
                        "fecha_creacion": financiamiento["fecha_creacion"].strftime("%Y-%m-%d"),
                        "imagen": financiamiento["imagen"]
                    }
                }), 201
            else:
                return jsonify({
                    "success": False,
                    "error": "No se pudo insertar el financiamiento"
                }), 400

    except Exception as e:
        print(f"[ERROR insertar financiamiento]: {e}")
        return {"error": str(e)}, 500

    return {"error": "No se pudo insertar el financiamiento"}, 500

@financiamiento_routes.route("/cambiar_estado_financiamiento", methods=["POST"])
@login_required
def cambiar_estado():
    try:
        if request.headers.get("X-Requested-With") == "XMLHttpRequest":
            data = request.get_json()

            id_raw = data.get("id_financiamiento")
            if not id_raw or not str(id_raw).isdigit():
                return jsonify({"error": "ID de financiamiento inválido"}), 400

            id_financiamiento = int(id_raw)

            estado = data.get("estado", "").capitalize()

            if estado not in ["Activo", "Inactivo"]:
                return jsonify({"error": "Estado inválido"}), 400

            # Actualizar el estado del financiamiento en la base de datos
            success = ModelFinanciamiento.update_status(current_app.db, id_financiamiento, estado)

            if success:
                return jsonify({"success": True}), 200
            else:
                return jsonify({"error": "No se pudo actualizar en BD"}), 500
    except Exception as e:
        print(f"[ERROR cambiar estado financiamiento]: {e}")
        return {"error": str(e)}, 500

    return {"error": "No se pudo cambiar el estado del financiamiento"}, 500

@financiamiento_routes.route("/actualizar_financiamiento", methods=["POST"])
@login_required
def actualizar_financiamiento():
    try:
        if request.headers.get("X-Requested-With") == "XMLHttpRequest":
            form = request.form
            file = request.files.get("imagen")  # nombre correcto del input

            # Manejar imagen si se sube una nueva
            filename = None
            if file and file.filename != "":
                filename = secure_filename(file.filename)
                upload_path = os.path.join(current_app.root_path, 'static', 'uploads', filename)

                # ✅ Crear la carpeta si no existe
                os.makedirs(os.path.dirname(upload_path), exist_ok=True)

                # ✅ Guardar la imagen
                file.save(upload_path)

            # Si no se subió imagen nueva, mantener la anterior
            if not filename:
                filename = form.get("imagen_actual", None)

            # Limpiar los campos de monto e interés para eliminar comas y convertirlos a float
            monto = form["monto"].replace(",", "")  # Eliminar comas
            interes = form["interes"].replace(",", "")  # Eliminar comas

            try:
                monto = float(monto)
                interes = float(interes)
            except ValueError:
                return jsonify({"success": False, "error": "El monto o interés no son válidos"}), 400

            financiamiento = {
                "id_financiamiento": form["id_financiamiento"],
                "nombre": form["nombre"].strip(),
                "monto": monto,
                "interes": interes,
                "tipo": form["tipo"],
                "fecha_creacion": datetime.strptime(form["fecha_creacion"], "%Y-%m-%d"),
                "imagen": filename  # Puede ser nueva o la anterior
            }

            actualizado = ModelFinanciamiento.update(current_app.db, financiamiento)

            if actualizado:
                return jsonify({"success": True}), 200
            else:
                return jsonify({"success": False, "error": "No se pudo actualizar en la base de datos"}), 400

    except Exception as e:
        print(f"[ERROR actualizar financiamiento]: {e}")
        return jsonify({"error": str(e)}), 500

    return jsonify({"error": "Solicitud inválida"}), 400
