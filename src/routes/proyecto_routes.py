from flask import Blueprint, render_template, current_app
from flask_login import login_required

from src.models.ModelProyecto import ModelProyecto

proyecto_routes = Blueprint('proyecto_routes', __name__)

@proyecto_routes.route('/proyectos')
@login_required
def proyectos():
    proyecto = ModelProyecto.get_all(current_app.db)
    return render_template('logistica/proyectos.html', proyecto=proyecto)