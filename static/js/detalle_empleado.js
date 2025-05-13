window.initDetalleEmpleado = function () {
    // Referencias a elementos del DOM
    const modalOverlay = document.getElementById('modalOverlay');
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');

    // Mapeo de modales por ID
    const modales = {
        agregarEmpleado: document.getElementById('modalAgregarEmpleado'),
        actualizarInfo: document.getElementById('modalActualizarInfo'),
        cambiarPassword: document.getElementById('modalCambiarPassword'),
        actualizarCuenta: document.getElementById('modalActualizarCuenta'),
        exito: document.getElementById('modalExito')
    };

    // Formularios
    const forms = {
        agregarEmpleado: document.getElementById('formAgregarEmpleado'),
        actualizarInfo: document.getElementById('formActualizarInfo'),
        cambiarPassword: document.getElementById('formCambiarPassword'),
        actualizarCuenta: document.getElementById('formActualizarCuenta')
    };

    // Botones principales
    const botones = {
        agregarEmpleado: document.getElementById('btnAgregarEmpleado'),
        actualizarInfo: document.getElementById('btnActualizarInfo'),
        cambiarPassword: document.getElementById('btnCambiarPassword'),
        actualizarCuenta: document.getElementById('btnActualizarCuenta')
    };

    // Utilidades modales
    function abrirModal(modal) {
        if (modal) {
            modal.classList.add('activo');
            modalOverlay.classList.add('activo');
            document.body.style.overflow = 'hidden';
        }
    }

    function cerrarModal(modal) {
        if (modal) {
            modal.classList.remove('activo');
            modalOverlay.classList.remove('activo');
            document.body.style.overflow = '';
        }
    }

    function cerrarTodosLosModales() {
        Object.values(modales).forEach(modal => {
            if (modal) modal.classList.remove('activo');
        });
        modalOverlay.classList.remove('activo');
        document.body.style.overflow = '';
    }

    // Mensajes de feedback
    function mostrarExito(titulo, mensaje) {
        alert(titulo + '\n' + mensaje);
    }

    function mostrarError(titulo, mensaje) {
        alert(titulo + '\n' + mensaje);
    }

    // Eventos botones de abrir modal
    if (botones.agregarEmpleado) botones.agregarEmpleado.addEventListener('click', () => abrirModal(modales.agregarEmpleado));
    if (botones.actualizarInfo) botones.actualizarInfo.addEventListener('click', function () {
        document.getElementById('nombreActualizar').value = this.dataset.nombre;
        document.getElementById('apellidoActualizar').value = this.dataset.apellido;
        document.getElementById('emailActualizar').value = this.dataset.correo;
        document.getElementById('telefonoActualizar').value = this.dataset.telefono;
        document.getElementById('fechaNacActualizar').value = this.dataset.fechaNacimiento;
        document.getElementById('direccionActualizar').value = this.dataset.direccion;
        abrirModal(modales.actualizarInfo);
    });
    if (botones.cambiarPassword) botones.cambiarPassword.addEventListener('click', () => abrirModal(modales.cambiarPassword));
    if (botones.actualizarCuenta) botones.actualizarCuenta.addEventListener('click', function () {
        document.getElementById('idActualizarCuenta').value = this.dataset.id;
        document.getElementById('rolActualizar').value = this.dataset.rol;
        document.getElementById('areaActualizar').value = this.dataset.area;
        document.getElementById('estadoActualizar').value = this.dataset.estado;
        abrirModal(modales.actualizarCuenta);
    });

    // Eventos cierre modales (con botones específicos y overlay)
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
        btn.addEventListener('click', function () {
            const targetModal = document.getElementById(this.dataset.closeModal);
            cerrarModal(targetModal);
        });
    });
    if (modalOverlay) modalOverlay.addEventListener('click', cerrarTodosLosModales);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') cerrarTodosLosModales();
    });

    // Formulario actualizar cuenta
    if (forms.actualizarCuenta) {
        forms.actualizarCuenta.addEventListener('submit', function (e) {
            e.preventDefault();
            const idEmpleado = document.getElementById('idActualizarCuenta').value;
            const rol = document.getElementById('rolActualizar').value;
            const area = document.getElementById('areaActualizar').value;
            const estado = document.getElementById('estadoActualizar').value;

            const data = {id_empleado: idEmpleado, rol, area, estado};

            fetch('/actualizar_cuenta_empleado', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': this.querySelector('input[name="csrf_token"]').value
                },
                body: JSON.stringify(data)
            })
                .then(response => response.json())
                .then(respuesta => {
                    if (respuesta.success) {
                        cerrarModal(modales.actualizarCuenta);
                        mostrarExito('Cuenta Actualizada', 'La información de la cuenta ha sido actualizada correctamente.');
                        document.getElementById('rolEmpleado').textContent = respuesta.rol_texto;
                        document.getElementById('areaEmpleado').textContent = respuesta.area_texto;
                        document.getElementById('estadoEmpleado').textContent = respuesta.estado_texto;
                        document.getElementById('estadoEmpleado').className = 'estado-' + (estado == 1 ? 'activo' : 'inactivo');
                    } else {
                        mostrarError('Error', respuesta.message);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    mostrarError('Error', 'Ocurrió un error al actualizar la cuenta.');
                });
        });
    }

    // Formulario actualizar info personal
    if (forms.actualizarInfo) {
        forms.actualizarInfo.addEventListener('submit', function (e) {
            e.preventDefault();
            const data = {
                id_empleado: document.getElementById('idActualizar').value,
                nombre: document.getElementById('nombreActualizar').value,
                apellido: document.getElementById('apellidoActualizar').value,
                correo: document.getElementById('emailActualizar').value,
                fecha_nacimiento: document.getElementById('fechaNacActualizar').value,
                telefono: document.getElementById('telefonoActualizar').value,
                direccion: document.getElementById('direccionActualizar').value
            };

            fetch('/actualizar_empleado', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': this.querySelector('input[name="csrf_token"]').value
                },
                body: JSON.stringify(data)
            })
                .then(response => response.json())
                .then(respuesta => {
                    if (respuesta.success) {
                        cerrarModal(modales.actualizarInfo);
                        mostrarExito('Información Actualizada', 'Los datos del empleado han sido actualizados correctamente.');
                        document.getElementById('nombreEmpleado').textContent = data.nombre + ' ' + data.apellido;
                        document.getElementById('correoEmpleado').textContent = data.correo;
                        document.getElementById('telefonoEmpleado').textContent = data.telefono;
                        document.getElementById('fechaNacimientoEmpleado').textContent = data.fecha_nacimiento;
                        document.getElementById('direccionEmpleado').textContent = data.direccion;
                    } else {
                        mostrarError('Error', respuesta.message);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    mostrarError('Error', 'Ocurrió un error al actualizar.');
                });
        });
    }

    // Formulario cambiar contraseña
    if (forms.cambiarPassword) {
        forms.cambiarPassword.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData(this);

            fetch('/actualizar_contrasena', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    cerrarModal(modales.cambiarPassword);
                    if (data.success) {
                        mostrarExito('Contraseña Actualizada', data.message);
                    } else {
                        mostrarError('Error al cambiar contraseña', data.message);
                    }
                })
                .catch(error => {
                    cerrarModal(modales.cambiarPassword);
                    mostrarError('Error', 'No se pudo procesar la solicitud');
                    console.error('Error:', error);
                });
        });
    }

    // Mostrar/ocultar contraseña
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const input = this.previousElementSibling;
            const tipo = input.getAttribute('type');
            input.setAttribute('type', tipo === 'password' ? 'text' : 'password');
            this.innerHTML = tipo === 'password' ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
        });
    });
};
