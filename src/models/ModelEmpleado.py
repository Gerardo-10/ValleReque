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

    @staticmethod
    def get_all(db):
        cursor = db.connection.cursor()
        query = """
                SELECT e.id_empleado,
                       e.nombre_empleado,
                       e.apellido_empleado,
                       e.dni,
                       e.direccion,
                       e.telefono,
                       e.correo_electronico,
                       e.fecha_nacimiento,
                       a.nombre,
                       u.estado
                FROM empleado e
                         JOIN area a ON e.id_area = a.id_area
                         JOIN usuario u ON e.id_empleado = u.id_empleado;
                """
        cursor.execute(query)
        rows = cursor.fetchall()
        cursor.close()

        empleados = []
        for row in rows:
            emp = Empleado(*row[:8])  # los 8 primeros campos van al constructor
            emp.area = row[8]
            emp.estado = row[9]
            empleados.append(emp)
        return empleados

    @staticmethod
    def insert(db, empleado, id_area):
        try:
            cursor = db.connection.cursor()
            query = """
                    INSERT INTO empleado (nombre_empleado, \
                                          apellido_empleado, \
                                          dni, \
                                          direccion, \
                                          telefono, \
                                          correo_electronico, \
                                          fecha_nacimiento, \
                                          id_area) \
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s) \
                    """
            cursor.execute(query, (
                empleado.nombre,
                empleado.apellido,
                empleado.dni,
                empleado.direccion,
                empleado.telefono,
                empleado.correo,
                empleado.fecha_nacimiento,
                id_area
            ))
            db.connection.commit()
            cursor.close()
            return True
        except Exception as ex:
            print(f"Error en insert: {ex}")
            return False

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
