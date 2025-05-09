from src.models.entities.Cliente import Cliente


class ModelCliente:
    @classmethod
    def get_by_id(cls, db, id_cliente):
        try:
            cursor = db.connection.cursor()
            cursor.execute("CALL sp_cliente_por_id(%s)", (id_cliente,)) # Llama a un procedimiento almacenado
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
            cursor.execute("CALL sp_clientes_todos()")  # Asegúrate de tener este SP creado en tu BD
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