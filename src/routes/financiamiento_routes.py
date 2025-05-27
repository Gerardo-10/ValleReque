from flask import Blueprint, current_app, render_template
from flask_login import login_required

from src.models.ModelFinanciamiento import ModelFinanciamiento

financiamiento_routes = Blueprint("financiamiento_routes", __name__)


@financiamiento_routes.route("/financiamientos")
@login_required
def financiamientos():
    # Obtener lista de financiamientos
    financiamientos = ModelFinanciamiento.get_all(current_app.db)
    return render_template('tesoreria/financiamientos.html', financiamientos=financiamientos)
