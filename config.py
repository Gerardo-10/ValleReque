import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY')

class DevelopmentConfig(Config):
    DEBUG = True
    MYSQL_HOST = '137.131.136.183'
    MYSQL_DB = 'DBValleReque'
    MYSQL_USER = 'useremote'
    MYSQL_PASSWORD = '12345@Remote'


config = {
    'development': DevelopmentConfig
}