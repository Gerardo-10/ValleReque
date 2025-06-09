from src.models.entities.Terreno import Terreno

class ModelTerreno:
    @classmethod
    def get_by_id(cls, db, id_terreno):
        try:
            cursor = db.connection.cursor()
            cursor.execute("CALL sp_terreno_por_id(%s)", (id_terreno,))
            row = cursor.fetchone()

            while cursor.nextset():
                pass

            if row is not None:
                return Terreno(*row)
            return None
        except Exception as e:
            print(f"[ERROR get_by_id terreno {id_terreno}]: {e}")
            return None

    @classmethod
    def get_all(cls, db):
        try:
            cursor = db.connection.cursor()
            # IMPORTANTE: crear este SP si aún no lo tienes
            cursor.execute("CALL sp_listar_terrenos()")
            rows = cursor.fetchall()

            while cursor.nextset():
                pass

            return [Terreno(*row) for row in rows]
        except Exception as e:
            print(f"[ERROR get_all terreno]: {e}")
            return []

    @classmethod
    def insert(cls, db, terreno, id_proyecto):
        try:
            cursor = db.connection.cursor()
            cursor.execute(
                "CALL sp_insertar_terreno(%s, %s, %s, %s, %s, %s, %s, %s, %s)",
                (
                    id_proyecto,  # 1
                    terreno['etapa'],  # 2
                    terreno['area'],  # 3
                    terreno['precio'],  # 4
                    terreno['estadoTerreno'],  # 5
                    terreno['tipoTerreno'],  # 6
                    terreno['manzana'],  # 7
                    terreno['lote'],  # 8
                    terreno['codigo_unidad']
                )
            )
            while cursor.nextset():
                if cursor.description:
                    break

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
            cursor.execute(
                "CALL sp_actualizar_terreno(%s, %s, %s, %s, %s, %s, %s, %s, %s)", (
                    id_terreno,
                    data['etapa'],
                    data['tipoTerreno'],
                    data['area'],
                    data['precio'],
                    data['estadoTerreno'],
                    data['manzana'],
                    data['lote'],
                    data['codigo_unidad']
                )
            )
            db.connection.commit()
            return True
        except Exception as e:
            print(f"[ERROR update terreno {id_terreno}]: {e}")
            db.connection.rollback()
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
            db.connection.rollback()
            return False

    @classmethod
    def validar_terreno(cls, db, id_proyecto, etapa, manzana, lote, estado_terreno):
        try:
            cursor = db.connection.cursor()

            # Ejecutar el procedimiento almacenado sp_validar_terreno con las variables de salida
            cursor.execute('''
                CALL sp_validar_terreno(%s, %s, %s, %s, %s, @codigo_unidad_existe, @etapa_valida)
            ''', (id_proyecto, etapa, manzana, lote, estado_terreno))

            # Ejecutar la consulta para obtener las variables de salida
            cursor.execute("SELECT @codigo_unidad_existe, @etapa_valida")
            result = cursor.fetchone()  # Recuperar las variables de salida
            
            if result is None:
                raise Exception("Las variables de salida no fueron recuperadas correctamente.")
            
            # Asignar los valores de salida a las variables locales y convertirlos a booleanos
            codigo_unidad_existe = bool(result[0])  # Convertir a booleano (0 -> False, 1 -> True)
            etapa_valida = bool(result[1])  # Convertir a booleano (0 -> False, 1 -> True)
            
            # Retornar los resultados como booleanos
            return codigo_unidad_existe, etapa_valida

        except Exception as e:
            print(f"[ERROR validar terreno]: {e}")
            db.connection.rollback()
            return None, None  # Retorna None si hubo un error

        finally:
            cursor.close() # Asegurarse de cerrar el cursor
    
    @classmethod
    def get_by_codigo_unidad(cls, db, codigo_unidad, id_proyecto, etapa):
        try:
            cursor = db.connection.cursor()
            cursor.execute("""
                SELECT * FROM terreno
                WHERE codigo_unidad = %s AND id_proyecto = %s AND etapa = %s AND estado_terreno != 'Eliminado'
            """, (codigo_unidad, id_proyecto, etapa))

            row = cursor.fetchone()
            if row:
                return Terreno(*row)  # Usa el constructor que ya tienes en tu entidad Terreno
            return None
        except Exception as e:
            print(f"[ERROR get_by_codigo_unidad]: {e}")
            return None