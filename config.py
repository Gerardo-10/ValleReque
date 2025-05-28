import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY')

    # Flask-Mail config
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = os.getenv('EMAIL_USERNAME')
    MAIL_PASSWORD = os.getenv('EMAIL_PASSWORD')
    MAIL_DEFAULT_SENDER = ('Sistema Valle Reque', 'EMAIL_USERNAME')

    CODE_EXPIRY_MINUTES = 15
    MAX_VERIFICATION_ATTEMPTS = 3
    CODE_LENGTH = 9


class DevelopmentConfig(Config):
    DEBUG = True
    MYSQL_HOST = '137.131.136.183'
    MYSQL_DB = 'DBValleReque'
    MYSQL_USER = 'useremote'
    MYSQL_PASSWORD = '12345@Remote'


config = {
    'development': DevelopmentConfig
}