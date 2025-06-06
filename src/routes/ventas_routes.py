from flask import Blueprint, render_template
from flask_login import login_required

ventas_routes = Blueprint('ventas_routes', __name__)

@ventas_routes.route('/ventas')
@login_required
def ventas():
    return render_template('ventas/ventas.html')