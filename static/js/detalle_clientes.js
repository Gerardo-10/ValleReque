window.initDetalleCliente = function () {
    const editButtons = document.querySelectorAll('.edit-button');
    const printButton = document.querySelector('.print-button');
    const exportButton = document.querySelector('.export-button');

    const editModal = document.getElementById('editModal');
    const successModal = document.getElementById('successModal');
    const modalOverlay = document.querySelector('.modal-overlay');

    const closeButtons = document.querySelectorAll('.close-button');
    const cancelButton = document.querySelector('.cancel-button');

    const editForm = document.getElementById('editForm');
    const formFields = document.getElementById('formFields');
    const modalTitle = document.getElementById('modalTitle');

    // Familiar
    const familiarModal = document.getElementById('editFamiliarModal');
    const familiarForm = document.getElementById('familiarForm');

    function openModal(modal) {
        modal.classList.add('active');
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
        modal.classList.remove('active');
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => modal.classList.remove('active'));
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function generateFormFields(fields) {
        try {
            formFields.innerHTML = '';
            fields.forEach(field => {
                if (field.type === 'hidden') {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.id = field.id;
                    input.name = field.id;
                    input.value = field.value;
                    formFields.appendChild(input);
                    return;
                }

                const formGroup = document.createElement('div');
                formGroup.className = 'form-group';

                const label = document.createElement('label');
                label.setAttribute('for', field.id);
                label.textContent = field.label;
                formGroup.appendChild(label);

                if (field.type === 'select') {
                    const select = document.createElement('select');
                    select.id = field.id;
                    select.name = field.id;

                    field.options.forEach(option => {
                        const optionEl = document.createElement('option');
                        optionEl.value = option;
                        optionEl.textContent = option;
                        if (option === field.value) {
                            optionEl.selected = true;
                        }
                        select.appendChild(optionEl);
                    });

                    formGroup.appendChild(select);
                } else {
                    const input = document.createElement('input');
                    input.type = field.type;
                    input.id = field.id;
                    input.name = field.id;
                    input.value = field.value;
                    formGroup.appendChild(input);
                }

                formFields.appendChild(formGroup);
            });
        } catch (err) {
            console.error("Error generando campos del formulario:", err);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un problema al cargar el formulario.'
            });
        }
    }

    function mostrarModalConDatos(cliente) {
        const fields = [
            { id: 'id_cliente', label: 'ID', value: cliente.id_cliente, type: 'hidden' },
            { id: 'nombre', label: 'Nombre', value: cliente.nombre, type: 'text' },
            { id: 'apellido', label: 'Apellido', value: cliente.apellido, type: 'text' },
            { id: 'dni', label: 'DNI', value: cliente.dni, type: 'text' },
            { id: 'direccion', label: 'Dirección', value: cliente.direccion, type: 'text' },
            { id: 'correo', label: 'Correo', value: cliente.correo, type: 'text' },
            { id: 'telefono', label: 'Teléfono', value: cliente.telefono, type: 'text' },
            { id: 'ocupacion', label: 'Ocupación', value: cliente.ocupacion, type: 'text' },
            { id: 'ingreso_neto', label: 'Ingreso Neto', value: cliente.ingreso_neto, type: 'number' },
            {
                id: 'estado', label: 'Estado',
                value: cliente.estado,
                type: 'select',
                options: ['Activo', 'Evaluado', 'NoDisponible', 'SinEvaluar']
            },
            {
                id: 'carga_familiar', label: 'Carga Familiar',
                value: cliente.carga_familiar == 1 ? 'Sí' : 'No',
                type: 'select',
                options: ['Sí', 'No']
            }
        ];

        modalTitle.textContent = 'Editar Datos del Cliente';
        generateFormFields(fields);
        openModal(editModal);
    }

    editButtons.forEach(button => {
        button.addEventListener('click', function () {
            const clienteId = this.dataset.id;
            const section = this.dataset.section;

            if (section === 'family') {
                openModal(familiarModal);
                return;
            }

            fetch(`/obtener_cliente/${clienteId}`)
                .then(response => response.json())
                .then(cliente => {
                    if (!cliente) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'No se pudo cargar la información del cliente.'
                        });
                        return;
                    }
                    mostrarModalConDatos(cliente);
                })
                .catch(err => {
                    console.error("Error obteniendo datos del cliente:", err);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error al cargar los datos del cliente.'
                    });
                });
        });
    });

    editForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const csrfToken = document.querySelector('input[name="csrf_token"]').value;
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        data.carga_familiar = data.carga_familiar === 'Sí' ? 1 : 0;
        data.ingreso_neto = parseFloat(data.ingreso_neto);

        fetch('/actualizar_clientes', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken
            },
            body: JSON.stringify(data)
        })
            .then(async res => {
                const contentType = res.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const result = await res.json();
                    if (result.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Cliente actualizado',
                            text: result.message || 'Los datos del cliente fueron actualizados correctamente.',
                            confirmButtonText: 'Aceptar'
                        }).then(() => {
                            closeModal(editModal);
                            if (typeof cargarVista === "function") {
                                cargarVista(`/detalle_clientes/${data.id_cliente}`, initDetalleCliente);
                            } else {
                                window.location.href = `/detalle_clientes/${data.id_cliente}`;
                            }
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: result.message || 'No se pudo actualizar el cliente.'
                        });
                    }
                } else {
                    const text = await res.text();
                    console.error("Respuesta inesperada del servidor:", text);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error inesperado',
                        text: 'El servidor no devolvió una respuesta JSON válida.'
                    });
                }
            })
            .catch(error => {
                console.error("Error en la solicitud:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error inesperado',
                    text: 'Ocurrió un problema al guardar los cambios.'
                });
            });
    });

    familiarForm?.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(familiarForm);
        const data = Object.fromEntries(formData.entries());

        console.log("Datos del familiar:", data); // Aquí irá el fetch real si deseas enviar al backend

        Swal.fire({
            icon: 'success',
            title: 'Familiar actualizado',
            text: 'Los datos del familiar fueron actualizados correctamente.'
        });

        closeModal(familiarModal);
    });

    printButton?.addEventListener('click', () => window.print());

    exportButton?.addEventListener('click', () => {
        Swal.fire({
            icon: 'info',
            title: 'Exportar',
            text: 'Exportando datos a Excel...',
            timer: 2000,
            showConfirmButton: false
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', function () {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });

    cancelButton?.addEventListener('click', () => {
        closeModal(editModal);
        closeModal(familiarModal);
    });

    modalOverlay?.addEventListener('click', closeAllModals);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeAllModals();
    });
};
