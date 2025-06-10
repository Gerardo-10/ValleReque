from flask import Blueprint, request, jsonify, current_app
from flask_login import current_user
from src.services.email_service_memory import InMemoryEmailService

verification_memory_bp = Blueprint('verification_memory_routes', __name__)


@verification_memory_bp.route('/send-verification-code', methods=['POST'])
def send_verification_code():
    """Envía un código de verificación por email (sin base de datos)"""
    try:
        data = request.get_json()

        if not data:
            return jsonify({
                'success': False,
                'message': 'No se recibieron datos'
            }), 400

        email = data.get('email', '').strip().lower()
        user_name = data.get('user_name', 'Usuario').strip()

        if not email:
            return jsonify({
                'success': False,
                'message': 'Email es requerido'
            }), 400

        # Validar formato de email
        if '@' not in email or '.' not in email:
            return jsonify({
                'success': False,
                'message': 'Formato de email inválido'
            }), 400

        # MODIFICACIÓN: Eliminar validación específica de Gmail o Hotmail
        # Ahora acepta cualquier correo con formato válido

        # Crear y enviar código
        success, message = InMemoryEmailService.create_and_send_verification_code(
            email, user_name
        )

        if success:
            current_app.logger.info(f"Código de verificación enviado a: {email}")
            return jsonify({
                'success': True,
                'message': message,
                'email': email
            }), 200
        else:
            current_app.logger.error(f"Error enviando código a {email}: {message}")
            return jsonify({
                'success': False,
                'message': message
            }), 500

    except Exception as e:
        current_app.logger.error(f"Error en send_verification_code: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Error interno del servidor'
        }), 500


@verification_memory_bp.route('/verify-code', methods=['POST'])
def verify_code():
    """Verifica un código de verificación (sin base de datos)"""
    try:
        data = request.get_json()

        if not data:
            return jsonify({
                'success': False,
                'message': 'No se recibieron datos'
            }), 400

        email = data.get('email', '').strip().lower()
        code = data.get('code', '').strip().upper()

        if not email or not code:
            return jsonify({
                'success': False,
                'message': 'Email y código son requeridos'
            }), 400

        # Verificar código
        success, message = InMemoryEmailService.verify_code(email, code)

        if success:
            current_app.logger.info(f"Código verificado exitosamente para: {email}")
            return jsonify({
                'success': True,
                'message': message,
                'email': email
            }), 200
        else:
            current_app.logger.warning(f"Verificación fallida para {email}: {message}")
            return jsonify({
                'success': False,
                'message': message
            }), 400

    except Exception as e:
        current_app.logger.error(f"Error en verify_code: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Error interno del servidor'
        }), 500


@verification_memory_bp.route('/resend-verification-code', methods=['POST'])
def resend_verification_code():
    """Reenvía un código de verificación (sin base de datos)"""
    try:
        data = request.get_json()

        if not data:
            return jsonify({
                'success': False,
                'message': 'No se recibieron datos'
            }), 400

        email = data.get('email', '').strip().lower()
        user_name = data.get('user_name', 'Usuario').strip()

        if not email:
            return jsonify({
                'success': False,
                'message': 'Email es requerido'
            }), 400

        # Eliminar código anterior
        InMemoryEmailService.delete_code(email)

        # Crear y enviar nuevo código
        success, message = InMemoryEmailService.create_and_send_verification_code(
            email, user_name
        )

        if success:
            current_app.logger.info(f"Código reenviado a: {email}")
            return jsonify({
                'success': True,
                'message': 'Código reenviado exitosamente',
                'email': email
            }), 200
        else:
            current_app.logger.error(f"Error reenviando código a {email}: {message}")
            return jsonify({
                'success': False,
                'message': message
            }), 500

    except Exception as e:
        current_app.logger.error(f"Error en resend_verification_code: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Error interno del servidor'
        }), 500


@verification_memory_bp.route('/verification-status', methods=['GET'])
def verification_status():
    """Obtiene el estado de verificaciones (para debugging)"""
    try:
        status = InMemoryEmailService.get_verification_status()
        return jsonify({
            'success': True,
            'status': status
        }), 200
    except Exception as e:
        current_app.logger.error(f"Error obteniendo estado: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Error interno del servidor'
        }), 500
