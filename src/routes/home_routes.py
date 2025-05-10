from flask import Blueprint, render_template, current_app
from flask_login import login_required, current_user

from src.models.ModelEmpleado import ModelEmpleado
from src.models.ModelUser import ModelUser

home_routes = Blueprint('home_routes', __name__)

@home_routes.route('/home')
@login_required
def home():
    return render_template('home.html')

@home_routes.route('/sidebar')
@login_required
def sidebar():
    empleado = ModelEmpleado.get_by_empleado_id(current_app.db, current_user.id_usuario)
    rol, estado = ModelUser.obtener_datos_usuario(current_app.db, current_user.id_usuario)
    return render_template('sidebar.html', empleado=empleado, rol=rol, estado=estado)

@home_routes.route('/protected')
@login_required
def protected():
    return render_template('protected.html')
