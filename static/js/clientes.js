window.initDetalleEmpleado = function () {
    const modalOverlay = document.getElementById('modalOverlay');
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');

    const modales = {
        agregarEmpleado: document.getElementById('modalAgregarEmpleado'),
        actualizarInfo: document.getElementById('modalActualizarInfo'),
        cambiarPassword: document.getElementById('modalCambiarPassword'),
        actualizarCuenta: document.getElementById('modalActualizarCuenta'),
        exito: document.getElementById('modalExito')
    };

    const forms = {
        agregarEmpleado: document.getElementById('formAgregarEmpleado'),
        actualizarInfo: document.getElementById('formActualizarInfo'),
        cambiarPassword: document.getElementById('formCambiarPassword'),
        actualizarCuenta: document.getElementById('formActualizarCuenta')
    };

    const botones = {
        agregarEmpleado: document.getElementById('btnAgregarEmpleado'),
        actualizarInfo: document.getElementById('btnActualizarInfo'),
        cambiarPassword: document.getElementById('btnCambiarPassword'),
        actualizarCuenta: document.getElementById('btnActualizarCuenta')
    };

     // Botón Cancelar dentro del modal Cambiar Contraseña
    const btnCancelarPassword = document.getElementById('btnCancelarPassword');
    if (btnCancelarPassword) {
        btnCancelarPassword.addEventListener('click', function () {
            cerrarModal(modales.cambiarPassword);
        });
    }


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
        Object.values(modales).forEach(modal => modal?.classList.remove('activo'));
        modalOverlay.classList.remove('activo');
        document.body.style.overflow = '';
    }

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

    if (botones.actualizarCuenta) {
        botones.actualizarCuenta.addEventListener('click', function () {
            const idEmpleado = this.dataset.id;
            const rol = this.dataset.rol;
            const area = this.dataset.area;
            const estado = this.dataset.estado;

            document.getElementById('idActualizarCuenta').value = idEmpleado;
            document.getElementById('rolActualizar').value = rol || '';
            document.getElementById('areaActualizar').value = area || '';
            document.getElementById('estadoActualizar').value = estado || '';

            abrirModal(modales.actualizarCuenta);
        });
    }

    document.querySelectorAll('[data-close-modal]').forEach(btn => {
        btn.addEventListener('click', function () {
            const targetModal = document.getElementById(this.dataset.closeModal);
            cerrarModal(targetModal);
        });
    });
    if (modalOverlay) modalOverlay.addEventListener('click', cerrarTodosLosModales);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarTodosLosModales(); });

    document.getElementById('formActualizarCuenta').addEventListener('submit', function (event) {
        event.preventDefault();
        const form = this;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        fetch('/actualizar_cuenta_empleado', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': form.querySelector('input[name="csrf_token"]').value
            },
            body: JSON.stringify(data)
        })
            .then(response => response.ok ? response.json() : response.text().then(text => { throw new Error(text) }))
            .then(result => {
                if (result.success) {
                    document.getElementById('rolEmpleado').textContent = obtenerNombreRol(data.id_rol);
                    document.getElementById('areaEmpleado').textContent = obtenerNombreArea(data.id_area);
                    const estadoText = data.estado == "1" ? 'Activo' : 'Inactivo';
                    const estadoClass = data.estado == "1" ? 'estado-activo' : 'estado-inactivo';
                    const estadoEmpleado = document.getElementById('estadoEmpleado');
                    estadoEmpleado.textContent = estadoText;
                    estadoEmpleado.className = estadoClass;

                    const btnActualizarCuenta = document.getElementById('btnActualizarCuenta');
                    if (btnActualizarCuenta) {
                        btnActualizarCuenta.setAttribute('data-id', data.id_empleado);
                        btnActualizarCuenta.setAttribute('data-rol', data.id_rol);
                        btnActualizarCuenta.setAttribute('data-area', data.id_area);
                        btnActualizarCuenta.setAttribute('data-estado', data.estado);
                    }

                    Swal.fire({
                        icon: 'success',
                        title: 'Cuenta actualizada',
                        text: 'Los datos de la cuenta se actualizaron correctamente.',
                        timer: 2000,
                        showConfirmButton: false
                    });

                    document.querySelector('[data-close-modal="modalActualizarCuenta"]').click();
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al actualizar',
                        text: result.message || 'Ocurrió un error inesperado.'
                    });
                }
            })
            .catch(error => {
                console.error("Error:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de conexión',
                    text: error.message || 'No se pudo completar la solicitud.'
                });
            });
    });

    function obtenerNombreRol(idRol) {
        switch (idRol) {
            case '1': return 'Administrador';
            case '2': return 'Usuario';
            default: return 'Desconocido';
        }
    }

    function obtenerNombreArea(idArea) {
        switch (idArea) {
            case '1': return 'Administración';
            case '2': return 'Ventas';
            case '3': return 'Legal';
            case '4': return 'Contabilidad';
            default: return 'Desconocida';
        }
    }

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
                        Swal.fire({
                            icon: 'success',
                            title: 'Información Actualizada',
                            text: 'Los datos del empleado han sido actualizados correctamente.',
                            timer: 2000,
                            showConfirmButton: false
                        });
                        document.getElementById('nombreEmpleado').textContent = data.nombre + ' ' + data.apellido;
                        document.getElementById('correoEmpleado').textContent = data.correo;
                        document.getElementById('telefonoEmpleado').textContent = data.telefono;
                        document.getElementById('fechaNacimientoEmpleado').textContent = data.fecha_nacimiento;
                        document.getElementById('direccionEmpleado').textContent = data.direccion;
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: respuesta.message
                        });
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Ocurrió un error al actualizar.'
                    });
                });
        });
    }

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
                        Swal.fire({
                            icon: 'success',
                            title: 'Contraseña actualizada',
                            text: 'Contraseña actualizada correctamente.',
                            timer: 2000,
                            showConfirmButton: false
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error al cambiar contraseña',
                            text: data.message || 'Ocurrió un problema al cambiar la contraseña.',
                        });
                    }
                })
                .catch(error => {
                    cerrarModal(modales.cambiarPassword);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se pudo procesar la solicitud.',
                    });
                    console.error('Error:', error);
                });
        });
    }


    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const input = this.previousElementSibling;
            const tipo = input.getAttribute('type');
            input.setAttribute('type', tipo === 'password' ? 'text' : 'password');
            this.innerHTML = tipo === 'password' ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
        });
    });
};
