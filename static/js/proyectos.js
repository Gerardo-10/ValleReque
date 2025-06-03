window.initProyectosModals = function () {
    // Modal functionality
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const modalBackdrop = document.getElementById('modalBackdrop');
    const btnNuevoProyecto = document.getElementById('btnNuevoProyecto');
    const btnSiguienteEtapa = document.getElementById('btnSiguienteEtapa');
    const btnEditarProyectos = document.querySelectorAll('.btn-editar');
    const btnEliminarProyectos = document.querySelectorAll('.btn-eliminar');
    const numEtapasInput = document.getElementById('numEtapas');

    // Variables para gestionar las etapas
    let etapasCreadas = [];
    let etapaActual = 0;
    let totalEtapas = 0;

    // Open modal function
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            modalBackdrop.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    // Close modal function
    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';

            // Check if any other modals are open
            const openModals = document.querySelectorAll('.modal[style="display: block;"]');
            if (openModals.length === 0) {
                modalBackdrop.style.display = 'none';
                document.body.style.overflow = '';
            }
        }
    }

    // Close all modals
    function closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (!modal.classList.contains('template')) {
                modal.style.display = 'none';
            }
        });
        modalBackdrop.style.display = 'none';
        document.body.style.overflow = '';
    }

    // Add event listeners for modal triggers
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function () {
            const modalId = this.getAttribute('data-modal');
            closeModal(modalId);
        });
    });

    // Close modal when clicking outside
    modalBackdrop.addEventListener('click', function () {
        closeAllModals();
    });

    // Prevent modal content clicks from closing the modal
    const modalContents = document.querySelectorAll('.modal-content');
    modalContents.forEach(content => {
        content.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    });

    // Crear modales de etapas dinámicamente según el número ingresado
    function crearModalesEtapas(numEtapas) {
        // Limpiar etapas anteriores
        etapasCreadas.forEach(etapaId => {
            const modalEtapa = document.getElementById(etapaId);
            if (modalEtapa) {
                modalEtapa.remove();
            }
        });

        etapasCreadas = [];
        totalEtapas = numEtapas;

        // Crear nuevos modales de etapas
        for (let i = 1; i <= numEtapas; i++) {
            const etapaId = `modalEtapa${i}`;
            const template = document.getElementById('modalEtapaTemplate');
            const clon = template.cloneNode(true);

            clon.id = etapaId;
            clon.classList.remove('template');

            // Actualizar número de etapa
            const etapaNumElement = clon.querySelector('.etapa-num');
            if (etapaNumElement) {
                etapaNumElement.textContent = toRomanNumeral(i);
            }

            // Configurar botones
            const btnAnterior = clon.querySelector('.btn-anterior');
            const btnSiguiente = clon.querySelector('.btn-siguiente');

            if (i === 1) {
                // Primera etapa: botón anterior vuelve al formulario principal
                btnAnterior.addEventListener('click', function () {
                    closeModal(etapaId);
                    openModal('modalNuevoProyecto');
                });
            } else {
                // Etapas intermedias: botón anterior va a la etapa previa
                btnAnterior.addEventListener('click', function () {
                    closeModal(etapaId);
                    openModal(`modalEtapa${i - 1}`);
                });
            }

            if (i === numEtapas) {
                // Última etapa: botón siguiente guarda el proyecto
                btnSiguiente.textContent = 'Guardar';
                btnSiguiente.addEventListener('click', function () {
                    closeModal(etapaId);
                    openModal('modalExito');

                    // Auto close success message after 3 seconds
                    setTimeout(function () {
                        closeModal('modalExito');
                    }, 3000);
                });
            } else {
                // Etapas intermedias: botón siguiente va a la siguiente etapa
                btnSiguiente.addEventListener('click', function () {
                    closeModal(etapaId);
                    openModal(`modalEtapa${i + 1}`);
                });
            }

            // Configurar cierre del modal
            const closeBtn = clon.querySelector('.close');
            closeBtn.setAttribute('data-modal', etapaId);
            closeBtn.addEventListener('click', function () {
                closeModal(etapaId);
            });

            // Agregar funcionalidad para agregar/eliminar filas de manzanas
            setupManzanaRows(clon);

            // Agregar el modal al body
            document.body.appendChild(clon);
            etapasCreadas.push(etapaId);
        }
    }

    // Configurar funcionalidad para agregar/eliminar filas de manzanas
    function setupManzanaRows(modal) {
        const container = modal.querySelector('.manzanas-container');

        // Delegación de eventos para botones de agregar/eliminar
        container.addEventListener('click', function (e) {
            // Agregar fila
            if (e.target.classList.contains('btn-add-row') || e.target.parentElement.classList.contains('btn-add-row')) {
                const button = e.target.classList.contains('btn-add-row') ? e.target : e.target.parentElement;
                const row = button.closest('.manzana-row');
                const newRow = row.cloneNode(true);

                // Limpiar valores
                const inputs = newRow.querySelectorAll('input');
                inputs.forEach(input => {
                    input.value = '';
                });

                // Cambiar letra de manzana
                const select = newRow.querySelector('select');
                if (select) {
                    const options = select.querySelectorAll('option');
                    const currentValue = select.value;
                    let nextSelected = false;

                    options.forEach(option => {
                        option.selected = false;
                        if (nextSelected) {
                            option.selected = true;
                            nextSelected = false;
                        }
                        if (option.value === currentValue) {
                            nextSelected = true;
                        }
                    });

                    // Si llegamos al final, seleccionar la primera opción
                    if (nextSelected) {
                        options[0].selected = true;
                    }
                }

                container.appendChild(newRow);
                actualizarResumen(modal);
            }

            // Eliminar fila
            if (e.target.classList.contains('btn-delete-row') || e.target.parentElement.classList.contains('btn-delete-row')) {
                const button = e.target.classList.contains('btn-delete-row') ? e.target : e.target.parentElement;
                const row = button.closest('.manzana-row');

                // Solo eliminar si hay más de una fila
                if (container.querySelectorAll('.manzana-row').length > 1) {
                    container.removeChild(row);
                    actualizarResumen(modal);
                }
            }
        });

        // Actualizar resumen cuando cambian los valores
        container.addEventListener('change', function (e) {
            if (e.target.tagName === 'SELECT' || e.target.tagName === 'INPUT') {
                actualizarResumen(modal);
            }
        });
    }

    // Actualizar el resumen de manzanas y lotes
    function actualizarResumen(modal) {
        const rows = modal.querySelectorAll('.manzana-row');
        const resumenTextarea = modal.querySelector('.resumen-etapa');
        let resumenText = '';

        rows.forEach((row, index) => {
            const manzana = row.querySelector('select').value;
            const lotes = row.querySelector('input').value || '0';

            resumenText += `Manzana: ${manzana} - N° de Lotes: ${lotes}`;

            // Agregar separador si no es la última fila
            if (index % 2 === 0 && index < rows.length - 1) {
                resumenText += ' | ';
            } else if (index < rows.length - 1) {
                resumenText += '\n';
            }
        });

        resumenTextarea.value = resumenText;
    }

    // Convertir número a numeral romano
    function toRomanNumeral(num) {
        const romanNumerals = {
            1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V',
            6: 'VI', 7: 'VII', 8: 'VIII', 9: 'IX', 10: 'X'
        };
        return romanNumerals[num] || num.toString();
    }

    // Button event listeners
    btnNuevoProyecto.addEventListener('click', function () {
        openModal('modalNuevoProyecto');
    });

    btnSiguienteEtapa.addEventListener('click', function () {
        // Obtener el número de etapas
        const numEtapas = parseInt(numEtapasInput.value) || 2;

        // Crear modales de etapas
        crearModalesEtapas(numEtapas);

        // Cerrar modal actual y abrir primera etapa
        closeModal('modalNuevoProyecto');
        openModal('modalEtapa1');
    });

    btnEditarProyectos.forEach(button => {
        button.addEventListener('click', function () {
            openModal('modalEditarProyecto');
        });
    });

    btnEliminarProyectos.forEach(button => {
        button.addEventListener('click', function () {
            openModal('modalConfirmarEliminar');
        });
    });

    // Confirmar eliminación
    const btnConfirmarEliminar = document.getElementById('btnConfirmarEliminar');
    if (btnConfirmarEliminar) {
        btnConfirmarEliminar.addEventListener('click', function () {
            closeModal('modalConfirmarEliminar');
            openModal('modalEliminadoExito');

            // Auto close success message after 3 seconds
            setTimeout(function () {
                closeModal('modalEliminadoExito');
            }, 3000);
        });
    }

    // Guardar edición
    const btnGuardarEdicion = document.getElementById('btnGuardarEdicion');
    if (btnGuardarEdicion) {
        btnGuardarEdicion.addEventListener('click', function () {
            closeModal('modalEditarProyecto');
            openModal('modalExito');

            // Auto close success message after 3 seconds
            setTimeout(function () {
                closeModal('modalExito');
            }, 3000);
        });
    }

    // Simulate form submission
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            console.log('Form submitted:', this.id);
        });
    });
}