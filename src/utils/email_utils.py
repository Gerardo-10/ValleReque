import random
from flask import current_app
from flask_mail import Message
import os

def generate_verification_code(length=9):
    return ''.join([str(random.randint(0, 9)) for _ in range(length)])

def send_email(recipient, code):
    formatted_code = '-'.join([code[i:i + 3] for i in range(0, len(code), 3)])

    subject = 'Código de verificación - Recuperación de contraseña'
    body = f"""
        <html>
        <head>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                }}
                .container {{
                    background-color: #fafafa;
                    padding: 30px;
                    border-radius: 8px;
                    max-width: 600px;
                    margin: 0 auto;
                }}
                h1 {{
                    color: #4CAF50;
                }}
                .code {{
                    font-size: 24px;
                    font-weight: bold;
                    background-color: #f1f1f1;
                    padding: 10px;
                    border-radius: 4px;
                    text-align: center;
                }}
                .footer {{
                    margin-top: 30px;
                    font-size: 12px;
                    color: #888;
                    text-align: center;
                }}
                .logo {{
                    width: 100px;
                    margin-bottom: 10px;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div style="background: #fff; padding: 30px; border: 1px solid #ddd; border-radius: 4px">
                    <img src="cid:logo_image" alt="Logo" class="logo" />
                    <hr/>
                    <h1>Código de Verificación</h1>
                    <div style="margin: 10px 0; color:#333 !important;">Hola,</div>
                    <div style="margin: 10px 0; color:#333 !important;">Tu código de verificación es:</div>
                    <div class="code">{formatted_code}</div>
                    <div style="margin: 10px 0; color:#333 !important;">Este código es válido por {current_app.config['CODE_EXPIRY_MINUTES']} minutos.</div>
                    <div style="margin: 10px 0; color:#333 !important;">Si no solicitaste esto, puedes ignorar este mensaje.</div>
                    <div class="footer">
                        <p>Saludos,<br>Sistema Valle Reque</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """

    msg = Message(subject=subject, recipients=[recipient], html=body)

    ruta_imagen = os.path.join(current_app.root_path, 'static', 'img', 'valle-reque-email.png')
    with open(ruta_imagen, 'rb') as f:
        image_data = f.read()

    msg.attach(
        'valle-reque-email.png',
        'image/png',
        image_data,
        disposition='inline',
        headers={'Content-ID': '<logo_image>'}
    )

    mail = current_app.extensions.get('mail')
    if mail is None:
            raise RuntimeError("Flask-Mail no está inicializado correctamente")

    mail.send(msg)
