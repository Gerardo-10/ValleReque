import json
from flask import current_app
from src.models.entities.Cliente import Cliente
from src.models.entities.Familiar import Familiar


class ModelCliente:
    @classmethod
    def get_by_id(cls, db, id_cliente):
        try:
            cursor = db.connection.cursor()
            cursor.execute("CALL sp_cliente_por_id(%s)", (id_cliente,))
            row = cursor.fetchone()
            while cursor.nextset():
                pass

            if row is not None:
                return Cliente(*row)
            return None
        except Exception as e:
            print(f"[ERROR get_by_id Cliente]: {e}")
            import traceback
            traceback.print_exc()
            return None

    @classmethod
    def get_all(cls, db):
        try:
            cursor = db.connection.cursor()
            cursor.execute("CALL sp_listar_clientes()")
            rows = cursor.fetchall()
            while cursor.nextset():
                pass
            clientes = [Cliente(*row) for row in rows]
            return clientes
        except Exception as e:
            print(f"[ERROR get_all Cliente]: {e}")
            import traceback
            traceback.print_exc()
            return []

    @classmethod
    def insert(cls, db, data):
        try:
            cursor = db.connection.cursor()
            cursor.execute("CALL sp_crear_cliente(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", (
                data['nombre'],
                data['apellido'],
                data['dni'],
                data['direccion'],
                data['correo'],
                data['telefono'],
                data['ocupacion'],
                data['ingreso_neto'],
                data['estado'],
                data['carga_familiar']
            ))
            cursor.execute("SELECT LAST_INSERT_ID()")
            id_cliente = cursor.fetchone()[0]
            db.connection.commit()
            return {**data, 'id_cliente': id_cliente}
        except Exception as e:
            print(f"[ERROR insert]: {e}")
            current_app.db.connection.rollback()
            raise e

    @classmethod
    def update(cls, db, id_cliente, data):
        try:
            cursor = db.connection.cursor()
            cursor.execute("CALL sp_actualizar_cliente(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", (
                int(id_cliente),
                data['nombre'],
                data['apellido'],
                data['dni'],
                data['direccion'],
                data['correo'],
                data['telefono'],
                data['ocupacion'],
                float(data['ingreso_neto']),
                data['estado'],
                int(data['carga_familiar'])
            ))
            db.connection.commit()
            return True
        except Exception as e:
            print(f"[ERROR update cliente {id_cliente}]: {e}")
            return False

    @classmethod
    def update_status(cls, db, clientes, nuevo_estado):
        try:
            clientes_json = json.dumps(clientes)
            cursor = db.connection.cursor()
            cursor.callproc('sp_actualizar_estado_cliente', [clientes_json, nuevo_estado])
            db.connection.commit()
            cursor.close()
            return True
        except Exception as e:
            print(f"[ERROR update_status]: {e}")
            return False

    @classmethod
    def delete(cls, db, ids):
        try:
            cursor = db.connection.cursor()
            for id_cliente in ids:
                cursor.execute("CALL sp_eliminar_cliente(%s)", (id_cliente,))
            db.connection.commit()
            return True
        except Exception as e:
            print(f"[ERROR delete]: {e}")
            return False
    
    @classmethod
    def get_by_dni(cls, db, dni):
        try:
            cursor = db.connection.cursor()
            cursor.execute("CALL sp_cliente_por_dni(%s)", (dni,))
            row = cursor.fetchone()
            while cursor.nextset():
                pass

            if row is not None:
                return Cliente(*row)
            return None
        except Exception as e:
            print(f"[ERROR get_by_dni Cliente]: {e}")
            return None


# ---------------------------
# EXTENSIÓN: ModelFamiliar
# ---------------------------

class ModelFamiliar:
    @classmethod
    def get_by_cliente(cls, db, id_cliente):
        try:
            cursor = db.connection.cursor()
            cursor.execute("CALL sp_familiar_por_cliente(%s)", (id_cliente,))
            row = cursor.fetchone()
            while cursor.nextset():
                pass
            if row:
                return Familiar(*row)
            return None
        except Exception as e:
            print(f"[ERROR get_by_cliente Familiar]: {e}")
            return None

    @classmethod
    def update_or_insert(cls, db, id_cliente, nombre, apellido, documento):
        try:
            cursor = db.connection.cursor()
            cursor.execute("CALL sp_actualizar_familiar(%s, %s, %s, %s)",
                        (int(id_cliente), nombre, apellido, documento))
            db.connection.commit()
            return True
        except Exception as e:
            print(f"[ERROR update_or_insert Familiar]: {e}")
        raise  # Muy importante: relanzar para que el Blueprint lo capture correctamente
    
    @classmethod
    def delete(cls, db, id_cliente):
        try:
            cursor = db.connection.cursor()
            cursor.execute("CALL sp_eliminar_familiar(%s)", (id_cliente,))
            db.connection.commit()
            return True
        except Exception as e:
            print(f"[ERROR delete Familiar]: {e}")
            return False
