from src.models.entities.User import User


class ModelUser:
    @classmethod
    def login(cls, db, username, password):
        try:
            cursor = db.connection.cursor()
            cursor.callproc('sp_login_validacion', [username])
            row = cursor.fetchone()
            if row is not None:
                id_usuario, nombre_usuario, password_hash, estado = row
                if not estado:  # Estado 0 = inactivo
                    print("[DEBUG] Usuario inactivo o no autorizado")
                    return None
                if User.check_password(password_hash, password):
                    print("[DEBUG] Contraseña correcta")
                    user = User(id_usuario=id_usuario, nombre_usuario=nombre_usuario)
                    return user, password_hash
                else:
                    print("[DEBUG] Contraseña incorrecta")
            else:
                print("[DEBUG] Usuario no encontrado")
            return None
        except Exception as e:
            print(f"[ERROR LOGIN]: {e}")
            import traceback
            traceback.print_exc()
            return None

    @classmethod
    def get_by_id(cls, db, id_usuario):
        try:
            cursor = db.connection.cursor()
            cursor.callproc('sp_usuario_por_id', [id_usuario])
            row = cursor.fetchone()
            if row is not None:
                return User(*row)
            return None
        except Exception as e:
            raise Exception(f"[ERROR get_by_id]: {e}")

    @classmethod
    def obtener_rol_estado_usuario(cls, db, id_usuario):
        try:
            cursor = db.connection.cursor()
            cursor.callproc('sp_obtener_rol_estado_usuario', [id_usuario])
            row = cursor.fetchone()

            if row is not None:
                rol, estado = row  # Suponiendo que la respuesta es un par: (rol, estado)
                return rol, estado
            return None, None
        except Exception as e:
            print(f"[ERROR obtener_datos_usuario]: {e}")
            import traceback
            traceback.print_exc()
            return None, None

    @classmethod
    def get_password_hash_by_id(cls, db, id_usuario):
        try:
            cursor = db.connection.cursor()
            cursor.execute("SELECT pwd FROM usuario WHERE id_usuario = %s", (id_usuario,))
            row = cursor.fetchone()
            cursor.close()
            if row:
                return row[0]
            return None
        except Exception as e:
            print(f"[ERROR get_password_hash_by_id]: {e}")
            return None

    @classmethod
    def update_password(cls, db, id_usuario, new_hash):
        try:
            cursor = db.connection.cursor()
            cursor.execute("UPDATE usuario SET pwd = %s WHERE id_usuario = %s", (new_hash, id_usuario))
            db.connection.commit()
            cursor.close()
        except Exception as e:
            print(f"[ERROR update_password]: {e}")
