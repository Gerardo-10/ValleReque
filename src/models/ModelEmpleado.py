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
