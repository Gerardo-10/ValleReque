from src.models.entities.Financiamiento import Financiamiento


class ModelFinanciamiento:
    @classmethod
    def get_by_id(cls, db, id_financiamiento):
        try:
            cursor = db.connection.cursor()
            cursor.execute("CALL sp_financiamiento_por_id(%s)", (id_financiamiento,))
            row = cursor.fetchone()

            while cursor.nextset():
                pass

            if row is not None:
                financiamiento = Financiamiento(*row)
                return financiamiento

            return None
        except Exception as e:
            print(f"[ERROR get_by_id financiamiento {id_financiamiento}]: {e}")
            return None

    @classmethod
    def get_all(cls, db):
        try:
            cursor = db.connection.cursor()
            cursor.execute("CALL sp_listar_financiamientos()")
            rows = cursor.fetchall()

            while cursor.nextset():
                pass

            financiamientos = [Financiamiento(*row) for row in rows]

            return financiamientos
        except Exception as e:
            print(f"[ERROR get_all financiamientos]: {e}")
            return []

    @classmethod
    def insert(cls, db, financiamiento):
        try:
            cursor = db.connection.cursor()
            cursor.execute(
                "CALL sp_insertar_financiamiento(%s, %s, %s, %s, %s, %s, %s)",
                (financiamiento['tipo'], financiamiento['nombre'], financiamiento['monto'],
                 financiamiento['interes'], financiamiento['estado'], financiamiento['fecha_creacion'], financiamiento['imagen'])
            )

            while cursor.nextset():
                if cursor.description:
                    break

            cursor.execute("SELECT LAST_INSERT_ID()")
            id_financiamiento = cursor.fetchone()[0]

            db.connection.commit()
            return id_financiamiento
        except Exception as e:
            print(f"[ERROR insert financiamiento]: {e}")
            db.connection.rollback()
            return None

    @classmethod
    def update_status(cls, db, financiamiento, nuevo_estado):
        try:
            cursor = db.connection.cursor()
            cursor.execute("CALL sp_actualizar_estado_financiamiento(%s, %s)", (financiamiento, nuevo_estado))
            db.connection.commit()
            cursor.close()
            return True
        except Exception as ex:
            db.connection.rollback()
            print(f"Error al cambiar estados: {ex}")
            return False

    @classmethod
    def update(cls, db, financiamiento):
        try:
            cursor = db.connection.cursor()
            cursor.execute(
                "CALL sp_actualizar_financiamiento(%s, %s, %s, %s, %s, %s, %s)",
                (
                    financiamiento['id_financiamiento'],
                    financiamiento['nombre'],
                    financiamiento['monto'],
                    financiamiento['interes'],
                    financiamiento['tipo'],
                    financiamiento['fecha_creacion'],
                    financiamiento.get('imagen', None)  # puede venir vacío
                )
            )
            db.connection.commit()
            return True
        except Exception as e:
            db.connection.rollback()
            print(f"[ERROR update financiamiento]: {e}")
            return False
