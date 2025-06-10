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

    @classmethod
    def insert(cls, db, proyecto):
        try:
            cursor = db.connection.cursor()
            # Llamar al procedimiento almacenado con todos los parámetros
            cursor.execute(
                "CALL sp_insertar_proyecto(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                (
                    proyecto.nombre_proyecto,
                    proyecto.direccion,
                    proyecto.inversion,
                    proyecto.cantidad_lotes,
                    proyecto.cantidad_etapas,
                    proyecto.precio_parque,
                    proyecto.precio_esquina,
                    proyecto.precio_calle,
                    proyecto.precio_avenida,
                    proyecto.precio_esquina_parque,
                    proyecto.foto_ref,
                    proyecto.estado
                )
            )
            db.connection.commit()

            # Obtener el ID del proyecto insertado (modificado para mayor confiabilidad)
            cursor.execute("SELECT LAST_INSERT_ID()")
            proyecto.id_proyecto = cursor.fetchone()[0]
            cursor.close()

            return True
        except Exception as e:
            print(f"[ERROR insert proyecto]: {e}")
            db.connection.rollback()
            return False

    @classmethod
    def get_activos(cls, db):
        try:
            cursor = db.connection.cursor()
            cursor.execute("CALL obtener_proyectos_activos()")
            rows = cursor.fetchall()

            # Liberar el resto del resultado del procedimiento si existe
            while cursor.nextset():
                pass

            proyectos = [Proyecto(*row) for row in rows]
            return proyectos
        except Exception as e:
            print(f"[ERROR get_activos proyecto]: {e}")
            return []