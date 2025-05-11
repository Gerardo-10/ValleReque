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

    const personalData = [
        {id: 'nombre', label: 'Nombre', value: 'Sixto Jose', type: 'text'},
        {id: 'apellido', label: 'Apellido', value: 'Cubas Juape', type: 'text'},
        {id: 'direccion', label: 'Dirección', value: 'Calle Atahualpa #356', type: 'text'},
        {id: 'ingresoNeto', label: 'Ingreso Neto', value: 'S/5000', type: 'text'},
        {id: 'dni', label: 'DNI', value: '75656345', type: 'text'},
        {id: 'telefono', label: 'Teléfono', value: '942569752', type: 'text'},
        {id: 'ocupacion', label: 'Ocupación', value: 'Ingeniero', type: 'text'},
        {id: 'cargaFamiliar', label: 'Carga Familiar', value: 'Sí', type: 'select', options: ['Sí', 'No']}
    ];

    const familyData = [
        {id: 'nombreFamiliar', label: 'Nombre', value: 'Juan Carlos', type: 'text'},
        {id: 'apellidoFamiliar', label: 'Apellido', value: 'Bodoque', type: 'text'},
        {id: 'dniFamiliar', label: 'DNI', value: '7548512', type: 'text'},
        {
            id: 'relacionFamiliar',
            label: 'Relación',
            value: 'Cónyuge',
            type: 'select',
            options: ['Cónyuge', 'Hijo/a', 'Padre/Madre', 'Otro']
        }
    ];

    // Functions
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
        modals.forEach(modal => {
            modal.classList.remove('active');
        });
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function showSuccess() {
        closeModal(editModal);
        setTimeout(() => {
            openModal(successModal);
        }, 300);
    }

    function generateFormFields(fields) {
        formFields.innerHTML = '';

        fields.forEach(field => {
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
    }

    // Event Listeners
    editButtons.forEach(button => {
        button.addEventListener('click', function () {
            const section = this.dataset.section;

            if (section === 'personal') {
                modalTitle.textContent = 'Editar Datos Personales';
                generateFormFields(personalData);
            } else if (section === 'family') {
                modalTitle.textContent = 'Editar Familiar o Cónyuge';
                generateFormFields(familyData);
            }

            openModal(editModal);
        });
    });

    editForm.addEventListener('submit', function (e) {
        e.preventDefault();
        showSuccess();
    });

    printButton.addEventListener('click', function () {
        window.print();
    });

    exportButton.addEventListener('click', function () {
        alert('Exportando datos a Excel...');


    });

    closeButtons.forEach(button => {
        button.addEventListener('click', function () {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });

    cancelButton.addEventListener('click', () => {
        closeModal(editModal);
    });

    modalOverlay.addEventListener('click', closeAllModals);

    // Cerrar modal
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });

    document.addEventListener("click", function (e) {
        const editBtn = e.target.closest(".edit-button");
        if (editBtn && editBtn.dataset.section === "personal") {
            const clienteId = window.location.pathname.split("/").pop(); // Extrae ID de URL

            fetch(`/obtener_cliente/${clienteId}`)
                .then(response => response.json())
                .then(cliente => {
                    if (!cliente) {
                        alert("No se pudo cargar la información del cliente.");
                        return;
                    }

                    mostrarModalConDatos(cliente); // Aquí llenas los campos del formulario
                    document.getElementById("editModal").style.display = "block";
                })
                .catch(err => {
                    console.error("Error obteniendo datos del cliente:", err);
                    alert("Error al cargar los datos.");
                });
        }

        if (e.target.closest(".close-button") || e.target.closest(".cancel-button")) {
            document.getElementById("editModal").style.display = "none";
        }
    });

    function mostrarModalConDatos(cliente) {
        const formGrid = document.getElementById("formFields");
        formGrid.innerHTML = `
            <input type="hidden" name="id_cliente" value="${cliente.id_cliente}">
            <label>Nombre: <input name="nombre" value="${cliente.nombre}" required></label>
            <label>Apellido: <input name="apellido" value="${cliente.apellido}" required></label>
            <label>DNI: <input name="dni" value="${cliente.dni}" required></label>
            <label>Dirección: <input name="direccion" value="${cliente.direccion}" required></label>
            <label>Correo: <input name="correo" value="${cliente.correo}" required></label>
            <label>Teléfono: <input name="telefono" value="${cliente.telefono}" required></label>
            <label>Ocupación: <input name="ocupacion" value="${cliente.ocupacion}" required></label>
            <label>Ingreso Neto: <input type="number" name="ingreso_neto" value="${cliente.ingreso_neto}" required></label>
            <label>Estado: 
                <select name="estado">
                    <option value="1" ${cliente.estado == 1 ? "selected" : ""}>Activo</option>
                    <option value="0" ${cliente.estado == 0 ? "selected" : ""}>Inactivo</option>
                </select>
            </label>
            <label>Carga Familiar: 
                <select name="carga_familiar">
                    <option value="1" ${cliente.carga_familiar == 1 ? "selected" : ""}>Sí</option>
                    <option value="0" ${cliente.carga_familiar == 0 ? "selected" : ""}>No</option>
                </select>
            </label>
        `;
    }

    document.getElementById("editForm").addEventListener("submit", function (e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        fetch('/actualizar_clientes', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(result => {
                if (result.success) {
                    alert("Datos actualizados correctamente");
                    document.getElementById("editModal").style.display = "none";
                    cargarVista(`/detalle_clientes/${data.id_cliente}`);
                } else {
                    alert("Error al actualizar");
                }
            })
            .catch(error => {
                console.error("Error en la solicitud:", error);
                alert("Ocurrió un error inesperado.");
            });
    });
}