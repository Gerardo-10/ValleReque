from .auth_routes import auth_routes
from .cliente_routes import cliente_routes
from .empleado_routes import empleado_routes
from .financiamiento_routes import financiamiento_routes
from .home_routes import home_routes
from .proyecto_routes import proyecto_routes
from .terreno_routes import terreno_routes

def register_routes(app):
    app.register_blueprint(auth_routes)
    app.register_blueprint(cliente_routes)
    app.register_blueprint(empleado_routes)
    app.register_blueprint(home_routes)
    app.register_blueprint(terreno_routes)
    app.register_blueprint(proyecto_routes)
    app.register_blueprint(financiamiento_routes)
