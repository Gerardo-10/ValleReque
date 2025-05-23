from src.models.entities.Proyecto import Proyecto


class ModelProyecto:
    @classmethod
    def get_by_id(cls, db, id_proyecto):
        try:
            cursor = db.connection.cursor()
            cursor.execute("CALL sp_proyecto_por_id(%s)", (id_proyecto,))
            row = cursor.fetchone()

            # Liberar el resto del resultado del procedimiento si existe
            while cursor.nextset():
                pass

            if row is not None:
                proyecto = Proyecto(*row)
                return proyecto
            return None
        except Exception as e:
            print(f"[ERROR get_by_id proyecto {id_proyecto}]: {e}")
            return None

    @classmethod
    def get_all(cls, db):
        try:
            cursor = db.connection.cursor()
            cursor.execute("CALL sp_listar_proyectos()")
            rows = cursor.fetchall()

            # Liberar el resto del resultado del procedimiento si existe
            while cursor.nextset():
                pass

            proyectos = [Proyecto(*row) for row in rows]
            return proyectos
        except Exception as e:
            print(f"[ERROR get_all proyecto]: {e}")
            return []