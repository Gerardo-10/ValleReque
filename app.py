import os
import logging
from datetime import timedelta
from logging.handlers import RotatingFileHandler
from flask import Flask
from flask_mail import Mail
from flask_mysqldb import MySQL
from flask_login import LoginManager
from flask_wtf.csrf import CSRFProtect
from dotenv import load_dotenv
from config import config
from src.routes import register_routes
from src.routes.error_routes import register_error_handlers
from src.models.ModelUser import ModelUser

# Cargar variables de entorno
load_dotenv()

# Crear directorio de logs si no existe
if not os.path.exists('logs'):
    os.mkdir('logs')

# Configuración de logs
logger = logging.getLogger('appLogger')
logger.setLevel(logging.DEBUG if config['development'].DEBUG else logging.INFO)

formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(name)s - %(message)s')
file_handler = RotatingFileHandler('logs/app.log', maxBytes=1000000, backupCount=3, encoding='utf-8')
console_handler = logging.StreamHandler()
file_handler.setFormatter(formatter)
console_handler.setFormatter(formatter)
logger.addHandler(file_handler)
logger.addHandler(console_handler)

# Inicializar app
app = Flask(__name__)

app.config.from_object(config['development'])
app.secret_key = app.config['SECRET_KEY']
app.config['REMEMBER_COOKIE_DURATION'] = timedelta(days=7)

mail = Mail()

# Inicializar extensiones
csrf = CSRFProtect(app)
app.db = MySQL(app)
mail.init_app(app)

login_manager = LoginManager(app)
login_manager.login_view = 'auth_routes.login'
login_manager.login_message = 'Debes iniciar sesión para acceder a esta página.'
login_manager.login_message_category = "danger"

@login_manager.user_loader
def load_user(user_id):
    try:
        return ModelUser.get_by_id(app.db, user_id)
    except Exception as e:
        logger.error(f"[ERROR load_user]: {e}")
        return None

# Registrar rutas y errores
register_routes(app)
register_error_handlers(app)

# Ejecutar la app
if __name__ == '__main__':
    logger.info("Aplicación iniciada en modo desarrollo")
    app.run()
