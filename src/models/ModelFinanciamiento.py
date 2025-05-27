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