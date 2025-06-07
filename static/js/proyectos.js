function initProyectosModals() {
    // Elementos principales
    const btnNuevoProyecto = document.getElementById('proy-btnNuevoProyecto');
    const modalNuevoProyecto = document.getElementById('proy-modalNuevoProyecto');
    const btnConfigurarPrecios = document.getElementById('proy-btnConfigurarPrecios');
    const modalConfigurarPrecios = document.getElementById('proy-modalConfigurarPrecios');
    const modalBackdrop = document.createElement('div');
    modalBackdrop.className = 'proy-modal-backdrop';
    modalBackdrop.id = 'proy-modalBackdrop';
    document.body.appendChild(modalBackdrop);

    // Elementos del formulario
    const formNuevoProyecto = document.getElementById('proy-formNuevoProyecto');
    const nombreProyecto = document.getElementById('proy-nombreProyecto');
    const direccion = document.getElementById('proy-direccion');
    const inversion = document.getElementById('proy-inversion');
    const numLotes = document.getElementById('proy-numLotes');
    const numEtapas = document.getElementById('proy-numEtapas');
    const fotoReferencia = document.getElementById('proy-fotoReferencia');
    const mapaPreview = document.querySelector('.proy-map-preview img');

    // Función para validar solo letras y espacios
    function validarSoloLetras(event) {
        const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
        if (!regex.test(event.target.value)) {
            event.target.value = event.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
        }
    }

    // Función para validar solo números positivos
    function validarSoloNumeros(event) {
        const value = event.target.value.replace(/[^0-9.]/g, '');
        event.target.value = value;

        // Para evitar múltiples puntos decimales
        if ((event.target.value.match(/\./g) || []).length > 1) {
            event.target.value = event.target.value.substring(0, event.target.value.length - 1);
        }
    }

    // Función para validar números enteros
    function validarEnterosPositivos(event) {
        event.target.value = event.target.value.replace(/[^0-9]/g, '');
    }

    // Event listeners para validación en tiempo real
    nombreProyecto.addEventListener('input', validarSoloLetras);
    inversion.addEventListener('input', validarSoloNumeros);
    numLotes.addEventListener('input', validarEnterosPositivos);
    numEtapas.addEventListener('input', validarEnterosPositivos);

    // Previsualización de la imagen
    fotoReferencia.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            const validExtensions = ['image/jpeg', 'image/png', 'image/jpg'];

            if (!validExtensions.includes(file.type)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Formato incorrecto',
                    text: 'Por favor, sube una imagen en formato JPG o PNG',
                    confirmButtonText: 'Entendido'
                });
                e.target.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onload = function (event) {
                mapaPreview.src = event.target.result;
            }
            reader.readAsDataURL(file);
        }
    });

// Función para validar el formulario completo
    function validarFormulario() {
        // Validar nombre (solo letras)
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombreProyecto.value.trim())) {
            Swal.fire({
                icon: 'error',
                title: 'Error en el nombre',
                text: 'El nombre del proyecto solo puede contener letras',
                confirmButtonText: 'Entendido'
            }).then(() => {
                nombreProyecto.focus();
            });
            return false;
        }

        // Validar dirección (no vacía)
        if (direccion.value.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Campo requerido',
                text: 'La dirección es requerida',
                confirmButtonText: 'Entendido'
            }).then(() => {
                direccion.focus();
            });
            return false;
        }

        // Validar inversión (número positivo)
        if (inversion.value.trim() === '' || isNaN(inversion.value) || parseFloat(inversion.value) <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Valor inválido',
                text: 'La inversión debe ser un número positivo',
                confirmButtonText: 'Entendido'
            }).then(() => {
                inversion.focus();
            });
            return false;
        }

        // Validar número de lotes (entero positivo)
        if (numLotes.value === '' || parseInt(numLotes.value) <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Valor inválido',
                text: 'El número de lotes debe ser un entero positivo',
                confirmButtonText: 'Entendido'
            }).then(() => {
                numLotes.focus();
            });
            return false;
        }

        // Validar número de etapas (entero positivo)
        if (numEtapas.value === '' || parseInt(numEtapas.value) <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Valor inválido',
                text: 'El número de etapas debe ser un entero positivo',
                confirmButtonText: 'Entendido'
            }).then(() => {
                numEtapas.focus();
            });
            return false;
        }

        // Validar foto de referencia
        if (fotoReferencia.files.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Archivo requerido',
                text: 'Debes subir una foto de referencia',
                confirmButtonText: 'Entendido'
            });
            return false;
        }

        return true;
    }

    // Función para abrir modales
    function openModal(modal) {
        modal.style.display = 'block';
        modalBackdrop.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Evitar scroll
    }

    // Función para cerrar modales
    function closeModal(modal) {
        modal.style.display = 'none';
        modalBackdrop.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restaurar scroll
    }

    // Abrir modal Nuevo Proyecto
    if (btnNuevoProyecto) {
        btnNuevoProyecto.addEventListener('click', () => {
            openModal(modalNuevoProyecto);
        });
    }

    // Botón Siguiente: Nuevo Proyecto → Configurar Precios (ÚNICO LISTENER)
    if (btnConfigurarPrecios) {
        btnConfigurarPrecios.addEventListener('click', (e) => {
            e.preventDefault();

            if (validarFormulario()) {
                closeModal(modalNuevoProyecto);
                openModal(modalConfigurarPrecios);
            }
        });
    }

    // Botones de cierre (×)
    document.querySelectorAll('.proy-close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            const modalId = closeBtn.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            closeModal(modal);
        });
    });

    // Botón Cancelar (primer modal)
    const btnCancelar = document.querySelector('[data-modal="proy-modalNuevoProyecto"].proy-btn-secondary');
    if (btnCancelar) {
        btnCancelar.addEventListener('click', () => {
            closeModal(modalNuevoProyecto);
        });
    }

    // Botón Atrás (segundo modal - vuelve al primero)
    const btnAtras = document.querySelector('[data-modal="proy-modalConfigurarPrecios"].proy-btn-secondary');
    if (btnAtras) {
        btnAtras.addEventListener('click', () => {
            closeModal(modalConfigurarPrecios);
            openModal(modalNuevoProyecto);
        });
    }

    // Cerrar al hacer clic en el backdrop
    modalBackdrop.addEventListener('click', () => {
        closeModal(modalNuevoProyecto);
        closeModal(modalConfigurarPrecios);
    });
}