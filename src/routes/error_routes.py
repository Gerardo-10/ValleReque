# src/routes/error_handlers.py
from flask import render_template, redirect, url_for, flash
import logging

logger = logging.getLogger(__name__)

def register_error_handlers(app):
    @app.errorhandler(401)
    def errors_401(error):
        logger.warning("Acceso no autorizado (401)")
        flash("Debes iniciar sesión para acceder a esta página.", "danger")
        return redirect(url_for('auth_routes.login'))

    @app.errorhandler(404)
    def errors_404(error):
        logger.error("Página no encontrada (404)")
        return render_template('errors/404.html'), 404
