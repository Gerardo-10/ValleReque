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
    const btnEliminar = document.getElementById('btnEliminar');
    const modalEliminarCliente = document.getElementById('modalConfirmarEliminacion');
    const btnCancelarEliminar = document.getElementById('btnCancelarEliminar');
    const btnConfirmarEliminar = document.getElementById('btnConfirmarEliminar');

    // Variables de estado
    let estadoSeleccionado = null;

    // Funciones auxiliares
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
        document.querySelectorAll('.modal').forEach(modal => modal.classList.remove('activo'));
        modalOverlay.classList.remove('activo');
        document.body.style.overflow = '';
    }

    function mostrarExito(titulo, mensaje) {
        document.getElementById('tituloExito').textContent = titulo;
        document.getElementById('mensajeExito').textContent = mensaje;
        abrirModal(modalExito);
    }

    function obtenerClientesSeleccionados() {
        return [...document.querySelectorAll('.checkbox-cliente:checked')].map(cb => cb.dataset.id);
    }

    function actualizarClientesSeleccionados() {
        const seleccionados = obtenerClientesSeleccionados();
        btnCambiarEstado.disabled = seleccionados.length === 0;
        btnCambiarEstado.style.opacity = seleccionados.length === 0 ? '0.6' : '1';
    }

    // Eventos
    document.addEventListener('change', function (e) {
        if (e.target.classList.contains('checkbox-cliente')) {
            actualizarClientesSeleccionados();
        }
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
        const nombre = document.getElementById('nombreCliente').value.trim();
        const apellido = document.getElementById('apellidoCliente').value.trim();
        const dni = document.getElementById('dniCliente').value.trim();
        const telefono = document.getElementById('telefonoCliente').value.trim();
        const correo = document.getElementById('correoElectronicoCliente').value.trim();

        const soloLetrasRegex = /^[A-Za-zÁÉÍÓÚÑáéíóú\s]{3,100}$/;
        const dosApellidosRegex = /^[A-Za-zÁÉÍÓÚÑáéíóú]+\s+[A-Za-zÁÉÍÓÚÑáéíóú]+$/;
        const dniRegex = /^\d{8}$/;
        const telefonoRegex = /^9\d{8}$/;
        const correoRegex = /^[a-zA-Z0-9._%+-]+@(gmail|hotmail)\.com$/;

        if (!soloLetrasRegex.test(nombre)) {
            Swal.fire('Nombre inválido', 'El nombre solo debe contener letras y espacios, mínimo 3 caracteres.', 'warning');
            return;
        }

        if (!soloLetrasRegex.test(apellido)) {
            Swal.fire('Apellido inválido', 'El apellido solo debe contener letras y espacios, mínimo 3 caracteres.', 'warning');
            return;
        }

        if (!dosApellidosRegex.test(apellido)) {
            Swal.fire('Apellido incompleto', 'Debe ingresar exactamente dos apellidos separados por un espacio.', 'warning');
            return;
        }

        if (!dniRegex.test(dni)) {
            Swal.fire('DNI inválido', 'El DNI debe contener exactamente 8 dígitos numéricos.', 'warning');
            return;
        }

        if (!telefonoRegex.test(telefono)) {
            Swal.fire('Teléfono inválido', 'El teléfono debe contener 9 dígitos y comenzar con 9.', 'warning');
            return;
        }

        if (!correoRegex.test(correo)) {
            Swal.fire('Correo inválido', 'El correo debe ser @gmail.com o @hotmail.com.', 'warning');
            return;
        }

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
                const data = await res.json(); // Siempre intenta parsear como JSON
                if (!res.ok) {
                    throw new Error(data.message || `Error HTTP ${res.status}`);
                }
                return data;
            })
            .then(data => {
                if (data.success) {
                    const cliente = data.cliente;
                    const nuevaFila = document.createElement('tr');
                    const clasesEstado = {
                        'Activo': 'activo',
                        'Evaluado': 'evaluado',
                        'NoDisponible': 'no-disponible',
                        'SinEvaluar': 'sin-evaluar'
                    };
                    const claseEstado = clasesEstado[cliente.estado] || 'sin-evaluar';
                    nuevaFila.setAttribute('data-id', cliente.id_cliente);
                    nuevaFila.setAttribute('data-estado', cliente.estado.toLowerCase());
                    nuevaFila.innerHTML = `
                        <td><input type="checkbox" class="checkbox-cliente" data-id="${cliente.id_cliente}"></td>
                        <td>${cliente.id_cliente}</td>
                        <td data-filtro="nombreCompleto">${cliente.nombre} ${cliente.apellido}</td>
                        <td data-filtro="dni">${cliente.dni}</td>
                        <td>${cliente.direccion}</td>
                        <td>${cliente.telefono}</td>
                        <td>${cliente.ingreso_neto}</td>
                        <td><span class="estado-badge ${claseEstado}">${cliente.estado}</span></td>
                        <td style="text-align: center;">
                            <button class="btn-detalles" data-id="${cliente.id_cliente}"><i class="fas fa-eye"></i></button>
                        </td>
                    `;
                    document.getElementById('tabla_clientes_body').appendChild(nuevaFila);
                    cerrarModal(modalAgregarCliente);
                    mostrarExito('Cliente agregado', data.message);
                    this.reset();
                    actualizarClientesSeleccionados();
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.message
                    });
                }
            })
            .catch(error => {
                console.error('Error al enviar formulario:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error inesperado',
                    text: error.message
                });
            });
    });

    btnEliminar.addEventListener('click', () => {
        if (obtenerClientesSeleccionados().length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Atención',
                text: 'Por favor, seleccione al menos un cliente'
            });
            return;
        }
        abrirModal(modalEliminarCliente);
    });

    btnCancelarEliminar.addEventListener('click', () => cerrarModal(modalEliminarCliente));

    btnConfirmarEliminar.addEventListener('click', () => {
        const clientesSeleccionados = obtenerClientesSeleccionados();
        if (clientesSeleccionados.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Atención',
                text: 'No hay clientes seleccionados'
            });
            return;
        }

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
                        if (fila) fila.remove();
                    });
                    cerrarModal(modalEliminarCliente);
                    mostrarExito('Clientes eliminados', data.message);
                    actualizarClientesSeleccionados();
                } else {
                    alert('Error: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error al eliminar clientes:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error inesperado',
                    text: 'Ocurrió un problema al eliminar los clientes'
                });
            });
    });

    btnConfirmarEstado.addEventListener('click', function () {
        const clientesSeleccionados = obtenerClientesSeleccionados();

        // Verificar que se ha seleccionado un estado
        if (!estadoSeleccionado) {
            Swal.fire({
                icon: 'warning',
                title: 'Atención',
                text: 'Por favor, seleccione un estado'
            });
            return;
        }

        // Verificar que se ha seleccionado al menos un cliente
        if (clientesSeleccionados.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Atención',
                text: 'Por favor, seleccione al menos un cliente'
            });
            return;
        }

        // Confirmación antes de realizar el cambio
        Swal.fire({
            title: '¿Estás seguro de cambiar el estado?',
            text: `Se cambiará el estado de ${clientesSeleccionados.length} cliente(s).`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, cambiar estado',
            cancelButtonText: 'Cancelar',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                // Crear el formulario con los datos
                const formData = new FormData();
                formData.append('clientes', JSON.stringify(clientesSeleccionados));  // Convertir lista de clientes a JSON
                formData.append('estado', estadoSeleccionado);  // Agregar el estado seleccionado

                // Enviar la solicitud al backend
                fetch('/actualizar_estado_clientes', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRFToken': document.querySelector('input[name=csrf_token]').value  // Token CSRF
                    }
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            // Actualizar el estado visualmente en la interfaz de usuario
                            clientesSeleccionados.forEach(id => {
                                const fila = document.querySelector(`tr[data-id="${id}"]`);
                                if (fila) {
                                    const spanEstado = fila.querySelector('.estado-badge');
                                    const clasesEstado = {
                                        'activo': 'activo',
                                        'evaluado': 'evaluado',
                                        'no-disponible': 'no-disponible',
                                        'sin-evaluar': 'sin-evaluar'
                                    };

                                    // Actualizar el estado visualmente
                                    spanEstado.className = 'estado-badge ' + (clasesEstado[estadoSeleccionado] || 'sin-evaluar');
                                    spanEstado.textContent = estadoSeleccionado.charAt(0).toUpperCase() + estadoSeleccionado.slice(1).replace('-', ' ');

                                    // Actualizar el atributo de estado de la fila
                                    fila.setAttribute('data-estado', estadoSeleccionado);
                                }
                            });

                            // Cerrar el modal de cambiar estado
                            cerrarModal(modalCambiarEstado);

                            // Mostrar mensaje de éxito con el número de clientes afectados
                            Swal.fire({
                                title: 'Estado Actualizado',
                                text: `Se actualizó el estado de ${clientesSeleccionados.length} cliente(s).`,
                                icon: 'success',
                                confirmButtonText: 'Cerrar'
                            });

                            // Resetear el estado seleccionado
                            estadoSeleccionado = null;
                            opcionesEstado.forEach(op => op.classList.remove('seleccionado'));
                        } else {
                            alert('Error: ' + data.message);
                        }
                    })
                    .catch(error => {
                        // Manejo de errores inesperados
                        console.error('Error al actualizar estado:', error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Error inesperado',
                            text: 'Ocurrió un problema al actualizar el estado'
                        });
                    });
            }
        });
    });

    btnCambiarEstado.addEventListener('click', () => {
        if (obtenerClientesSeleccionados().length === 0) {
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
        if (e.key === 'Escape') cerrarTodosLosModales();
    });

    // Inicializar selección
    actualizarClientesSeleccionados();

    // Buscador de clientes
    document.getElementById('buscarCliente').addEventListener('input', filtrarClientes);
    document.getElementById('filtroClientes').addEventListener('change', filtrarClientes);
    document.getElementById('filtroClientesEstado').addEventListener('change', filtrarClientes);

    function filtrarClientes() {
        const textoBusqueda = document.getElementById('buscarCliente').value.toLowerCase();
        const filtro = document.getElementById('filtroClientes').value;
        const filtroEstado = document.getElementById('filtroClientesEstado').value.toLowerCase();
        document.querySelectorAll('.tabla-clientes tbody tr').forEach(fila => {
            const estadoCliente = fila.getAttribute('data-estado').toLowerCase();
            const coincideEstado = (filtroEstado === 'todos') || (estadoCliente === filtroEstado);
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
        paginarTabla();
    }

    // Paginación en la tabla de clientes
    let filasPorPagina = 10;
    let paginaActual = 1;

    function paginarTabla() {
        const filas = Array.from(document.querySelectorAll('#tabla_clientes_body tr'))
            .filter(fila => fila.style.display !== 'none');
        const totalPaginas = Math.ceil(filas.length / filasPorPagina);
        const paginacion = document.getElementById('paginacion');

        function mostrarPagina(pagina) {
            paginaActual = pagina;
            const inicio = (pagina - 1) * filasPorPagina;
            const fin = inicio + filasPorPagina;

            // Primero ocultamos todas las filas
            document.querySelectorAll('#tabla_clientes_body tr').forEach(fila => fila.style.display = 'none');

            // Mostramos sólo las filas visibles en el filtro correspondientes a la página
            filas.forEach((fila, i) => {
                if (i >= inicio && i < fin) {
                    fila.style.display = '';
                }
            });

            paginacion.innerHTML = '';
            for (let i = 1; i <= totalPaginas; i++) {
                const boton = document.createElement('button');
                boton.textContent = i;
                if (i === pagina) boton.classList.add('activo');
                boton.addEventListener('click', () => mostrarPagina(i));
                paginacion.appendChild(boton);
            }
        }

        if (totalPaginas > 0) {
            mostrarPagina(paginaActual);
        } else {
            paginacion.innerHTML = ''; // No mostrar paginación si no hay filas
        }
    }

    paginarTabla();
};
