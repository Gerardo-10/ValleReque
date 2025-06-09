window.initDetalleCliente = function () {
    const editButtons = document.querySelectorAll('.edit-button');
    const printButton = document.querySelector('.print-button');
    const exportButton = document.querySelector('.export-button');

    const editModal = document.getElementById('editModal');
    const successModal = document.getElementById('successModal');
    const modalOverlay = document.querySelector('.modal-overlay');

    const closeButtons = document.querySelectorAll('.close-button');
    const cancelButtons = document.querySelectorAll('.cancel-button');

    const editForm = document.getElementById('editForm');
    const formFields = document.getElementById('formFields');
    const modalTitle = document.getElementById('modalTitle');

    const familiarModal = document.getElementById('editFamiliarModal');
    const familiarForm = document.getElementById('familiarForm');

    function validarTextoAlfabetico(texto) {
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,50}$/;
    return regex.test(texto);
    }

    function validarDireccion(texto) {
        const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s#]{1,50}$/;
        return regex.test(texto);
    }

    function validarIngresoNeto(valor) {
        return /^[0-9]+(\.[0-9]{1,2})?$/.test(valor);
    }

    function validarDNI(dni) {
        return /^\d{8}$/.test(dni);
    }

    function validarTelefono(telefono) {
        return /^\d{9}$/.test(telefono);
    }

    function validarFamiliarNombre(nombre) {
        return validarTextoAlfabetico(nombre);
    }

    function validarFamiliarApellido(apellido) {
        const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s#]{1,50}$/;
        return regex.test(apellido);
    }

    function validarFamiliarDNI(dni) {
        return /^\d{8}$/.test(dni);
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

                let input;
                if (field.type === 'select') {
                    input = document.createElement('select');
                    input.id = field.id;
                    input.name = field.id;
                    field.options.forEach(option => {
                        const opt = document.createElement('option');
                        opt.value = option;
                        opt.textContent = option;
                        if (option === field.value) opt.selected = true;
                        input.appendChild(opt);
                    });

                    if (field.id === 'carga_familiar') {
                        input.addEventListener('change', () => {
                            const famSection = document.querySelector('[data-section="family"]');
                            if (input.value === 'No') {
                                famSection?.classList.add('hidden');
                            } else {
                                famSection?.classList.remove('hidden');
                            }
                        });
                    }
                } else {
                    input = document.createElement('input');
                    input.type = field.type;
                    input.id = field.id;
                    input.name = field.id;
                    input.value = field.value;
                    input.autocomplete = "off";

                    switch (field.id) {
                        case 'nombre':
                        case 'apellido':
                        case 'ocupacion':
                            input.maxLength = 50;
                            input.pattern = "^[A-Za-zÁÉÍÓÚáéíóúÑñ\\s]{1,50}$";
                            input.required = true;
                            input.addEventListener('input', () => {
                                input.value = input.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '').slice(0, 50);
                            });
                            break;
                        case 'direccion':
                            input.maxLength = 50;
                            input.pattern = "^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\\s#]{1,50}$";
                            input.required = true;
                            input.addEventListener('input', () => {
                                input.value = input.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s#]/g, '').slice(0, 50);
                            });
                            break;
                        case 'ingreso_neto':
                            input.required = true;
                            input.addEventListener('input', () => {
                                let val = input.value.replace(/,/g, '.').replace(/[^0-9.]/g, '');
                                const parts = val.split('.');
                                if (parts.length > 2) val = parts[0] + '.' + parts[1];
                                if (parts[1]?.length > 2) val = parts[0] + '.' + parts[1].slice(0, 2);
                                input.value = val;
                            });
                            break;
                        case 'dni':
                            input.pattern = "^\\d{8}$";
                            input.required = true;
                            input.maxLength = 8;
                            input.addEventListener('input', () => {
                                input.value = input.value.replace(/\D/g, '').slice(0, 8);
                            });
                            break;
                        case 'telefono':
                            input.pattern = "^\\d{9}$";
                            input.required = true;
                            input.maxLength = 9;
                            input.addEventListener('input', () => {
                                input.value = input.value.replace(/\D/g, '').slice(0, 9);
                            });
                            break;
                        case 'correo':
                            input.required = true;
                            input.pattern = "^[a-zA-Z0-9._%+-]+@(gmail|hotmail)\\.com$";
                            input.addEventListener('input', () => {
                                input.value = input.value.replace(/[^a-zA-Z0-9@._+-]/g, '');
                            });
                            break;
                    }
                }

                formGroup.appendChild(input);
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

    // Validaciones para campos de familiar
    document.getElementById('nombre_familiar')?.addEventListener('input', function () {
        this.value = this.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '').slice(0, 50);
    });

    document.getElementById('apellido_familiar')?.addEventListener('input', function () {
        this.value = this.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s#]/g, '').slice(0, 50);
    });

    document.getElementById('dni_familiar')?.addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '').slice(0, 8);
    });

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
        document.querySelectorAll('.modal.active').forEach(m => m.classList.remove('active'));
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function actualizarCampo(field, value) {
        document.querySelectorAll(`[data-field="${field}"]`).forEach(el => {
            el.textContent = value;
        });
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

        // REASIGNAR submit dinámicamente
        setTimeout(() => {
            const editForm = document.getElementById('editForm');
            if (!editForm) {
                console.error("❌ No se encontró #editForm");
                return;
            }

            // Remover cualquier submit previo
            const newForm = editForm.cloneNode(true);
            editForm.parentNode.replaceChild(newForm, editForm);

            newForm.addEventListener('submit', function (e) {
                e.preventDefault();
                console.log("✅ Evento submit capturado correctamente");

                const nombre = document.getElementById('nombre')?.value.trim();
                const apellido = document.getElementById('apellido')?.value.trim();
                const direccion = document.getElementById('direccion')?.value.trim();
                const ingreso_neto = document.getElementById('ingreso_neto')?.value.trim();
                const dni = document.getElementById('dni')?.value.trim();
                const telefono = document.getElementById('telefono')?.value.trim();
                const ocupacion = document.getElementById('ocupacion')?.value.trim();
                const estado = document.getElementById('estado')?.value;
                const carga_familiar = document.getElementById('carga_familiar')?.value;
                const correo = document.getElementById('correo')?.value.trim();
                const id_cliente = document.getElementById('id_cliente')?.value;

                if (!validarTextoAlfabetico(nombre)) {
                    return Swal.fire('Error', 'Nombre inválido.', 'error');
                }
                // ... demás validaciones ...

                const data = {
                    id_cliente,
                    nombre,
                    apellido,
                    direccion,
                    ingreso_neto: parseFloat(ingreso_neto),
                    dni,
                    telefono,
                    ocupacion,
                    correo,
                    estado,
                    carga_familiar: carga_familiar === 'Sí' ? 1 : 0
                };

                fetch('/actualizar_clientes', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": document.querySelector('input[name="csrf_token"]').value
                    },
                    body: JSON.stringify(data)
                })
                .then(res => res.json())
                .then(result => {
                    if (result.success) {
                        Swal.fire('Éxito', result.message, 'success').then(() => {
                            closeModal(editModal);
                            actualizarCampo("nombre", data.nombre);
                            actualizarCampo("apellido", data.apellido);
                            actualizarCampo("dni", data.dni);
                            actualizarCampo("direccion", data.direccion);
                            actualizarCampo("correo", data.correo);
                            actualizarCampo("telefono", data.telefono);
                            actualizarCampo("ocupacion", data.ocupacion);
                            actualizarCampo("ingreso_neto", data.ingreso_neto);
                            actualizarCampo("estado", data.estado);
                            actualizarCampo("carga_familiar", data.carga_familiar === 1 ? "Sí" : "No");
                        });
                    } else {
                        Swal.fire('Error', result.message, 'error');
                    }
                })
                .catch(err => {
                    console.error("❌ Error en la solicitud:", err);
                    Swal.fire('Error', 'Error inesperado al guardar.', 'error');
                });
            });
        }, 150);
    }
}



    editButtons.forEach(button => {
        button.addEventListener('click', function () {
            const clienteId = this.dataset.id;
            const section = this.dataset.section;

            if (section === 'family') {
                fetch(`/familiar/${clienteId}`)
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            document.getElementById('nombre_familiar').value = data.familiar.nombre;
                            document.getElementById('apellido_familiar').value = data.familiar.apellido;
                            document.getElementById('dni_familiar').value = data.familiar.documento;
                            document.getElementById('id_cliente_familiar').value = clienteId;
                            openModal(familiarModal);
                        } else {
                            Swal.fire('Error', data.message, 'error');
                        }
                    })
                    .catch(err => {
                        console.error("Error al obtener datos del familiar:", err);
                        Swal.fire('Error', 'No se pudo cargar los datos del familiar.', 'error');
                    });
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

        const formData = new FormData(e.target);
        const nombre = document.getElementById('nombre')?.value.trim();
        const apellido = document.getElementById('apellido')?.value.trim();
        const direccion = document.getElementById('direccion')?.value.trim();
        const ingreso_neto = document.getElementById('ingreso_neto')?.value.trim();
        const dni = document.getElementById('dni')?.value.trim();
        const telefono = document.getElementById('telefono')?.value.trim();
        const ocupacion = document.getElementById('ocupacion')?.value.trim();
        const estado = document.getElementById('estado')?.value;
        const carga_familiar = document.getElementById('carga_familiar')?.value;
        const correo = document.getElementById('correo')?.value.trim();
        const id_cliente = document.getElementById('id_cliente')?.value;


        // Validaciones
        if (!validarTextoAlfabetico(nombre)) {
            return Swal.fire('Error', 'Nombre inválido. Solo letras y máximo 50 caracteres.', 'error');
        }
        if (!validarTextoAlfabetico(apellido)) {
            return Swal.fire('Error', 'Apellido inválido. Solo letras y máximo 50 caracteres.', 'error');
        }
        if (!validarDireccion(direccion)) {
            return Swal.fire('Error', 'Dirección inválida. Solo letras, números y #, máximo 50 caracteres.', 'error');
        }
        if (!validarIngresoNeto(ingreso_neto)) {
            return Swal.fire('Error', 'Ingreso Neto inválido. Solo números enteros o decimales con punto.', 'error');
        }
        if (!validarDNI(dni)) {
            return Swal.fire('Error', 'DNI inválido. Deben ser 8 dígitos numéricos.', 'error');
        }
        if (!validarTelefono(telefono)) {
            return Swal.fire('Error', 'Teléfono inválido. Deben ser 9 dígitos numéricos.', 'error');
        }
        if (!validarTextoAlfabetico(ocupacion)) {
            return Swal.fire('Error', 'Ocupación inválida. Solo letras y máximo 50 caracteres.', 'error');
        }


        // Armar objeto para enviar
        const data = {
            id_cliente,
            nombre,
            apellido,
            direccion,
            ingreso_neto: parseFloat(ingreso_neto),
            dni,
            telefono,
            ocupacion,
            correo,
            estado,
            carga_familiar: carga_familiar === 'Sí' ? 1 : 0
        };

        fetch('/actualizar_clientes', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": document.querySelector('input[name="csrf_token"]').value
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
                        text: result.message || 'Los datos del cliente fueron actualizados correctamente.'
                    }).then(() => {
                        closeModal(editModal);
                        actualizarCampo("nombre", data.nombre);
                        actualizarCampo("apellido", data.apellido);
                        actualizarCampo("dni", data.dni);
                        actualizarCampo("direccion", data.direccion);
                        actualizarCampo("correo", data.correo);
                        actualizarCampo("telefono", data.telefono);
                        actualizarCampo("ocupacion", data.ocupacion);
                        actualizarCampo("ingreso_neto", data.ingreso_neto);
                        actualizarCampo("estado", data.estado);
                        actualizarCampo("carga_familiar", data.carga_familiar === 1 ? "Sí" : "No");
                    });
                } else {
                    Swal.fire({ icon: 'error', title: 'Error', text: result.message });
                }
            } else {
                Swal.fire({ icon: 'error', title: 'Error inesperado', text: 'Respuesta no válida del servidor.' });
            }
        })
        .catch(error => {
            console.error("Error en la solicitud:", error);
            Swal.fire({ icon: 'error', title: 'Error inesperado', text: 'Ocurrió un problema al guardar.' });
        });
    });

    familiarForm?.addEventListener('submit', function (e) {
        e.preventDefault();

        const nombre = document.getElementById('nombre_familiar').value;
        const apellido = document.getElementById('apellido_familiar').value;
        const dni = document.getElementById('dni_familiar').value;

        if (!validarFamiliarNombre(nombre)) {
            return Swal.fire('Error', 'Nombre del familiar inválido. Solo letras y máximo 50 caracteres.', 'error');
        }

        if (!validarFamiliarApellido(apellido)) {
            return Swal.fire('Error', 'Apellido del familiar inválido. Solo letras, números y #. Máximo 50 caracteres.', 'error');
        }

        if (!validarFamiliarDNI(dni)) {
            return Swal.fire('Error', 'DNI del familiar inválido. Deben ser 8 dígitos numéricos.', 'error');
        }

        const formData = new FormData(familiarForm);

        fetch('/actualizar_familiar', {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': document.querySelector('input[name=csrf_token]').value
            }
        })
        .then(async res => {
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const data = await res.json();
                if (data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Familiar actualizado',
                        text: data.message
                    }).then(() => {
                        closeModal(familiarModal);
                        actualizarCampo("familiar_nombre", formData.get('nombre'));
                        actualizarCampo("familiar_apellido", formData.get('apellido'));
                        actualizarCampo("familiar_documento", formData.get('documento'));
                    });
                } else {
                    Swal.fire('Error', data.message, 'error');
                }
            } else {
                const text = await res.text();
                console.error("⚠️ Respuesta inesperada (no es JSON):", text);
                Swal.fire('Error', 'Respuesta inesperada del servidor.', 'error');
            }
        })
        .catch(error => {
            console.error("❌ Error al actualizar familiar:", error);
            Swal.fire('Error', error?.message || 'Ocurrió un error al actualizar.', 'error');
        });
    });

    cancelButtons.forEach(button => {
        button.addEventListener('click', () => {
            closeAllModals();
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', function () {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });

    modalOverlay?.addEventListener('click', closeAllModals);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeAllModals();
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
};

window.addEventListener('DOMContentLoaded', () => {
    if (typeof window.initDetalleCliente === 'function') {
        window.initDetalleCliente();
    }
});
