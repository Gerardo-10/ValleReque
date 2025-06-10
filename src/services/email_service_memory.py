import random
import string
import time
from datetime import datetime, timedelta
from flask import current_app
from flask_mail import Message


class InMemoryEmailService:
    # Almacenamiento en memoria para códigos de verificación
    verification_codes = {}

    @staticmethod
    def generate_verification_code():
        """Genera un código de verificación en formato XXX-XXX"""
        # Generar 6 caracteres alfanuméricos
        chars = string.ascii_uppercase + string.digits
        code_chars = ''.join(random.choices(chars, k=6))

        # Formatear como XXX-XXX
        formatted_code = f"{code_chars[:3]}-{code_chars[3:6]}"
        return formatted_code

    @staticmethod
    def clean_expired_codes():
        """Limpia códigos expirados del almacenamiento en memoria"""
        current_time = datetime.now()
        expired_emails = []

        for email, data in InMemoryEmailService.verification_codes.items():
            if current_time > data['expires_at']:
                expired_emails.append(email)

        for email in expired_emails:
            del InMemoryEmailService.verification_codes[email]

    @staticmethod
    def send_verification_email(email, code, user_name="Usuario"):
        """Envía el código de verificación por email"""
        try:
            from app import mail

            subject = "Código de Verificación - Sistema Valle Reque"

            html_body = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ background-color: #4CAF50; color: white; padding: 20px; text-align: center; }}
                    .content {{ background-color: #f9f9f9; padding: 30px; }}
                    .code {{ 
                        font-size: 32px; 
                        font-weight: bold; 
                        color: #4CAF50; 
                        text-align: center; 
                        padding: 20px; 
                        background-color: white; 
                        border: 2px dashed #4CAF50; 
                        margin: 20px 0; 
                        letter-spacing: 4px;
                        font-family: 'Courier New', monospace;
                    }}
                    .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🛡️ Sistema Valle Reque</h1>
                    </div>
                    <div class="content">
                        <h2>Hola {user_name},</h2>
                        <p>Has solicitado verificar tu dirección de correo electrónico.</p>
                        <p><strong>Tu código de verificación es:</strong></p>
                        <div class="code">{code}</div>
                        <p><strong>⚠️ Importante:</strong></p>
                        <ul>
                            <li>Este código expira en <strong>15 minutos</strong></li>
                            <li>Solo tienes <strong>3 intentos</strong> para verificarlo</li>
                            <li>No compartas este código con nadie</li>
                            <li>Si no solicitaste este código, ignora este mensaje</li>
                        </ul>
                        <p>Ingresa este código en la ventana de verificación para continuar.</p>
                    </div>
                    <div class="footer">
                        <p>Este es un mensaje automático, no responder a este email.</p>
                        <p>&copy; 2024 Sistema Valle Reque. Todos los derechos reservados.</p>
                    </div>
                </div>
            </body>
            </html>
            """

            text_body = f"""
            Sistema Valle Reque - Código de Verificación

            Hola {user_name},

            Tu código de verificación es: {code}

            Este código expira en 15 minutos.
            Solo tienes 3 intentos para verificarlo.
            No compartas este código con nadie.

            Si no solicitaste este código, ignora este mensaje.

            Sistema Valle Reque
            """

            msg = Message(
                subject=subject,
                recipients=[email],
                html=html_body,
                body=text_body
            )

            mail.send(msg)
            return True, "Código enviado exitosamente"

        except Exception as e:
            current_app.logger.error(f"Error enviando email: {str(e)}")
            return False, f"Error enviando email: {str(e)}"

    @staticmethod
    def create_and_send_verification_code(email, user_name="Usuario"):
        """Crea y envía un código de verificación (almacenamiento en memoria)"""
        try:
            # Limpiar códigos expirados
            InMemoryEmailService.clean_expired_codes()

            # Generar código
            code = InMemoryEmailService.generate_verification_code()

            # Calcular tiempo de expiración
            expires_at = datetime.now() + timedelta(minutes=15)

            # Guardar en memoria
            InMemoryEmailService.verification_codes[email] = {
                'code': code,
                'attempts': 0,
                'expires_at': expires_at,
                'created_at': datetime.now(),
                'user_name': user_name
            }

            # Enviar email
            email_success, email_message = InMemoryEmailService.send_verification_email(
                email, code, user_name
            )

            if not email_success:
                # Si falla el envío, eliminar el código
                if email in InMemoryEmailService.verification_codes:
                    del InMemoryEmailService.verification_codes[email]
                return False, email_message

            current_app.logger.info(f"Código creado para {email}: {code} (expira: {expires_at})")
            return True, "Código de verificación enviado exitosamente"

        except Exception as e:
            current_app.logger.error(f"Error creando código de verificación: {str(e)}")
            return False, f"Error interno del servidor: {str(e)}"

    @staticmethod
    def verify_code(email, code):
        """Verifica un código de verificación (almacenamiento en memoria)"""
        try:
            # Limpiar códigos expirados
            InMemoryEmailService.clean_expired_codes()

            # Verificar si existe el código para este email
            if email not in InMemoryEmailService.verification_codes:
                return False, "No hay código de verificación para este email"

            code_data = InMemoryEmailService.verification_codes[email]

            # Verificar si el código ha expirado
            if datetime.now() > code_data['expires_at']:
                del InMemoryEmailService.verification_codes[email]
                return False, "El código ha expirado"

            # Verificar intentos máximos
            if code_data['attempts'] >= 3:
                del InMemoryEmailService.verification_codes[email]
                return False, "Máximo número de intentos alcanzado"

            # Incrementar intentos
            code_data['attempts'] += 1

            # Verificar código
            if code_data['code'] == code:
                # Código correcto, eliminar de memoria
                del InMemoryEmailService.verification_codes[email]
                current_app.logger.info(f"Código verificado exitosamente para {email}")
                return True, "Código verificado exitosamente"
            else:
                # Código incorrecto
                remaining_attempts = 3 - code_data['attempts']
                if remaining_attempts > 0:
                    return False, f"Código incorrecto. Te quedan {remaining_attempts} intentos"
                else:
                    del InMemoryEmailService.verification_codes[email]
                    return False, "Código incorrecto. Máximo número de intentos alcanzado"

        except Exception as e:
            current_app.logger.error(f"Error verificando código: {str(e)}")
            return False, f"Error interno: {str(e)}"

    @staticmethod
    def delete_code(email):
        """Elimina código de verificación para un email"""
        try:
            if email in InMemoryEmailService.verification_codes:
                del InMemoryEmailService.verification_codes[email]
            return True, "Código eliminado"
        except Exception as e:
            current_app.logger.error(f"Error eliminando código: {str(e)}")
            return False, f"Error eliminando código: {str(e)}"

    @staticmethod
    def get_verification_status():
        """Obtiene el estado actual de verificaciones (para debugging)"""
        InMemoryEmailService.clean_expired_codes()
        return {
            'active_codes': len(InMemoryEmailService.verification_codes),
            'codes': {email: {
                'attempts': data['attempts'],
                'expires_at': data['expires_at'].isoformat(),
                'created_at': data['created_at'].isoformat()
            } for email, data in InMemoryEmailService.verification_codes.items()}
        }
