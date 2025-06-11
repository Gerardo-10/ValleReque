from src.models.ModelTerreno import ModelTerreno
from src.models.entities.Proyecto import Proyecto
from src.models.entities.Terreno import Terreno  # Asegúrate de que esta importación exista


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

            while cursor.nextset():
                pass

            proyectos = [Proyecto(*row) for row in rows]
            return proyectos
        except Exception as e:
            print(f"[ERROR get_activos proyecto]: {e}")
            return []

    @classmethod
    def insertar_terrenos_por_etapa(cls, db, id_proyecto, etapas_data, precios_proyecto):
        try:
            cursor = db.connection.cursor()
            AREA_POR_DEFECTO = 90.0
            ESTADO_POR_DEFECTO = 'Disponible'

            for etapa_info in etapas_data:
                etapa_num = etapa_info['numero']
                for manzana_info in etapa_info['manzanas']:
                    manzana_letra = manzana_info['letra']
                    lotes_manzana = manzana_info['lotes']
                    terrenos_tipos = manzana_info['terrenos']

                    # Si no hay tipos de terreno definidos, se asume todo 'Calle'
                    if not terrenos_tipos:
                        terrenos_tipos = [{'tipo': 'Calle', 'cantidad': lotes_manzana}]

                    lote_actual_en_manzana = 1
                    for tipo_terreno_info in terrenos_tipos:
                        tipo_terreno = tipo_terreno_info['tipo']
                        cantidad_por_tipo = tipo_terreno_info['cantidad']

                        # Obtener el precio por m² según el tipo de terreno
                        # Usar .get() para evitar errores si un tipo no existe, aunque ya los validamos
                        precio_m2 = float(precios_proyecto.get(tipo_terreno, 0.0))

                        for _ in range(cantidad_por_tipo):
                            precio_terreno = AREA_POR_DEFECTO * precio_m2
                            codigo_unidad = f"{manzana_letra} - {lote_actual_en_manzana}"

                            # Crear un objeto Terreno (opcional, podrías pasar los parámetros directamente)
                            terreno = Terreno(
                                id_terreno=None,  # Se generará en el SP
                                id_proyecto=id_proyecto,
                                etapa=etapa_num,
                                area=AREA_POR_DEFECTO,
                                precio_terreno=precio_terreno,
                                estado_terreno=ESTADO_POR_DEFECTO,
                                tipo_terreno=tipo_terreno,
                                manzana=manzana_letra,
                                numero_lote=lote_actual_en_manzana,
                                codigo_unidad=codigo_unidad
                            )

                            # Llamar al SP para insertar cada terreno individualmente
                            cursor.execute(
                                "CALL sp_insertar_terreno(%s, %s, %s, %s, %s, %s, %s, %s, %s)",
                                (
                                    terreno.id_proyecto,
                                    terreno.etapa,
                                    terreno.area,
                                    terreno.precio_terreno,
                                    terreno.estado_terreno,
                                    terreno.tipo_terreno,
                                    terreno.manzana,
                                    terreno.numero_lote,
                                    terreno.codigo_unidad
                                )
                            )
                            # Es importante consumir cualquier resultado del SP, incluso si no devuelve nada
                            while cursor.nextset():
                                pass

                            lote_actual_en_manzana += 1

            db.connection.commit()
            cursor.close()
            return True
        except Exception as e:
            print(f"[ERROR insertar_terrenos_por_etapa]: {e}")
            db.connection.rollback()
            return False

    @classmethod
    def delete(cls, db, id_proyecto):
        cursor = None
        try:
            cursor = db.connection.cursor()
            cursor.execute("CALL sp_eliminar_proyecto(%s)", (id_proyecto,))
            db.connection.commit()
            return True
        except Exception as e:
            print(f"[ERROR ModelTerreno.delete general]: {e}")
            return False
        finally:
            if cursor:
                cursor.close()

    @classmethod
    def update(cls, db, id_proyecto, nombre_proyecto, direccion):
        cursor = None
        try:
            cursor = db.connection.cursor()
            id_proyecto_int = int(id_proyecto)
            cursor.execute("CALL sp_actualizar_proyecto(%s, %s, %s)", (id_proyecto_int, nombre_proyecto, direccion))
            db.connection.commit()
            return True
        except Exception as e:
            print(f"[ERROR actualizar Proyecto general]: {e}")
            if db.connection:
                db.connection.rollback()
            return False
        finally:
            if cursor:
                cursor.close()
