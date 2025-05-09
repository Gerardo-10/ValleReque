window.initSecurityModals = function () {
    // Referencias a elementos del DOM
    const btnCambiarEstado = document.getElementById('btnCambiarEstado');
    const btnAgregar = document.getElementById('btnAgregar');

    const modalCambiarEstado = document.getElementById('modalCambiarEstado');
    const modalAgregarEmpleado = document.getElementById('modalAgregarEmpleado');
    const modalExito = document.getElementById('modalExito');
    const modalOverlay = document.getElementById('modalOverlay');

    const cerrarModalEstado = document.getElementById('cerrarModalEstado');
    const cerrarModalAgregar = document.getElementById('cerrarModalAgregar');
    const cerrarModalExito = document.getElementById('cerrarModalExito');

    const btnCancelarAgregar = document.getElementById('btnCancelarAgregar');
    const btnConfirmarEstado = document.getElementById('btnConfirmarEstado');

    const formAgregarEmpleado = document.getElementById('formAgregarEmpleado');
    const opcionesEstado = document.querySelectorAll('.opcion-estado');

    const checkboxSeleccionarTodos = document.getElementById('seleccionarTodos');
    const checkboxesEmpleados = document.querySelectorAll('.checkbox-empleado');

    // Variables de estado
    let empleadosSeleccionados = [];
    let estadoSeleccionado = null;

    // Funciones para manejar modales
    function abrirModal(modal) {
        modal.classList.add('activo');
        modalOverlay.classList.add('activo');
        document.body.style.overflow = 'hidden';
    }

    function cerrarModal(modal) {
        modal.classList.remove('activo');
        modalOverlay.classList.remove('activo');
        document.body.style.overflow = '';
    }

    function cerrarTodosLosModales() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('activo');
        });
        modalOverlay.classList.remove('activo');
        document.body.style.overflow = '';
    }

    function mostrarExito(titulo, mensaje) {
        document.getElementById('tituloExito').textContent = titulo;
        document.getElementById('mensajeExito').textContent = mensaje;
        abrirModal(modalExito);
    }

    function actualizarEmpleadosSeleccionados() {
        empleadosSeleccionados = [];
        checkboxesEmpleados.forEach(checkbox => {
            if (checkbox.checked) {
                empleadosSeleccionados.push(checkbox.dataset.id);
            }
        });

        btnCambiarEstado.disabled = empleadosSeleccionados.length === 0;
        btnCambiarEstado.style.opacity = empleadosSeleccionados.length === 0 ? '0.6' : '1';
    }

    checkboxesEmpleados.forEach(checkbox => {
        checkbox.addEventListener('change', actualizarEmpleadosSeleccionados);
    });

    opcionesEstado.forEach(opcion => {
        opcion.addEventListener('click', function () {
            opcionesEstado.forEach(op => op.classList.remove('seleccionado'));
            this.classList.add('seleccionado');
            estadoSeleccionado = this.dataset.estado;
        });
    });

    formAgregarEmpleado.addEventListener('submit', function (e) {
        e.preventDefault();
        cerrarModal(modalAgregarEmpleado);
        setTimeout(() => {
            mostrarExito('Empleado Agregado Exitosamente', 'El nuevo empleado ha sido registrado en el sistema.');
        }, 500);
    });

    btnConfirmarEstado.addEventListener('click', function () {
        if (!estadoSeleccionado) {
            alert('Por favor, seleccione un estado');
            return;
        }

        cerrarModal(modalCambiarEstado);
        setTimeout(() => {
            mostrarExito('Estado Actualizado', `Se ha actualizado el estado de ${empleadosSeleccionados.length} empleado(s).`);
        }, 500);

        estadoSeleccionado = null;
        opcionesEstado.forEach(op => op.classList.remove('seleccionado'));
    });

    btnCambiarEstado.addEventListener('click', () => {
        if (empleadosSeleccionados.length === 0) {
            alert('Por favor, seleccione al menos un empleado');
            return;
        }
        abrirModal(modalCambiarEstado);
    });

    btnAgregar.addEventListener('click', () => abrirModal(modalAgregarEmpleado));
    cerrarModalEstado.addEventListener('click', () => cerrarModal(modalCambiarEstado));
    cerrarModalAgregar.addEventListener('click', () => cerrarModal(modalAgregarEmpleado));
    cerrarModalExito.addEventListener('click', () => cerrarModal(modalExito));
    btnCancelarAgregar.addEventListener('click', () => cerrarModal(modalAgregarEmpleado));
    modalOverlay.addEventListener('click', cerrarTodosLosModales);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            cerrarTodosLosModales();
        }
    });

    actualizarEmpleadosSeleccionados();

    const inputBuscar = document.getElementById('buscarEmpleado');
    inputBuscar.addEventListener('input', filtrarEmpleados);
    document.getElementById('filtroEmpleados').addEventListener('change', filtrarEmpleados);
    document.getElementById('filtroEmpleadosEstado').addEventListener('change', filtrarEmpleados);

    function filtrarEmpleados() {
        const textoBusqueda = inputBuscar.value.toLowerCase();
        const filtro = document.getElementById('filtroEmpleados').value;
        const filtroEstado = document.getElementById('filtroEmpleadosEstado').value;
        const filas = document.querySelectorAll('.tabla-empleados tbody tr');

        filas.forEach(fila => {
            const estadoEmpleado = fila.getAttribute('data-estado');

            // Comparación directa entre el estado del filtro y el del empleado
            const coincideEstado = estadoEmpleado === filtroEstado;

            if (!coincideEstado) {
                fila.style.display = 'none';
                return;
            }

            let mostrar = false;

            if (!filtro) {
                mostrar = fila.textContent.toLowerCase().includes(textoBusqueda);
            } else {
                const celda = fila.querySelector(`td[data-filtro="${filtro}"]`);
                if (celda) {
                    mostrar = celda.textContent.toLowerCase().includes(textoBusqueda);
                }
            }

            fila.style.display = mostrar ? '' : 'none';
        });
    }
};