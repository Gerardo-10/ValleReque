from src.models.entities.Terreno import Terreno


class ModelTerreno:
    @classmethod
    def get_by_id(cls, db, id_terreno):
        try:
            cursor = db.connection.cursor()
            cursor.execute("CALL sp_terreno_por_id(%s)", (id_terreno,))
            row = cursor.fetchone()

            # Liberar el resto del resultado del procedimiento si existe
            while cursor.nextset():
                pass

            if row is not None:
                terreno = Terreno(*row)
                return terreno
            return None
        except Exception as e:
            print(f"[ERROR get_by_id terreno {id_terreno}]: {e}")
            return None

    @classmethod
    def get_all(cls, db):
        try:
            cursor = db.connection.cursor()
            cursor.execute("CALL sp_listar_terrenos()")
            rows = cursor.fetchall()

            # Liberar el resto del resultado del procedimiento si existe
            while cursor.nextset():
                pass

            terrenos = [Terreno(*row) for row in rows]
            return terrenos
        except Exception as e:
            print(f"[ERROR get_all terreno]: {e}")
            return []

    @classmethod
    def insert(cls, db, terreno, id_proyecto):
        try:
            cursor = db.connection.cursor()
            cursor.execute(
                "CALL sp_insertar_terreno(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                (id_proyecto, terreno['etapa'], terreno['unidad'], terreno['tipoTerreno'],
                 terreno['area'], terreno['precio'], terreno['estadoTerreno'], terreno['manzana'], terreno['lote'],
                 terreno['codigo_unidad'])
            )

            # Consumir todos los resultados hasta encontrar el SELECT
            while cursor.nextset():
                if cursor.description:
                    break

            # Obtener el último ID insertado
            cursor.execute("SELECT LAST_INSERT_ID()")
            id_terreno = cursor.fetchone()[0]

            db.connection.commit()
            return id_terreno
        except Exception as e:
            print(f"[ERROR insert terreno]: {e}")
            db.connection.rollback()
            return False

    @classmethod
    def update(cls, db, id_terreno, data):
        try:
            cursor = db.connection.cursor()
            cursor.execute("CALL sp_actualizar_terreno(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", (
                id_terreno,
                data['etapa'],
                data['unidad'],
                data['tipoTerreno'],
                data['area'],
                data['precio'],
                data['estadoTerreno'],
                data['manzana'],
                data['lote'],
                data['codigo_unidad']
            ))
            db.connection.commit()
            return True
        except Exception as e:
            print(f"[ERROR update terreno {id_terreno}]: {e}")
            return False

    @classmethod
    def delete(cls, db, id_terreno):
        try:
            cursor = db.connection.cursor()
            cursor.execute("CALL sp_eliminar_terreno(%s)", (id_terreno,))
            db.connection.commit()
            return True
        except Exception as e:
            print(f"[ERROR delete terreno {id_terreno}]: {e}")
            return False