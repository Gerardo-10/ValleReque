from werkzeug.security import check_password_hash
from flask_login import UserMixin


class User(UserMixin):
    def __init__(self, id_usuario, nombre_usuario):
        self.id_usuario = id_usuario
        self.username = nombre_usuario

    @classmethod
    def check_password(cls, hashed_password, password):
        return check_password_hash(hashed_password, password)

    def get_id(self):
        return str(self.id_usuario)
