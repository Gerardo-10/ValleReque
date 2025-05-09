from .auth_routes import auth_routes
from .cliente_routes import cliente_routes
from .empleado_routes import empleado_routes
from .home_routes import home_routes

def register_routes(app):
    app.register_blueprint(auth_routes)
    app.register_blueprint(cliente_routes)
    app.register_blueprint(empleado_routes)
    app.register_blueprint(home_routes)
