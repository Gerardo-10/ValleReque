window.initProyectosModals = function () {
    console.log('Inicializando modales de proyectos...');

    // Limpiar event listeners anteriores para evitar duplicados
    const existingListeners = document.querySelectorAll('[data-proy-listener-added]');
    existingListeners.forEach(el => {
        el.removeAttribute('data-proy-listener-added');
    });

    // Variables para gestionar las etapas
    let etapasCreadas = [];
    let etapaActual = 0;
    let totalEtapas = 0;

    // Elementos del DOM
    const modalBackdrop = document.getElementById('proy-modalBackdrop');
    const btnNuevoProyecto = document.getElementById('proy-btnNuevoProyecto');
    const btnSiguienteEtapa = document.getElementById('proy-btnSiguienteEtapa');
    const numEtapasInput = document.getElementById('proy-numEtapas');
    const btnEditarProyectos = document.querySelectorAll('.proy-btn-editar');
    const btnEliminarProyectos = document.querySelectorAll('.proy-btn-eliminar');

    // Verificar que los elementos existen
    if (!modalBackdrop) {
        console.error('Modal backdrop no encontrado');
        return;
    }

    // Función para abrir modal
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            modalBackdrop.style.display = 'block';
            document.body.style.overflow = 'hidden';
            console.log(`Modal ${modalId} abierto`);
        } else {
            console.error(`Modal ${modalId} no encontrado`);
        }
    }

    // Función para cerrar modal
    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';

            // Verificar si hay otros modales abiertos
            const openModals = document.querySelectorAll('.proy-modal[style*="display: block"]');
            if (openModals.length === 0) {
                modalBackdrop.style.display = 'none';
                document.body.style.overflow = '';
            }
            console.log(`Modal ${modalId} cerrado`);
        }
    }

    // Función para cerrar todos los modales
    function closeAllModals() {
        const modals = document.querySelectorAll('.proy-modal');
        modals.forEach(modal => {
            if (!modal.classList.contains('proy-template')) {
                modal.style.display = 'none';
            }
        });
        modalBackdrop.style.display = 'none';
        document.body.style.overflow = '';
        console.log('Todos los modales cerrados');
    }

    // Event listeners para botones de cerrar modal (X)
    const closeButtons = document.querySelectorAll('.proy-close[data-modal]');
    closeButtons.forEach(button => {
        if (!button.hasAttribute('data-proy-listener-added')) {
            button.addEventListener('click', function () {
                const modalId = this.getAttribute('data-modal');
                closeModal(modalId);
            });
            button.setAttribute('data-proy-listener-added', 'true');
        }
    });

    // Event listeners para botones de cancelar
    const cancelButtons = document.querySelectorAll('.proy-btn-secondary[data-modal]');
    cancelButtons.forEach(button => {
        if (!button.hasAttribute('data-proy-listener-added')) {
            button.addEventListener('click', function () {
                const modalId = this.getAttribute('data-modal');
                closeModal(modalId);
            });
            button.setAttribute('data-proy-listener-added', 'true');
        }
    });

    // Event listener para cerrar modal al hacer clic en el backdrop
    if (!modalBackdrop.hasAttribute('data-proy-listener-added')) {
        modalBackdrop.addEventListener('click', function () {
            closeAllModals();
        });
        modalBackdrop.setAttribute('data-proy-listener-added', 'true');
    }

    // Prevenir que el contenido del modal cierre el modal
    const modalContents = document.querySelectorAll('.proy-modal-content');
    modalContents.forEach(content => {
        if (!content.hasAttribute('data-proy-listener-added')) {
            content.addEventListener('click', function (e) {
                e.stopPropagation();
            });
            content.setAttribute('data-proy-listener-added', 'true');
        }
    });

    // Función para crear modales de etapas dinámicamente
    function crearModalesEtapas(numEtapas) {
        console.log(`Creando ${numEtapas} modales de etapas`);

        // Limpiar etapas anteriores
        etapasCreadas.forEach(etapaId => {
            const modalEtapa = document.getElementById(etapaId);
            if (modalEtapa && !modalEtapa.classList.contains('proy-template')) {
                modalEtapa.remove();
            }
        });

        etapasCreadas = [];
        totalEtapas = numEtapas;

        // Crear nuevos modales de etapas
        for (let i = 1; i <= numEtapas; i++) {
            const etapaId = `proy-modalEtapa${i}`;
            const template = document.getElementById('proy-modalEtapaTemplate');

            if (!template) {
                console.error('Template de etapa no encontrado');
                return;
            }

            const clon = template.cloneNode(true);
            clon.id = etapaId;
            clon.classList.remove('proy-template');

            // Actualizar número de etapa
            const etapaNumElement = clon.querySelector('.proy-etapa-num');
            if (etapaNumElement) {
                etapaNumElement.textContent = toRomanNumeral(i);
            }

            // Configurar botones
            const btnAnterior = clon.querySelector('.proy-btn-anterior');
            const btnSiguiente = clon.querySelector('.proy-btn-siguiente');

            if (btnAnterior) {
                if (i === 1) {
                    btnAnterior.addEventListener('click', function () {
                        closeModal(etapaId);
                        openModal('proy-modalNuevoProyecto');
                    });
                } else {
                    btnAnterior.addEventListener('click', function () {
                        closeModal(etapaId);
                        openModal(`proy-modalEtapa${i - 1}`);
                    });
                }
            }

            if (btnSiguiente) {
                if (i === numEtapas) {
                    btnSiguiente.textContent = 'Guardar';
                    btnSiguiente.addEventListener('click', function () {
                        // Validar formulario antes de guardar
                        if (validarFormularioEtapa(clon)) {
                            closeModal(etapaId);
                            openModal('proy-modalExito');

                            // Auto cerrar mensaje de éxito después de 3 segundos
                            setTimeout(function () {
                                closeModal('proy-modalExito');
                            }, 3000);
                        }
                    });
                } else {
                    btnSiguiente.addEventListener('click', function () {
                        if (validarFormularioEtapa(clon)) {
                            closeModal(etapaId);
                            openModal(`proy-modalEtapa${i + 1}`);
                        }
                    });
                }
            }

            // Configurar cierre del modal
            const closeBtn = clon.querySelector('.proy-close');
            if (closeBtn) {
                closeBtn.setAttribute('data-modal', etapaId);
                closeBtn.addEventListener('click', function () {
                    closeModal(etapaId);
                });
            }

            // Agregar funcionalidad para manzanas
            setupManzanaRows(clon);

            // Agregar el modal al body
            document.body.appendChild(clon);
            etapasCreadas.push(etapaId);
        }
    }

    // Función para validar formulario de etapa
    function validarFormularioEtapa(modal) {
        const rows = modal.querySelectorAll('.proy-manzana-row');
        let totalLotes = 0;
        let valid = true;

        rows.forEach(row => {
            const manzanaSelect = row.querySelector('select');
            const lotesInput = row.querySelector('input[type="number"]');

            if (!manzanaSelect.value || !lotesInput.value || parseInt(lotesInput.value) <= 0) {
                valid = false;
                lotesInput.style.borderColor = '#ec4332';
            } else {
                lotesInput.style.borderColor = '';
                totalLotes += parseInt(lotesInput.value);
            }
        });

        if (!valid) {
            alert('Error de validación: Por favor, complete todos los campos correctamente.');
        }

        return valid;
    }

    // Configurar funcionalidad para manzanas
    function setupManzanaRows(modal) {
        const container = modal.querySelector('.proy-manzanas-container');
        if (!container) return;

        // Delegación de eventos para botones
        container.addEventListener('click', function (e) {
            // Agregar fila
            if (e.target.classList.contains('proy-btn-add-row') || e.target.parentElement.classList.contains('proy-btn-add-row')) {
                const button = e.target.classList.contains('proy-btn-add-row') ? e.target : e.target.parentElement;
                const row = button.closest('.proy-manzana-row');
                const newRow = row.cloneNode(true);

                // Limpiar valores
                const inputs = newRow.querySelectorAll('input');
                inputs.forEach(input => {
                    input.value = '';
                    input.style.borderColor = '';
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
            if (e.target.classList.contains('proy-btn-delete-row') || e.target.parentElement.classList.contains('proy-btn-delete-row')) {
                const button = e.target.classList.contains('proy-btn-delete-row') ? e.target : e.target.parentElement;
                const row = button.closest('.proy-manzana-row');

                // Solo eliminar si hay más de una fila
                if (container.querySelectorAll('.proy-manzana-row').length > 1) {
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

        // Inicializar resumen
        actualizarResumen(modal);
    }

    // Actualizar resumen de manzanas y lotes
    function actualizarResumen(modal) {
        const rows = modal.querySelectorAll('.proy-manzana-row');
        const resumenTextarea = modal.querySelector('.proy-resumen-etapa');
        if (!resumenTextarea) return;

        let resumenText = '';
        let totalLotes = 0;

        rows.forEach((row, index) => {
            const manzana = row.querySelector('select').value;
            const lotes = parseInt(row.querySelector('input').value) || 0;
            totalLotes += lotes;

            resumenText += `Manzana: ${manzana} - N° de Lotes: ${lotes}`;

            if (index < rows.length - 1) {
                resumenText += ' | ';
            }
        });

        resumenText += `\nTotal de lotes en esta etapa: ${totalLotes}`;
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

    // Event listeners principales
    if (btnNuevoProyecto && !btnNuevoProyecto.hasAttribute('data-proy-listener-added')) {
        btnNuevoProyecto.addEventListener('click', function () {
            openModal('proy-modalNuevoProyecto');
        });
        btnNuevoProyecto.setAttribute('data-proy-listener-added', 'true');
    }

    if (btnSiguienteEtapa && !btnSiguienteEtapa.hasAttribute('data-proy-listener-added')) {
        btnSiguienteEtapa.addEventListener('click', function () {
            // Validar formulario principal
            const form = document.getElementById('proy-formNuevoProyecto');
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            const numEtapas = parseInt(numEtapasInput.value) || 1;

            if (numEtapas < 1 || numEtapas > 10) {
                alert('Error: El número de etapas debe estar entre 1 y 10.');
                return;
            }

            crearModalesEtapas(numEtapas);
            closeModal('proy-modalNuevoProyecto');
            openModal('proy-modalEtapa1');
        });
        btnSiguienteEtapa.setAttribute('data-proy-listener-added', 'true');
    }

    // Event listeners para botones de editar y eliminar
    if (btnEditarProyectos) {
        btnEditarProyectos.forEach(button => {
            if (!button.hasAttribute('data-proy-listener-added')) {
                button.addEventListener('click', function () {
                    const projectId = this.getAttribute('data-project-id');
                    console.log(`Editando proyecto ${projectId}`);
                    openModal('proy-modalEditarProyecto');
                });
                button.setAttribute('data-proy-listener-added', 'true');
            }
        });
    }

    if (btnEliminarProyectos) {
        btnEliminarProyectos.forEach(button => {
            if (!button.hasAttribute('data-proy-listener-added')) {
                button.addEventListener('click', function () {
                    const projectId = this.getAttribute('data-project-id');
                    console.log(`Eliminando proyecto ${projectId}`);
                    openModal('proy-modalConfirmarEliminar');
                });
                button.setAttribute('data-proy-listener-added', 'true');
            }
        });
    }

    // Confirmar eliminación
    const btnConfirmarEliminar = document.getElementById('proy-btnConfirmarEliminar');
    if (btnConfirmarEliminar && !btnConfirmarEliminar.hasAttribute('data-proy-listener-added')) {
        btnConfirmarEliminar.addEventListener('click', function () {
            closeModal('proy-modalConfirmarEliminar');
            openModal('proy-modalEliminadoExito');

            setTimeout(function () {
                closeModal('proy-modalEliminadoExito');
            }, 3000);
        });
        btnConfirmarEliminar.setAttribute('data-proy-listener-added', 'true');
    }

    // Guardar edición
    const btnGuardarEdicion = document.getElementById('proy-btnGuardarEdicion');
    if (btnGuardarEdicion && !btnGuardarEdicion.hasAttribute('data-proy-listener-added')) {
        btnGuardarEdicion.addEventListener('click', function () {
            const form = document.getElementById('proy-formEditarProyecto');
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            closeModal('proy-modalEditarProyecto');
            openModal('proy-modalExito');

            setTimeout(function () {
                closeModal('proy-modalExito');
            }, 3000);
        });
        btnGuardarEdicion.setAttribute('data-proy-listener-added', 'true');
    }

    // Prevenir envío de formularios
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        if (!form.hasAttribute('data-proy-listener-added')) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                console.log('Form submitted:', this.id);
            });
            form.setAttribute('data-proy-listener-added', 'true');
        }
    });

    // Funcionalidad de búsqueda
    const searchInput = document.querySelector('.proy-search-input');
    if (searchInput && !searchInput.hasAttribute('data-proy-listener-added')) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const projectCards = document.querySelectorAll('.proy-card');

            projectCards.forEach(card => {
                const projectTitle = card.querySelector('.proy-card-title').textContent.toLowerCase();
                const projectDetails = card.querySelector('.proy-details').textContent.toLowerCase();

                if (projectTitle.includes(searchTerm) || projectDetails.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
        searchInput.setAttribute('data-proy-listener-added', 'true');
    }

    // Agregar event listener para botones de cancelar que no tienen data-modal
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('proy-btn-secondary') && !e.target.hasAttribute('data-modal')) {
            const modal = e.target.closest('.proy-modal');
            if (modal && modal.id) {
                closeModal(modal.id);
            }
        }
    });

    console.log('Modales de proyectos inicializados correctamente');
};

// Auto-inicializar si el DOM ya está cargado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        if (typeof window.initProyectosModals === 'function') {
            window.initProyectosModals();
        }
    });
} else {
    // DOM ya está cargado
    if (typeof window.initProyectosModals === 'function') {
        window.initProyectosModals();
    }
}
