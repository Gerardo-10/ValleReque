
# 🏡 Proyecto ValleReque - Sistema de Gestión Inmobiliaria

Este proyecto es una aplicación web desarrollada en **Python con Flask** que permite la gestión integral de proyectos inmobiliarios. Fue diseñado para facilitar el control de usuarios, clientes, terrenos, financiamiento y seguridad dentro de la empresa **Constructora Valle Reque S.A.C.**

## 📁 Estructura del Proyecto

```
ValleReque/
│
├── .venv/                   # Entorno virtual
├── logs/                   # Logs de ejecución
├── src/
│   ├── database/           # Scripts o conexión a base de datos
│   ├── models/
│   │   ├── entities/       # Modelos de entidades como Cliente, Empleado, etc.
│   │   └── ModelUser.py    # Lógica de acceso de usuario
│   ├── routes/             # Blueprints de Flask por módulo
│   ├── services/           # Servicios de autenticación y lenguaje
│   └── utils/              # Utilidades: seguridad, correo, logger
│
├── static/                 # Archivos estáticos (CSS, JS, imágenes)
│
└── templates/              # Plantillas HTML (Jinja2)
```

## 🔐 Funcionalidades Clave

- **Inicio de sesión seguro con hash bcrypt**
- **Validación de usuarios activos/inactivos**
- **Recuperación de contraseña por correo**
- **Cambio de contraseña forzado si se detecta valor por defecto**
- **Gestión de usuarios, empleados, clientes y terrenos**
- **Módulo de financiamiento**
- **Registro de logs y errores**
- **Seguridad basada en roles**

## 🚀 Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu_usuario/ValleReque.git
   cd ValleReque
   ```

2. Crea y activa un entorno virtual:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # o .venv\Scripts\activate en Windows
   ```

3. Instala dependencias:
   ```bash
   pip install -r requirements.txt
   ```

4. Configura tus variables de entorno (ej. `config.py` o `.env`):
   ```env
   FLASK_APP=app.py
   FLASK_ENV=development
   ```

5. Ejecuta la aplicación:
   ```bash
   flask run
   ```

## 🛠️ Tecnologías Utilizadas

- **Backend:** Flask + Blueprints
- **Base de Datos:** MySQL + procedimientos almacenados
- **Frontend:** HTML5 + CSS + Bootstrap + JavaScript
- **Seguridad:** Flask-Login + CSRF + bcrypt
- **Utilidades:** Sistema de logging, validaciones, envío de correo

## 📬 Funcionalidades Especiales

- ✅ Modal de cambio de contraseña automático si el usuario tiene `123456`
- ✅ Flujo completo de recuperación con verificación por código
- ✅ Sistema de notificaciones en frontend con JavaScript personalizado
- ✅ Diseño modular escalable para futuros módulos (ventas, auditoría, etc.)

## 📸 Capturas o Prototipos
Puedes visualizar el prototipo en Figma aquí:
[🔗 Prototipo Valle Reque en Figma](https://www.figma.com/design/hCkoesxRWXF6EsJ26cHG1A/VALLE-REQUE?node-id=0-1&p=f&t=m2Vw3zXV8TaClRjO-0)

## 👨‍💻 Autores
   ![Oreo](static\img\oreo.webp)

_¡Gracias por revisar el proyecto!_ 🍪 
_Atte: Equipo Oreo_

