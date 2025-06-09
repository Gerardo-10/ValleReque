import re

import MySQLdb
from werkzeug.security import generate_password_hash, check_password_hash
from src.models.entities.Empleado import Empleado
from email_validator import validate_email, EmailNotValidError


class ModelEmpleado:
    
    @classmethod
    def actualizar_info(cls, db, id_empleado, nombre, apellido, correo, telefono, fecha_nacimiento, direccion):
        try:
            cursor = db.connection.cursor()

            # Actualizar la información personal del empleado
            cursor.execute("""
                           UPDATE empleado
                           SET nombre_empleado = %s, apellido_empleado = %s, correo_electronico = %s,
                               telefono = %s, fecha_nacimiento = %s, direccion = %s
                           WHERE id_empleado = %s
                           """, (nombre, apellido, correo, telefono, fecha_nacimiento, direccion, id_empleado))

            db.connection.commit()
            cursor.close()
            return True, "Información actualizada correctamente"

        except Exception as ex:
            db.connection.rollback()
            print(f"Error en actualizar_info: {ex}")
            return False, str(ex)
        
    @classmethod
    def get_by_empleado_id(cls, db, id_empleado):
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
                       u.nombre_usuario,
                       r.denominacion,
                       u.estado,
                       u.id_usuario,
                       a.nombre
                FROM empleado e
                         LEFT JOIN area a ON e.id_area = a.id_area
                         LEFT JOIN usuario u ON e.id_empleado = u.id_empleado
                         LEFT JOIN Rol_Usuario ru on u.id_usuario = ru.id_usuario
                         LEFT JOIN rol r ON ru.id_rol = r.id_rol
                WHERE e.id_empleado = %s
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
                # Extraer y limpiar campos
                nombre = empleado['nombre'].strip()
                apellido = empleado['apellido'].strip()
                dni = empleado['dni'].strip()
                direccion = empleado['direccion'].strip()
                telefono = empleado['telefono'].strip()
                correo = empleado['correo'].strip()
                fecha_nacimiento = empleado['fecha_nacimiento'].strip()

                # Validar nombre (solo letras y espacios)
                if not re.fullmatch(r"[A-Za-zÁÉÍÓÚáéíóúÑñ ]{3,100}", nombre):
                    return False, "Nombre inválido. Solo letras y espacios, mínimo 3 caracteres", None

                # Validar apellido (mínimo dos palabras)
                if not re.fullmatch(r"([A-Za-zÁÉÍÓÚáéíóúÑñ]+ ){1,}[A-Za-zÁÉÍÓÚáéíóúÑñ]+$", apellido):
                    return False, "Apellido inválido. Debe contener al menos dos palabras", None

                # Validar DNI (8 dígitos)
                if not re.fullmatch(r"\d{8}", dni):
                    return False, "El DNI debe tener exactamente 8 dígitos", None

                # Validar teléfono (9 dígitos empezando con 9)
                if not re.fullmatch(r"^9\d{8}$", telefono):
                    return False, "Teléfono inválido. Debe comenzar con 9 y tener 9 dígitos", None

                # Validar dirección (mínimo 5 caracteres)
                if len(direccion) < 5:
                    return False, "La dirección debe tener al menos 5 caracteres", None

                # Validar correo electrónico sintáctico y dominio válido
                try:
                    valid = validate_email(correo, check_deliverability=True)
                    correo = valid.email  # normalizado
                except EmailNotValidError as e:
                    return False, f"Correo inválido: {str(e)}", None

                # Verificar si el correo ya está registrado
                cursor.execute("SELECT COUNT(*) FROM empleado WHERE correo_electronico = %s", (correo,))
                if cursor.fetchone()[0] > 0:
                    return False, "Este correo ya está registrado", None

                # Verificar si el DNI ya está registrado
                cursor.execute("SELECT COUNT(*) FROM empleado WHERE dni = %s", (dni,))
                if cursor.fetchone()[0] > 0:
                    return False, "El DNI ingresado ya está registrado", None

                # Verificar si el teléfono ya está registrado
                cursor.execute("SELECT COUNT(*) FROM empleado WHERE telefono = %s", (telefono,))
                if cursor.fetchone()[0] > 0:
                    return False, "El número de teléfono ya está registrado", None

                # Crear contraseña por defecto
                password_hash = generate_password_hash('123456')

                # Llamar al SP
                cursor.execute("""
                        CALL sp_crear_empleado(%s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """, (id_area, nombre, apellido, dni, direccion, telefono, correo, fecha_nacimiento, password_hash))

                # Obtener el nuevo ID
                cursor.execute("SELECT LAST_INSERT_ID()")
                new_id = cursor.fetchone()[0]
                empleado["id_empleado"] = new_id

                # Consultar nombre del área
                cursor.execute("SELECT nombre FROM area WHERE id_area = %s", (id_area,))
                area_row = cursor.fetchone()
                empleado["area"] = area_row[0] if area_row else "Desconocido"
                empleado["estado"] = 1

                db.connection.commit()
                return True, "Empleado creado con éxito", empleado

        except MySQLdb.OperationalError as e:
            error_msg = str(e.args[1])
            if "Error:" in error_msg:
                mensaje_limpio = error_msg.split("Error:")[1].strip(" '\"")
            else:
                mensaje_limpio = "Ocurrió un error inesperado al registrar el empleado."
            return False, mensaje_limpio, None

        except Exception as e:
            return False, "Error interno del servidor: " + str(e), None

    @classmethod
    def update_password(cls, db, id_empleado, current_password, new_password):
        try:
            with db.connection.cursor() as cursor:
                cursor.execute("""
                               SELECT u.pwd
                               FROM usuario u
                               WHERE u.id_empleado = %s
                               """, (id_empleado,))
                row = cursor.fetchone()

                if not row:
                    return False, "Usuario no encontrado"

                hash_actual = row[0]

                # Verificar contraseña actual
                if not check_password_hash(hash_actual, current_password):
                    return False, "La contraseña actual no es correcta"

                # Generar hash nuevo (usa una función fuerte por defecto como PBKDF2)
                hash_nuevo = generate_password_hash(new_password)

                cursor.execute("""
                               UPDATE usuario
                               SET pwd = %s
                               WHERE id_empleado = %s
                               """, (hash_nuevo, id_empleado))

                db.connection.commit()
                return True, "Contraseña actualizada correctamente"
        except Exception as ex:
            print(f"[ERROR] Error en update_password: {ex}")
            import traceback
            traceback.print_exc()
            return False, "Error interno"

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
    def cambiar_estado_empleados(cls, db, ids, nuevo_estado):
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

    @classmethod
    def actualizar_cuenta(cls, db, id_empleado, id_rol, id_area, estado):
        try:
            cursor = db.connection.cursor()

            # 1. Actualizar estado en usuario
            cursor.execute("""
                           UPDATE usuario
                           SET estado = %s
                           WHERE id_empleado = %s
                           """, (estado, id_empleado))

            # 2. Actualizar id_area en empleado
            cursor.execute("""
                           UPDATE empleado
                           SET id_area = %s
                           WHERE id_empleado = %s
                           """, (id_area, id_empleado))

            # 3. Actualizar rol en Rol_Usuario (asumiendo que hay 1 por usuario)
            cursor.execute("""
                           UPDATE Rol_Usuario ru
                               INNER JOIN usuario u ON ru.id_usuario = u.id_usuario
                           SET ru.id_rol = %s
                           WHERE u.id_empleado = %s
                           """, (id_rol, id_empleado))

            db.connection.commit()
            cursor.close()
            return True

        except Exception as ex:
            print(f"Error en actualizar_cuenta: {ex}")
            db.connection.rollback()
            return False
