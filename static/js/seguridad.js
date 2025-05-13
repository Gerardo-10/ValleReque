window.initSecurityModals = function () {
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

    let empleadosSeleccionados = [];
    let estadoSeleccionado = null;

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
        document.querySelectorAll('.checkbox-empleado').forEach(checkbox => {
            if (checkbox.checked) {
                empleadosSeleccionados.push(checkbox.dataset.id);
            }
        });

        btnCambiarEstado.disabled = empleadosSeleccionados.length === 0;
        btnCambiarEstado.style.opacity = empleadosSeleccionados.length === 0 ? '0.6' : '1';
    }

    document.addEventListener('change', actualizarEmpleadosSeleccionados);

    opcionesEstado.forEach(opcion => {
        opcion.addEventListener('click', function () {
            opcionesEstado.forEach(op => op.classList.remove('seleccionado'));
            this.classList.add('seleccionado');
            estadoSeleccionado = this.dataset.estado;
        });
    });

    formAgregarEmpleado.addEventListener('submit', function (e) {
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
                    const errorText = await res.text();
                    throw new Error(`Error HTTP ${res.status}: ${errorText}`);
                }
                return res.json();
            })
            .then(data => {
                if (data.success) {
                    const empleado = data.empleado;
                    const estadoTexto = empleado.estado === 1 ? 'Activo' : 'Inactivo';
                    const estadoClase = empleado.estado === 1 ? 'activo' : 'inactivo';
                    const estadoData = empleado.estado === 1 ? 'activos' : 'inactivos';

                    const nuevaFila = document.createElement('tr');
                    nuevaFila.setAttribute('data-estado', estadoData);
                    nuevaFila.innerHTML = `
                    <td><input type="checkbox" class="checkbox-empleado" data-id="${empleado.id_empleado}"></td>
                    <td>${empleado.id_empleado}</td>
                    <td data-filtro="nombre">${empleado.nombre}</td>
                    <td data-filtro="apellido">${empleado.apellido}</td>
                    <td data-filtro="dni">${empleado.dni}</td>
                    <td data-filtro="area">${empleado.area}</td>
                    <td><span class="estado-badge ${estadoClase}">${estadoTexto}</span></td>
                    <td style="text-align: center;">
                        <button class="btn-detalles" data-id="${empleado.id_empleado}"><i class="fas fa-eye"></i></button>
                    </td>
                `;

                    document.getElementById('tabla_empleados_body').appendChild(nuevaFila);
                    cerrarModal(modalAgregarEmpleado);
                    mostrarExito('Empleado agregado', data.message);
                    this.reset();
                } else {
                    alert('Error: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error al enviar formulario:', error);
                alert('Error inesperado al enviar el formulario: ' + error.message);
            });
    });

    // Esto debería estar fuera del addEventListener, preferiblemente al cargar la página
    opcionesEstado.forEach(opcion => {
        opcion.addEventListener('click', function () {
            // Limpiar todas las opciones seleccionadas
            opcionesEstado.forEach(op => op.classList.remove('seleccionado'));
            // Seleccionar la opción clickeada
            this.classList.add('seleccionado');
            // Establecer el estado basado en el atributo de la opción
            estadoSeleccionado = this.getAttribute('data-estado');  // Puede ser '1' o '0'
            console.log("Estado seleccionado:", estadoSeleccionado);
        });
    });

// Este es el addEventListener para confirmar la acción
    btnConfirmarEstado.addEventListener('click', function () {
        // Verificar si se ha seleccionado un estado
        if (!estadoSeleccionado) {
            alert('Por favor, seleccione un estado');
            return;
        }

        // Verificar si se ha seleccionado al menos un empleado
        if (empleadosSeleccionados.length === 0) {
            alert('Por favor, seleccione al menos un empleado');
            return;
        }

        // Almacenar la cantidad de empleados seleccionados antes de vaciar la lista
        const cantidadEmpleadosSeleccionados = empleadosSeleccionados.length;

        // Hacer la llamada AJAX para cambiar el estado
        fetch('/cambiar_estado_empleados', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': document.querySelector('input[name=csrf_token]').value
            },
            body: JSON.stringify({
                ids: empleadosSeleccionados,
                estado: estadoSeleccionado
            })
        })
            .then(async res => {
                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(`Error HTTP ${res.status}: ${errorText}`);
                }
                return res.json();
            })
            .then(data => {
                if (data.success) {
                    // Actualizar visualmente las filas seleccionadas
                    empleadosSeleccionados.forEach(id => {
                        const fila = document.querySelector(`.checkbox-empleado[data-id="${id}"]`).closest('tr');
                        if (fila) {
                            const nuevoEstadoTexto = estadoSeleccionado == 1 ? 'Activo' : 'Inactivo';
                            const nuevoEstadoClase = estadoSeleccionado == 1 ? 'activo' : 'inactivo';
                            const nuevoEstadoData = estadoSeleccionado == 1 ? 'activos' : 'inactivos';

                            // Actualizar el texto y las clases CSS del estado
                            const spanEstado = fila.querySelector('.estado-badge');
                            if (spanEstado) {
                                spanEstado.textContent = nuevoEstadoTexto;
                                spanEstado.classList.remove('activo', 'inactivo');
                                spanEstado.classList.add(nuevoEstadoClase);
                            }

                            // Actualizar el atributo 'data-estado' de la fila
                            fila.setAttribute('data-estado', nuevoEstadoData);
                        }
                    });

                    // Limpiar la selección de estado
                    opcionesEstado.forEach(opcion => opcion.classList.remove('seleccionado'));
                    estadoSeleccionado = null;

                    // Desmarcar todos los checkboxes
                    checkboxesEmpleados.forEach(checkbox => checkbox.checked = false);
                    empleadosSeleccionados = [];  // Limpiar empleados seleccionados

                    // Cerrar el modal
                    cerrarModal(modalCambiarEstado);

                    // Mostrar mensaje de éxito con la cantidad correcta
                    mostrarExito('Estado Actualizado', `Se ha actualizado el estado de ${cantidadEmpleadosSeleccionados} empleado(s).`);

                    // Actualizar lista de empleados seleccionados (vaciar la lista visualmente si es necesario)
                    actualizarEmpleadosSeleccionados();
                } else {
                    alert('Error: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error al cambiar estado:', error);
                alert('Error inesperado: ' + error.message);
            });
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
