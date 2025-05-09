window.initClientesModals = function () {
    // Referencias a elementos del DOM
    const btnCambiarEstado = document.getElementById('btnCambiarEstado');
    const btnAgregar = document.getElementById('btnAgregar');

    const modalCambiarEstado = document.getElementById('modalCambiarEstado');
    const modalAgregarCliente = document.getElementById('modalAgregarCliente');
    const modalExito = document.getElementById('modalExito');
    const modalOverlay = document.getElementById('modalOverlay');

    const cerrarModalEstado = document.getElementById('cerrarModalEstado');
    const cerrarModalAgregar = document.getElementById('cerrarModalAgregar');
    const cerrarModalExito = document.getElementById('cerrarModalExito');

    const btnCancelarAgregar = document.getElementById('btnCancelarAgregar');
    const btnConfirmarEstado = document.getElementById('btnConfirmarEstado');

    const formAgregarCliente = document.getElementById('formAgregarCliente');
    const opcionesEstado = document.querySelectorAll('.opcion-estado');

    const checkboxSeleccionarTodos = document.getElementById('seleccionarTodos');
    const checkboxesClientes = document.querySelectorAll('.checkbox-cliente');

    const btnEliminar = document.getElementById('btnEliminar');
    const modalEliminarCliente = document.getElementById('modalConfirmarEliminacion');
    const btnCancelarEliminar = document.getElementById('btnCancelarEliminar');
    const btnConfirmarEliminar = document.getElementById('btnConfirmarEliminar');

    // Variables de estado
    let clientesSeleccionados = [];
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

    function actualizarClientesSeleccionados() {
        clientesSeleccionados = [];
        checkboxesClientes.forEach(checkbox => {
            if (checkbox.checked) {
                clientesSeleccionados.push(checkbox.dataset.id);
            }
        });

        btnCambiarEstado.disabled = clientesSeleccionados.length === 0;
        btnCambiarEstado.style.opacity = clientesSeleccionados.length === 0 ? '0.6' : '1';
    }

    checkboxesClientes.forEach(checkbox => {
        checkbox.addEventListener('change', actualizarClientesSeleccionados);
    });

    opcionesEstado.forEach(opcion => {
        opcion.addEventListener('click', function () {
            opcionesEstado.forEach(op => op.classList.remove('seleccionado'));
            this.classList.add('seleccionado');
            estadoSeleccionado = this.dataset.estado;
        });
    });

    formAgregarCliente.addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(this);

        fetch(this.action, {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': document.querySelector('input[name=csrf_token]').value
            }
        })
            .then(async res => {
                if (!res.ok) {
                    // Obtener el texto por si no es JSON (por ejemplo, HTML de error)
                    const errorText = await res.text();
                    throw new Error(`Error HTTP ${res.status}: ${errorText}`);
                }
                return res.json();
            })
            .then(data => {
                console.log(data);
                if (data.success) {
                    const cliente = data.cliente;

                    const nuevaFila = document.createElement('tr');

                    const clasesEstado = {
                        'Activo': 'activo',
                        'Evaluado': 'evaluado',
                        'NoDisponible': 'no-disponible',
                        'SinEvaluar': 'sin-evaluar',
                        'PorEvaluar': 'por-evaluar'
                    };

                    const claseEstado = clasesEstado[cliente.estado] || 'sin-evaluar';

                    nuevaFila.innerHTML = `
                    <td><input type="checkbox" class="checkbox-cliente" data-id="${cliente.id_cliente}"></td>
                    <td>${cliente.id_cliente}</td>
                    <td data-filtro="nombreCompleto">${cliente.nombre} ${cliente.apellido}</td>
                    <td data-filtro="dni">${cliente.dni}</td>
                    <td>${cliente.direccion}</td>
                    <td>${cliente.telefono}</td>
                    <td>${cliente.ingreso_neto}</td>
                    <td>
                        <span class="estado-badge ${claseEstado}">
                            ${cliente.estado}
                        </span>
                    </td>
                    <td style="text-align: center;">
                        <button class="btn-detalles-clientes" data-id="${cliente.id_cliente}">
                            <i class="fas fa-eye"></i>
                        </button>
                    </td>
                `;

                    document.getElementById('tabla_clientes_body').appendChild(nuevaFila);

                    cerrarModal(modalAgregarCliente);
                    mostrarExito('Cliente agregado', data.message);

                    this.reset(); // Limpia el formulario después de agregar
                } else {
                    alert('Error: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error al enviar formulario:', error);
                alert('Error inesperado al enviar el formulario: ' + error.message);
            });
    });

    btnEliminar.addEventListener('click', () => {
        if (clientesSeleccionados.length === 0) {
            alert('Por favor, seleccione al menos un cliente');
            return;
        }
        abrirModal(modalEliminarCliente);
    });

    btnCancelarEliminar.addEventListener('click', () => cerrarModal(modalEliminarCliente));

    btnConfirmarEliminar.addEventListener('click', () => {
        const formData = new FormData();
        formData.append('clientes', JSON.stringify(clientesSeleccionados));

        fetch('/eliminar_clientes', {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': document.querySelector('input[name=csrf_token]').value
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    clientesSeleccionados.forEach(id => {
                        const fila = document.querySelector(`tr[data-id="${id}"]`);
                        if (fila) {
                            fila.remove();
                        }
                    });
                    cerrarModal(modalEliminarCliente);
                    mostrarExito('Clientes eliminados', data.message);
                } else {
                    alert('Error: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error al enviar formulario:', error);
                alert('Error inesperado al enviar el formulario');
            });
    });


    btnConfirmarEstado.addEventListener('click', function () {
        if (!estadoSeleccionado) {
            alert('Por favor, seleccione un estado');
            return;
        }

        cerrarModal(modalCambiarEstado);
        setTimeout(() => {
            mostrarExito('Estado Actualizado', `Se ha actualizado el estado de ${clientesSeleccionados.length} cliente(s).`);
        }, 500);

        estadoSeleccionado = null;
        opcionesEstado.forEach(op => op.classList.remove('seleccionado'));
    });

    btnCambiarEstado.addEventListener('click', () => {
        if (clientesSeleccionados.length === 0) {
            alert('Por favor, seleccione al menos un cliente');
            return;
        }
        abrirModal(modalCambiarEstado);
    });

    btnAgregar.addEventListener('click', () => abrirModal(modalAgregarCliente));
    cerrarModalEstado.addEventListener('click', () => cerrarModal(modalCambiarEstado));
    cerrarModalAgregar.addEventListener('click', () => cerrarModal(modalAgregarCliente));
    cerrarModalExito.addEventListener('click', () => cerrarModal(modalExito));
    btnCancelarAgregar.addEventListener('click', () => cerrarModal(modalAgregarCliente));
    modalOverlay.addEventListener('click', cerrarTodosLosModales);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            cerrarTodosLosModales();
        }
    });

    actualizarClientesSeleccionados();

    const inputBuscar = document.getElementById('buscarCliente');
    inputBuscar.addEventListener('input', filtrarClientes);
    document.getElementById('filtroClientes').addEventListener('change', filtrarClientes);
    document.getElementById('filtroClientesEstado').addEventListener('change', filtrarClientes);

    function filtrarClientes() {
        const textoBusqueda = inputBuscar.value.toLowerCase();
        const filtro = document.getElementById('filtroClientes').value;
        const filtroEstado = document.getElementById('filtroClientesEstado').value;
        const filas = document.querySelectorAll('.tabla-clientes tbody tr');

        filas.forEach(fila => {
            const estadoCliente = fila.getAttribute('data-estado');

            // Solo muestra filas que coincidan exactamente con el estado seleccionado
            const coincideEstado = estadoCliente === filtroEstado;

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
}