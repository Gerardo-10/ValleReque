import random
from flask import current_app
from flask_mail import Message


def generate_verification_code(length=9):
    return ''.join([str(random.randint(0, 9)) for _ in range(length)])


def send_email(recipient, code):
    subject = 'Código de verificación - Recuperación de contraseña'
    body = f"""
    Hola,

    Tu código de verificación es: {code}

    Este código es válido por {current_app.config['CODE_EXPIRY_MINUTES']} minutos.

    Si no solicitaste esto, puedes ignorar este mensaje.

    Saludos,
    Sistema Valle Reque
    """

    msg = Message(subject=subject, recipients=[recipient], body=body)


    mail = current_app.extensions['mail']

    with current_app.app_context():
        mail.send(msg)
