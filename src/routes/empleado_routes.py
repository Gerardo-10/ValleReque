from flask import Blueprint, render_template, current_app
from flask_login import login_required, current_user

from src.models.ModelEmpleado import ModelEmpleado
from src.models.ModelUser import ModelUser

empleado_routes = Blueprint('empleado_routes', __name__)

@empleado_routes.route('/seguridad')
@login_required
def seguridad():
    empleados = ModelEmpleado.get_all(current_app.db)
    return render_template('seguridad.html', empleados=empleados)

@empleado_routes.route('/perfil')
@login_required
def perfil():
    empleado = ModelEmpleado.get_by_empleado_id(current_app.db, current_user.id_usuario)
    rol, estado = ModelUser.obtener_datos_usuario(current_app.db, current_user.id_usuario)
    return render_template('auth/perfil.html', empleado=empleado, rol=rol, estado=estado)
