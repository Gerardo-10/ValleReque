class Cliente:
    def __init__(self, id_cliente, nombre, apellido, documento_identidad, direccion, correo, telefono, ocupacion, ingreso_neto,
                 estado_cliente, carga_familiar, estado):
        self.id_cliente = id_cliente
        self.nombre = nombre
        self.apellido = apellido
        self.dni = documento_identidad
        self.direccion = direccion
        self.correo = correo
        self.telefono = telefono
        self.ocupacion = ocupacion
        self.ingreso_neto = ingreso_neto
        self.estado_cliente = estado_cliente
        self.carga_familiar = carga_familiar
        self.estado = estado
