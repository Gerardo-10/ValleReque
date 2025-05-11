window.initDetalleEmpleado = function () {
    // Referencias a elementos del DOM
    const btnAgregarEmpleado = document.getElementById('btnAgregarEmpleado');
    const btnActualizarInfo = document.getElementById('btnActualizarInfo');
    const btnCambiarPassword = document.getElementById('btnCambiarPassword');

    const modalAgregarEmpleado = document.getElementById('modalAgregarEmpleado');
    const modalActualizarInfo = document.getElementById('modalActualizarInfo');
    const modalCambiarPassword = document.getElementById('modalCambiarPassword');
    const modalExito = document.getElementById('modalExito');
    const modalOverlay = document.getElementById('modalOverlay');

    const cerrarModalAgregar = document.getElementById('cerrarModalAgregar');
    const cerrarModalActualizar = document.getElementById('cerrarModalActualizar');
    const cerrarModalPassword = document.getElementById('cerrarModalPassword');
    const cerrarModalExito = document.getElementById('cerrarModalExito');

    const btnCancelarAgregar = document.getElementById('btnCancelarAgregar');
    const btnCancelarActualizar = document.getElementById('btnCancelarActualizar');
    const btnCancelarPassword = document.getElementById('btnCancelarPassword');

    const formAgregarEmpleado = document.getElementById('formAgregarEmpleado');
    const formActualizarInfo = document.getElementById('formActualizarInfo');
    const formCambiarPassword = document.getElementById('formCambiarPassword');

    const togglePasswordBtns = document.querySelectorAll('.toggle-password');

    // Funciones para manejar modales
    function abrirModal(modal) {
        modal.classList.add('activo');
        modalOverlay.classList.add('activo');
        document.body.style.overflow = 'hidden'; // Prevenir scroll
    }

    function cerrarModal(modal) {
        modal.classList.remove('activo');
        modalOverlay.classList.remove('activo');
        document.body.style.overflow = ''; // Restaurar scroll
    }

    function cerrarTodosLosModales() {
        const modales = document.querySelectorAll('.modal');
        modales.forEach(modal => {
            modal.classList.remove('activo');
        });
        modalOverlay.classList.remove('activo');
        document.body.style.overflow = ''; // Restaurar scroll
    }

    // Función para mostrar modal de éxito
    function mostrarExito(titulo, mensaje, mostrarCredenciales = false) {
        document.getElementById('tituloExito').textContent = titulo;
        document.getElementById('mensajeExito').textContent = mensaje;

        const credencialesContainer = document.getElementById('credencialesContainer');
        if (mostrarCredenciales) {
            // Generar credenciales aleatorias para demostración
            const usuario = 'r.' + Math.random().toString(36).substring(2, 8);
            const password = 'Pass' + Math.floor(Math.random() * 10000) + '!';

            document.getElementById('usuarioGenerado').textContent = usuario;
            document.getElementById('passwordGenerada').textContent = password;
            credencialesContainer.style.display = 'block';
        } else {
            credencialesContainer.style.display = 'none';
        }

        abrirModal(modalExito);
    }

    // Manejar envío de formularios
    formAgregarEmpleado.addEventListener('submit', function (e) {
        e.preventDefault();
        // Aquí iría la lógica para enviar datos al servidor
        cerrarModal(modalAgregarEmpleado);
        setTimeout(() => {
            mostrarExito(
                'Empleado Agregado Exitosamente',
                'El nuevo empleado ha sido registrado en el sistema. A continuación se muestran las credenciales generadas:',
                true
            );
        }, 500);
    });

    formActualizarInfo.addEventListener('submit', function (e) {
        e.preventDefault();
        // Aquí iría la lógica para actualizar datos
        cerrarModal(modalActualizarInfo);
        setTimeout(() => {
            mostrarExito(
                'Información Actualizada',
                'Los datos del empleado han sido actualizados correctamente.'
            );
        }, 500);
    });

    formCambiarPassword.addEventListener('submit', function (e) {
        e.preventDefault();
        // Aquí iría la validación de contraseñas
        cerrarModal(modalCambiarPassword);
        setTimeout(() => {
            mostrarExito(
                'Contraseña Actualizada',
                'La contraseña ha sido cambiada exitosamente.'
            );
        }, 500);
    });

    // Mostrar/ocultar contraseña
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const input = this.previousElementSibling;
            const tipo = input.getAttribute('type');

            if (tipo === 'password') {
                input.setAttribute('type', 'text');
                this.innerHTML = '<i class="fas fa-eye-slash"></i>';
            } else {
                input.setAttribute('type', 'password');
                this.innerHTML = '<i class="fas fa-eye"></i>';
            }
        });
    });

    // Event listeners para botones
    btnAgregarEmpleado.addEventListener('click', () => abrirModal(modalAgregarEmpleado));
    btnActualizarInfo.addEventListener('click', () => abrirModal(modalActualizarInfo));
    btnCambiarPassword.addEventListener('click', () => abrirModal(modalCambiarPassword));

    cerrarModalAgregar.addEventListener('click', () => cerrarModal(modalAgregarEmpleado));
    cerrarModalActualizar.addEventListener('click', () => cerrarModal(modalActualizarInfo));
    cerrarModalPassword.addEventListener('click', () => cerrarModal(modalCambiarPassword));
    cerrarModalExito.addEventListener('click', () => cerrarModal(modalExito));

    btnCancelarAgregar.addEventListener('click', () => cerrarModal(modalAgregarEmpleado));
    btnCancelarActualizar.addEventListener('click', () => cerrarModal(modalActualizarInfo));
    btnCancelarPassword.addEventListener('click', () => cerrarModal(modalCambiarPassword));

    modalOverlay.addEventListener('click', cerrarTodosLosModales);

    // Cerrar modales con ESC
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            cerrarTodosLosModales();
        }
    });
}