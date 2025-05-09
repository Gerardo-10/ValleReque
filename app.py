from flask import Flask, render_template, request, redirect, url_for, flash, session, make_response
from flask_mysqldb import MySQL
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from config import config
from dotenv import load_dotenv
from flask_wtf.csrf import CSRFProtect

from src.models.ModelCliente import ModelCliente
from src.models.ModelEmpleado import ModelEmpleado
from src.models.ModelUser import ModelUser
from src.models.entities.User import User

# Configuración de logs
import logging
from logging.handlers import RotatingFileHandler
import os

# Cargar variables de entorno
load_dotenv()

# Crear directorio de logs si no existe
if not os.path.exists('logs'):
    os.mkdir('logs')

# Logger nombrado
logger = logging.getLogger('appLogger')
logger.setLevel(logging.DEBUG if config['development'].DEBUG else logging.INFO)

# Formato de los logs
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(name)s - %(message)s')

# Log a archivo
file_handler = RotatingFileHandler('logs/app.log', maxBytes=1000000, backupCount=3, encoding='utf-8')
file_handler.setFormatter(formatter)
logger.addHandler(file_handler)

# Log a consola
console_handler = logging.StreamHandler()
console_handler.setFormatter(formatter)
logger.addHandler(console_handler)

# Inicializar Flask App
app = Flask(__name__)
app.config.from_object(config['development'])
app.secret_key = app.config['SECRET_KEY']

# Inicializar extensiones
csrf = CSRFProtect(app)
db = MySQL(app)

# Login Manager
login_manager = LoginManager(app)
login_manager.login_view = 'login'
login_manager.login_message = 'Debes iniciar sesión para acceder a esta página.'
login_manager.login_message_category = "danger"


@login_manager.user_loader
def load_user(user_id):
    try:
        return ModelUser.get_by_id(db, user_id)
    except Exception as e:
        print(f"[ERROR load_user]: {e}")
        return None


# Rutas
@app.route('/')
def index():
    return redirect(url_for('login'))


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        logger.info(f"Intento de login para el usuario: {username}")

        # Intentamos autenticar al usuario con el modelo
        logged_user = ModelUser.login(db, username, password)

        if logged_user:
            session['user_id'] = logged_user.id_usuario
            session['username'] = logged_user.username
            login_user(logged_user)
            logger.info(f"Login exitoso para el usuario: {username}")
            return redirect(url_for('home'))
        else:
            logger.warning(f"Login fallido para el usuario: {username}")
            flash("Credenciales Incorrectas", "danger")
            return redirect(url_for('login'))
    return render_template('auth/login.html')


@app.route('/logout')
def logout():
    logger.info(f"Usuario cerró sesión: {session.get('username')}")
    logout_user()
    session.clear()
    return redirect(url_for('login'))


@app.route('/home')
@login_required
def home():
    return render_template('home.html')


@app.route('/sidebar')
@login_required
def sidebar():
    empleado = ModelEmpleado.get_by_empleado_id(db, current_user.id_usuario)
    rol, estado = ModelUser.obtener_datos_usuario(db, current_user.id_usuario)
    return render_template('sidebar.html', empleado=empleado, rol=rol, estado=estado)


@app.route('/seguridad')
@login_required
def seguridad():
    return render_template('seguridad.html')

@app.route('/clientes')
@login_required
def clientes():
    cliente = ModelCliente.get_all(db)
    return render_template('logistica/clientes.html', clientes=cliente)

@app.route('/detalle_clientes/<int:id_cliente>')
@login_required
def detalle_clientes(id_cliente):
    cliente = ModelCliente.get_by_id(db, id_cliente)
    return render_template('logistica/detalle_clientes.html', cliente=cliente, )

@app.route('/perfil')
@login_required
def perfil():
    empleado = ModelEmpleado.get_by_empleado_id(db, current_user.id_usuario)
    rol, estado = ModelUser.obtener_datos_usuario(db, current_user.id_usuario)
    return render_template('auth/perfil.html', empleado=empleado, rol=rol, estado=estado)


@app.route('/protected')
@login_required
def protected():
    return render_template('protected.html')


# Manejadores de errores
def errors_401(error):
    logger.warning("Acceso no autorizado (401)")
    flash("Debes iniciar sesión para acceder a esta página.", "danger")
    return redirect(url_for('login'))


def errors_404(error):
    logger.error("Página no encontrada (404)")
    return render_template('errors/404.html'), 404


# Ejecutar aplicación
if __name__ == '__main__':
    app.config.from_object(config['development'])
    app.register_error_handler(401, errors_401)
    app.register_error_handler(404, errors_404)
    logger.info("Aplicación iniciada en modo desarrollo")
    app.run()
