class Financiamiento:
    def __init__(self, id_financiamiento, tipo_financiamiento, monto_financiamiento, interes, estado, fecha_creacion):
        self.id_financiamiento = id_financiamiento
        self.tipo = tipo_financiamiento
        self.monto = monto_financiamiento
        self.interes = interes
        self.estado = estado
        self.fecha_creacion = fecha_creacion
