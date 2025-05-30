import json

from src.models.entities.Cliente import Cliente


class ModelCliente:
    @classmethod
    def get_by_id(cls, db, id_cliente):
        try:
            cursor = db.connection.cursor()
            cursor.execute("CALL sp_cliente_por_id(%s)", (id_cliente,))  # Llama a un procedimiento almacenado
            row = cursor.fetchone()

            # Liberar el resto del resultado del procedimiento si existe
            while cursor.nextset():
                pass

            if row is not None:
                # Ajusta los índices según el orden en tu procedimiento almacenado
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
            cursor.execute("CALL sp_listar_clientes()")  # Asegúrate de tener este SP creado en tu BD
            rows = cursor.fetchall()

            # Liberar el resto del resultado del procedimiento si existe
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

            # Obtener el último ID insertado
            cursor.execute("SELECT LAST_INSERT_ID()")
            id_cliente = cursor.fetchone()[0]

            db.connection.commit()
            return {**data, 'id_cliente': id_cliente}
        except Exception as e:
            print(f"[ERROR insert]: {e}")
            return False

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
            # Convertir la lista de IDs de clientes a JSON
            clientes_json = json.dumps(clientes)

            # Crear cursor y llamar al procedimiento almacenado
            cursor = db.connection.cursor()
            cursor.callproc('sp_actualizar_estado_cliente', [clientes_json, nuevo_estado])

            # Confirmar cambios en la base de datos
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
