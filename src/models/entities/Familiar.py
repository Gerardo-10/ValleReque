class Familiar:
    def __init__(self, nombre_familia, apellido_familia, documento_identidad):
        self.nombre = nombre_familia
        self.apellido = apellido_familia
        self.documento = documento_identidad

    def __repr__(self):
        return f"Familiar(nombre={self.nombre}, apellido={self.apellido}, documento={self.documento})"
