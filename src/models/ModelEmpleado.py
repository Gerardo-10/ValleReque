from src.models.entities.Empleado import Empleado


class ModelEmpleado:
    @staticmethod
    def get_by_empleado_id(db, id_empleado):
        cursor = db.connection.cursor()
        query = """
                SELECT id_empleado,
                       nombre_empleado,
                       apellido_empleado,
                       dni,
                       direccion,
                       telefono,
                       correo_electronico,
                       fecha_nacimiento
                FROM empleado
                WHERE id_empleado = %s
                """
        cursor.execute(query, (id_empleado,))
        row = cursor.fetchone()
        cursor.close()

        if row:
            return Empleado(*row)
        else:
            return None

    @classmethod
    def get_all(cls, db):
        try:
            cursor = db.connection.cursor()
            cursor.execute("CALL sp_listar_empleados()")
            rows = cursor.fetchall()
            while cursor.nextset():
                pass
            empleados = []
            for row in rows:
                empleado = {
                    "id_empleado": row[0],
                    "nombres": row[1],
                    "apellidos": row[2],
                    "dni": row[3],
                    "area": row[8],  # nombre del área, si lo cambias en el SP
                    "estado": row[9]
                }
                empleados.append(empleado)
                print(empleados)
            return empleados
        except Exception as e:
            print(f"[ERROR get_all Empleado]: {e}")
            import traceback
            traceback.print_exc()
            return []

    @classmethod
    def insert(cls, db, empleado, id_area):
        try:
            with db.connection.cursor() as cursor:
                sql = """
                CALL sp_crear_empleado(
                    %s, %s, %s, %s, %s, %s, %s, %s
                )
                """
                cursor.execute(sql, (
                    id_area,
                    empleado['nombre'],
                    empleado['apellido'],
                    empleado['dni'],
                    empleado['direccion'],
                    empleado['telefono'],
                    empleado['correo'],
                    empleado['fecha_nacimiento']
                ))

                cursor.execute("SELECT LAST_INSERT_ID()")
                new_id = cursor.fetchone()[0]
                empleado["id_empleado"] = new_id

                # Obtener nombre del área
                cursor.execute("SELECT nombre FROM area WHERE id_area = %s", (id_area,))
                area_row = cursor.fetchone()
                empleado["id_empleado"] = new_id

                # Obtener nombre del área
                cursor.execute("SELECT nombre FROM area WHERE id_area = %s", (id_area,))
                area_row = cursor.fetchone()
                empleado["area"] = area_row[0] if area_row else "Desconocido"

                # Estado fijo como entero (por defecto 1 = Activo)
                empleado["estado"] = 1

                db.connection.commit()
                return True, "Empleado creado con éxito", empleado

        except Exception as ex:
            db.connection.rollback()
            return False, f"Error: {str(ex)}", None

    @staticmethod
    def update(db, empleado, id_area):
        try:
            cursor = db.connection.cursor()
            query = """
                    UPDATE empleado
                    SET nombre_empleado    = %s,
                        apellido_empleado  = %s,
                        dni                = %s,
                        direccion          = %s,
                        telefono           = %s,
                        correo_electronico = %s,
                        fecha_nacimiento   = %s,
                        id_area            = %s
                    WHERE id_empleado = %s \
                    """
            cursor.execute(query, (
                empleado.nombre,
                empleado.apellido,
                empleado.dni,
                empleado.direccion,
                empleado.telefono,
                empleado.correo,
                empleado.fecha_nacimiento,
                id_area,
                empleado.id_empleado
            ))
            db.connection.commit()
            cursor.close()
            return True
        except Exception as ex:
            print(f"Error en update: {ex}")
            return False

    @staticmethod
    def delete(db, id_empleado):
        try:
            cursor = db.connection.cursor()
            query = "DELETE FROM empleado WHERE id_empleado = %s"
            cursor.execute(query, (id_empleado,))
            db.connection.commit()
            cursor.close()
            return True
        except Exception as ex:
            print(f"Error en delete: {ex}")
            return False

    @classmethod
    def cambiar_estado_empleados(cls,db, ids, nuevo_estado):
        try:
            cursor = db.connection.cursor()
            print(f"▶️ Ejecutando SP con ids={ids} y estado={nuevo_estado}")
            for id_empleado in ids:
                cursor.execute("CALL sp_actualizar_estado_empleado_rol(%s, %s)", (id_empleado, nuevo_estado))
            db.connection.commit()
            cursor.close()
            return True, "Estados actualizados correctamente."
        except Exception as ex:
            db.connection.rollback()
            print(f"Error al cambiar estados: {ex}")
            return False, str(ex)

