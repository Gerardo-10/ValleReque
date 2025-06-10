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

    // Elementos del segundo modal
    const btnGuardarPrecios = document.getElementById('proy-btnGuardarPrecios');
    const formActualizarPrecios = document.getElementById('proy-formActualizarPrecios');

    // Inputs de precios
    const precioParque = document.getElementById('proy-precioParque');
    const precioEsquinaParque = document.getElementById('proy-precioEsquinaParque');
    const precioEsquina = document.getElementById('proy-precioEsquina');
    const precioAvenida = document.getElementById('proy-precioAvenida');
    const precioCalle = document.getElementById('proy-precioCalle');

    // Elementos de resumen
    const resumenParque = document.getElementById('proy-resumenParque');
    const resumenEsquinaParque = document.getElementById('proy-resumenEsquinaParque');
    const resumenEsquina = document.getElementById('proy-resumenEsquina');
    const resumenAvenida = document.getElementById('proy-resumenAvenida');
    const resumenCalle = document.getElementById('proy-resumenCalle');

    // Función para formatear moneda
    function formatCurrency(value) {
        return `S/ ${parseFloat(value || 0).toFixed(2)}`;
    }

    // Actualizar resumen en tiempo real
    function actualizarResumen() {
        resumenParque.textContent = formatCurrency(precioParque.value);
        resumenEsquinaParque.textContent = formatCurrency(precioEsquinaParque.value);
        resumenEsquina.textContent = formatCurrency(precioEsquina.value);
        resumenAvenida.textContent = formatCurrency(precioAvenida.value);
        resumenCalle.textContent = formatCurrency(precioCalle.value);
    }

    // Event listeners para actualizar resumen
    [precioParque, precioEsquinaParque, precioEsquina, precioAvenida, precioCalle].forEach(input => {
        input.addEventListener('input', () => {
            // Validar que sea número positivo
            if (input.value && (isNaN(input.value) || parseFloat(input.value) < 0)) {
                input.value = '';
            }
            actualizarResumen();
        });
    });

    // Validar formulario de precios
    function validarPrecios() {
        const precios = [
            {input: precioParque, nombre: 'Parque'},
            {input: precioEsquinaParque, nombre: 'Esquina_Parque'},
            {input: precioEsquina, nombre: 'Esquina'},
            {input: precioAvenida, nombre: 'Avenida'},
            {input: precioCalle, nombre: 'Calle'}
        ];

        for (const precio of precios) {
            if (precio.input.value.trim() === '' || isNaN(precio.input.value)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Campo requerido',
                    text: `El precio para ${precio.nombre} no puede estar vacío`,
                    confirmButtonText: 'Entendido'
                }).then(() => {
                    precio.input.focus();
                });
                return false;
            }

            if (parseFloat(precio.input.value) < 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Valor inválido',
                    text: `El precio para ${precio.nombre} debe ser positivo`,
                    confirmButtonText: 'Entendido'
                }).then(() => {
                    precio.input.focus();
                });
                return false;
            }
        }

        return true;
    }

    // Event listener para guardar precios
    if (btnGuardarPrecios) {
        btnGuardarPrecios.addEventListener('click', async (e) => {
            e.preventDefault();

            if (validarPrecios()) {
                try {
                    // Crear FormData con todos los datos
                    const formData = new FormData(document.getElementById('proy-formNuevoProyecto'));

                    // Agregar los precios al FormData
                    formData.append('precioParque', precioParque.value);
                    formData.append('precioEsquinaParque', precioEsquinaParque.value);
                    formData.append('precioEsquina', precioEsquina.value);
                    formData.append('precioAvenida', precioAvenida.value);
                    formData.append('precioCalle', precioCalle.value);

                    // Mostrar loader
                    Swal.fire({
                        title: 'Guardando proyecto',
                        html: 'Por favor espera mientras guardamos la información...',
                        allowOutsideClick: false,
                        didOpen: () => {
                            Swal.showLoading();
                        }
                    });

                    // Enviar datos al servidor
                    const response = await fetch('/insertar_proyecto', {
                        method: 'POST',
                        body: formData
                    });

                    const result = await response.json();

                    if (result.success) {
                        // Ocultar loader
                        Swal.close();

                        // Cerrar modales actuales
                        closeModal(modalConfigurarPrecios);
                        closeModal(modalNuevoProyecto);

                        // Crear y mostrar el primer modal de etapa
                        crearModalesEtapas();

                        // Verificar que hay etapas para mostrar
                        if (modalEtapas.length > 0) {
                            openModal(modalEtapas[0]);
                        } else {
                            Swal.fire({
                                icon: 'success',
                                title: 'Proyecto creado',
                                text: 'El proyecto se ha creado exitosamente',
                                confirmButtonText: 'Aceptar'
                            });
                        }

                        // Guardar el ID del proyecto creado para usarlo luego
                        proyectoId = result.proyectoId;

                    } else {
                        throw new Error(result.message);
                    }
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: error.message || 'Ocurrió un error al guardar el proyecto',
                        confirmButtonText: 'Entendido'
                    });
                }
            }
        });
    }

    // Inicializar resumen al cargar
    actualizarResumen();

    // Variables para control de etapas
    let etapaActual = 1;
    let totalEtapas = 0;
    let modalEtapas = [];

    // Función para crear modales de etapas dinámicamente
    function crearModalesEtapas() {
        lotesDisponiblesGlobal = parseInt(numLotes.value) || 0;

        const numEtapasInput = document.getElementById('proy-numEtapas');
        if (!numEtapasInput) {
            console.error('No se encontró el input de número de etapas');
            return;
        }

        totalEtapas = parseInt(numEtapasInput.value) || 0;
        modalEtapas = [];

        console.log('Buscando template...');
        const modalTemplate = document.getElementById('proy-modalEtapaTemplate');
        if (!modalTemplate) {
            console.error('No se encontró el template del modal de etapas');
            return;
        }
        console.log('Template encontrado:', modalTemplate);

        for (let i = 1; i <= totalEtapas; i++) {
            let newModal = modalTemplate.cloneNode(true);
            newModal.id = `proy-modalEtapa${i}`;
            newModal.classList.remove('proy-template');

            // Configurar número de etapa
            newModal.querySelector('.proy-etapa-num').textContent = numeroRomano(i);

            // Configurar navegación
            configurarBotonesNavegacion(newModal, i);

            // Reemplazar select de manzana por input
            reemplazarSelectManzana(newModal);

            // Configurar primera fila
            const primeraFila = newModal.querySelector('.proy-manzana-row');
            configurarPrimeraFila(primeraFila, newModal);

            // Limpiar resumen inicial
            newModal.querySelector('.proy-resumen-etapa').value = '';

            // Configurar botones de agregar/eliminar manzana
            configurarBotonesManzanas(newModal);

            // --- NEW: Add event listener for the close button (the 'x') ---
            const closeButton = newModal.querySelector('.proy-close');
            if (closeButton) {
                closeButton.addEventListener('click', () => {
                    Swal.fire({
                        title: '¿Deseas cerrar esta ventana?',
                        text: 'Los datos de esta etapa podrían no guardarse si no has finalizado el proyecto.',
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Sí, cerrar',
                        cancelButtonText: 'No, quedarme'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            closeModal(newModal);
                        }
                    });
                });
            }

            document.body.appendChild(newModal);
            modalEtapas.push(newModal);
        }
    }

    // Función para configurar los botones de manzanas
    function configurarBotonesManzanas(modal) {
        const btnAddManzana = modal.querySelector('.proy-btn-add-row-manzana');
        const btnDeleteManzana = modal.querySelector('.proy-btn-delete-row-manzana');

        // Configurar botón Agregar Manzana
        btnAddManzana.addEventListener('click', () => {
            agregarNuevaFila(modal);
            // Mostrar botón Eliminar en las filas adicionales
            const filas = modal.querySelectorAll('.proy-manzana-row');
            if (filas.length > 1) {
                btnDeleteManzana.style.display = 'block';
            }
        });

        // Configurar botón Eliminar Manzana
        btnDeleteManzana.addEventListener('click', function () {
            const filas = modal.querySelectorAll('.proy-manzana-row');
            if (filas.length > 1) {
                filas[filas.length - 1].remove();
                // Ocultar botón Eliminar si solo queda una fila
                if (modal.querySelectorAll('.proy-manzana-row').length === 1) {
                    btnDeleteManzana.style.display = 'none';
                }
                actualizarResumenEtapa(modal);
            }
        });

        // Por defecto, mostrar ambos botones pero Eliminar oculto
        btnAddManzana.style.display = 'block';
        btnDeleteManzana.style.display = 'none';
    }

    // Función para agregar campos de terreno a una fila existente
    function agregarCamposTerreno(fila, modal) {
        // Crear contenedor para tipo de terreno
        const tipoTerrenoDiv = document.createElement('div');
        tipoTerrenoDiv.className = 'proy-form-group terreno-group';

        const tipoTerrenoLabel = document.createElement('label');
        tipoTerrenoLabel.textContent = 'Tipo de Terreno*';

        const tipoTerrenoSelectContainer = document.createElement('div');
        tipoTerrenoSelectContainer.className = 'proy-select-container';

        const tipoTerrenoSelect = document.createElement('select');
        tipoTerrenoSelect.className = 'proy-tipo-terreno';
        tipoTerrenoSelect.innerHTML = `
            <option value="Calle">Calle</option>
            <option value="Avenida">Avenida</option>
            <option value="Esquina">Esquina</option>
            <option value="Parque">Parque</option>
            <option value="Esquina_Parque">Esquina-Parque</option>
        `;

        tipoTerrenoSelectContainer.appendChild(tipoTerrenoSelect);
        tipoTerrenoDiv.appendChild(tipoTerrenoLabel);
        tipoTerrenoDiv.appendChild(tipoTerrenoSelectContainer);

        // Crear contenedor para cantidad
        const cantidadDiv = document.createElement('div');
        cantidadDiv.className = 'proy-form-group terreno-group';

        const cantidadLabel = document.createElement('label');
        cantidadLabel.textContent = 'Cantidad*';

        const cantidadInput = document.createElement('input');
        cantidadInput.type = 'number';
        cantidadInput.className = 'proy-cantidad-terreno';
        cantidadInput.placeholder = '123';
        cantidadInput.min = '1';

        cantidadDiv.appendChild(cantidadLabel);
        cantidadDiv.appendChild(cantidadInput);

        // Insertar antes de los botones de acción
        const actionsDiv = fila.querySelector('.proy-row-actions');
        fila.insertBefore(tipoTerrenoDiv, actionsDiv);
        fila.insertBefore(cantidadDiv, actionsDiv);

        // Configurar eventos para los nuevos campos
        tipoTerrenoSelect.addEventListener('change', () => actualizarResumenEtapa(modal));
        cantidadInput.addEventListener('input', function (e) {
            this.value = this.value.replace(/[^0-9]/g, '');
            if (this.value < 1) this.value = '';
            actualizarResumenEtapa(modal);
        });
    }

    // Función para agregar otro conjunto de campos de terreno
    function agregarConjuntoTerreno(fila, modal) {
        // Clonar los últimos campos de terreno
        const gruposTerreno = fila.querySelectorAll('.terreno-group');
        const ultimoTipo = gruposTerreno[gruposTerreno.length - 2];
        const ultimaCantidad = gruposTerreno[gruposTerreno.length - 1];

        const nuevoTipo = ultimoTipo.cloneNode(true);
        const nuevaCantidad = ultimaCantidad.cloneNode(true);

        // Limpiar valores
        nuevoTipo.querySelector('select').selectedIndex = 0;
        nuevaCantidad.querySelector('input').value = '';

        // Insertar antes de los botones de acción
        const actionsDiv = fila.querySelector('.proy-row-actions');
        fila.insertBefore(nuevoTipo, actionsDiv);
        fila.insertBefore(nuevaCantidad, actionsDiv);

        // Configurar eventos
        nuevoTipo.querySelector('select').addEventListener('change', () => actualizarResumenEtapa(modal));
        nuevaCantidad.querySelector('input').addEventListener('input', function (e) {
            this.value = this.value.replace(/[^0-9]/g, '');
            if (this.value < 1) this.value = '';
            actualizarResumenEtapa(modal);
        });
    }

    // Función para eliminar campos de terreno de una fila
    function eliminarCamposTerreno(fila, modal) {
        const gruposTerreno = fila.querySelectorAll('.terreno-group');
        gruposTerreno.forEach(grupo => grupo.remove());
        actualizarResumenEtapa(modal);
    }

    function eliminarUltimoConjuntoTerreno(fila, modal) {
        const gruposTerreno = fila.querySelectorAll('.terreno-group');
        if (gruposTerreno.length >= 2) {
            gruposTerreno[gruposTerreno.length - 1].remove(); // Cantidad
            gruposTerreno[gruposTerreno.length - 2].remove(); // Tipo
            actualizarResumenEtapa(modal);
        }
    }

    // Modificar la función configurarPrimeraFila para la primera fila
    function configurarPrimeraFila(fila, modal) {
        // No agregar campos de terreno inicialmente

        // Configurar botones de acciones
        const btnAdd = fila.querySelector('.proy-btn-add-row');
        const btnDelete = fila.querySelector('.proy-btn-delete-row');

        btnAdd.style.display = 'block'; // Mostrar botón +
        btnDelete.style.display = 'none'; // Ocultar botón -

        // Configurar botón + para agregar tipo de terreno y cantidad
        btnAdd.addEventListener('click', function () {
            // Verificar si ya tiene campos de terreno
            if (!fila.querySelector('.proy-tipo-terreno')) {
                agregarCamposTerreno(fila, modal);
                btnDelete.style.display = 'block'; // Mostrar botón -
            } else {
                // Si ya tiene campos, agregar otro conjunto
                agregarConjuntoTerreno(fila, modal);
            }
        });

        // Configurar botón - para eliminar los campos de terreno
        btnDelete.addEventListener('click', function () {
            eliminarUltimoConjuntoTerreno(fila, modal);
            // Ocultar botón - si no hay más conjuntos de terreno
            if (!fila.querySelector('.proy-tipo-terreno')) {
                btnDelete.style.display = 'none';
            }
        });

        // Configurar eventos de los inputs básicos
        configurarEventosInputs(fila, modal);

        // Establecer la primera manzana como 'A' y no editable
        const inputManzanaPrimeraFila = fila.querySelector('.proy-input-manzana');
        if (inputManzanaPrimeraFila) {
            inputManzanaPrimeraFila.value = 'A';
            inputManzanaPrimeraFila.readOnly = true; // Asegurarse de que sea readOnly
        }
    }

    // Función para reemplazar select de manzana por input text
    function reemplazarSelectManzana(modal) {
        const selects = modal.querySelectorAll('.proy-select-container');
        selects.forEach(select => {
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'proy-input-manzana';
            input.placeholder = 'A';
            input.readOnly = true;
            select.replaceWith(input);
        });
    }

    // Función para convertir número a romano
    function numeroRomano(num) {
        const romanos = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
        return romanos[num] || num;
    }

    // Variables para control de lotes disponibles
    let lotesDisponiblesGlobal = 0;
    let proyectoId = null;

    // 1. Validación para evitar la letra "e" en inputs de precios
    function prevenirLetraE(event) {
        if (event.key.toLowerCase() === 'e') {
            event.preventDefault();
        }
    }

    // Aplicar a todos los inputs de precios
    [precioParque, precioEsquinaParque, precioEsquina, precioAvenida, precioCalle].forEach(input => {
        input.addEventListener('keydown', prevenirLetraE);
    });

    // 2. Función para manejar el autocompletado de manzanas en orden alfabético
    function obtenerSiguienteLetra(modal) {
        const letrasUsadas = [];
        const filas = modal.querySelectorAll('.proy-manzana-row');

        filas.forEach(fila => {
            const letra = fila.querySelector('.proy-input-manzana').value;
            if (letra && letra.length === 1) {
                letrasUsadas.push(letra.toUpperCase());
            }
        });

        if (letrasUsadas.length === 0) return 'A';

        // Ordenar letras y encontrar la siguiente
        letrasUsadas.sort();
        const ultimaLetra = letrasUsadas[letrasUsadas.length - 1];
        const siguienteCharCode = ultimaLetra.charCodeAt(0) + 1;

        // Si pasa de Z, volver a A
        return siguienteCharCode > 90 ? 'A' : String.fromCharCode(siguienteCharCode);
    }

    // 3. Modificación en la función agregarNuevaFila para autocompletar manzanas
    function agregarNuevaFila(modal) {
        const contenedor = modal.querySelector('.proy-manzanas-container');
        const primeraFila = modal.querySelector('.proy-manzana-row');
        const nuevaFila = primeraFila.cloneNode(true);

        // Autocompletar con siguiente letra
        const inputManzana = nuevaFila.querySelector('.proy-input-manzana');
        inputManzana.value = obtenerSiguienteLetra(modal);
        inputManzana.readOnly = true;

        // Limpiar otros campos
        nuevaFila.querySelector('input[type="number"]').value = '';
        eliminarCamposTerreno(nuevaFila, modal);

        // Configurar botones y eventos (código existente)
        const btnAdd = nuevaFila.querySelector('.proy-btn-add-row');
        const btnDelete = nuevaFila.querySelector('.proy-btn-delete-row');

        btnAdd.style.display = 'block';
        btnDelete.style.display = 'none';

        btnAdd.addEventListener('click', function () {
            if (!nuevaFila.querySelector('.proy-tipo-terreno')) {
                agregarCamposTerreno(nuevaFila, modal);
                btnDelete.style.display = 'block';
            } else {
                agregarConjuntoTerreno(nuevaFila, modal);
            }
        });

        btnDelete.addEventListener('click', function () {
            eliminarUltimoConjuntoTerreno(nuevaFila, modal);
            if (!nuevaFila.querySelector('.proy-tipo-terreno')) {
                btnDelete.style.display = 'none';
            }
        });

        configurarEventosInputs(nuevaFila, modal);
        contenedor.appendChild(nuevaFila);
        actualizarResumenEtapa(modal);
        actualizarLotesDisponibles(modal);
    }

    // 4. Modificación en configurarEventosInputs para validar manzanas únicas
    function configurarEventosInputs(fila, modal) {
        // Input manzana - solo una letra mayúscula y validar única
        fila.querySelector('.proy-input-manzana').addEventListener('input', function (e) {
            this.value = this.value.replace(/[^a-zA-Z]/g, '').toUpperCase().substring(0, 1);
            validarManzanaUnica(this, modal);
            actualizarResumenEtapa(modal);
            actualizarLotesDisponibles(modal);
        });

        // Input lotes - validar números y consistencia
        fila.querySelector('input[type="number"]').addEventListener('input', function (e) {
            this.value = this.value.replace(/[^0-9]/g, '');
            if (this.value < 1) this.value = '';

            // Si no hay campos de terreno, actualizar automáticamente
            if (!fila.querySelector('.proy-tipo-terreno')) {
                actualizarResumenEtapa(modal);
            }

            validarConsistenciaLotes(fila);
            actualizarLotesDisponibles(modal);
        });

        // Resto de eventos (select tipo terreno e input cantidad)
        const selectTipo = fila.querySelector('.proy-tipo-terreno');
        if (selectTipo) {
            selectTipo.addEventListener('change', () => {
                validarConsistenciaLotes(fila);
                actualizarResumenEtapa(modal);
                actualizarLotesDisponibles(modal);
            });
        }

        const inputCantidad = fila.querySelector('.proy-cantidad-terreno');
        if (inputCantidad) {
            inputCantidad.addEventListener('input', function (e) {
                this.value = this.value.replace(/[^0-9]/g, '');
                if (this.value < 1) this.value = '';
                validarConsistenciaLotes(fila);
                actualizarResumenEtapa(modal);
                actualizarLotesDisponibles(modal);
            });
        }
    }

    // 5. Función para validar manzanas únicas
    function validarManzanaUnica(input, modal) {
        const letraActual = input.value;
        if (!letraActual) return;

        const filas = modal.querySelectorAll('.proy-manzana-row');
        let contador = 0;

        filas.forEach(fila => {
            const letra = fila.querySelector('.proy-input-manzana').value;
            if (letra === letraActual) contador++;
        });

        if (contador > 1) {
            Swal.fire({
                icon: 'error',
                title: 'Manzana duplicada',
                text: `La letra ${letraActual} ya está en uso. Por favor usa otra.`,
                confirmButtonText: 'Entendido'
            }).then(() => {
                input.value = obtenerSiguienteLetra(modal);
                input.focus();
            });
        }
    }

    // 6. Función para validar consistencia de lotes
    function validarConsistenciaLotes(fila) {
        const inputLotes = fila.querySelector('input[type="number"]');
        const lotesManzana = parseInt(inputLotes.value) || 0;

        // Si no hay campos de terreno, no hay nada que validar
        if (!fila.querySelector('.proy-tipo-terreno')) return true;

        // Sumar todas las cantidades de terrenos
        let totalTerrenos = 0;
        const inputsCantidad = fila.querySelectorAll('.proy-cantidad-terreno');

        inputsCantidad.forEach(input => {
            totalTerrenos += parseInt(input.value) || 0;
        });

        if (totalTerrenos !== lotesManzana) {
            Swal.fire({
                icon: 'error',
                title: 'Inconsistencia en lotes',
                text: `La suma de terrenos (${totalTerrenos}) no coincide con los lotes de la manzana (${lotesManzana})`,
                confirmButtonText: 'Entendido'
            });
            return false;
        }
        return true;
    }

    // 7. Modificación en actualizarResumenEtapa para manejar caso por defecto
    function actualizarResumenEtapa(modal) {
        const filas = modal.querySelectorAll('.proy-manzana-row');
        let resumen = [];
        let totalLotesEtapa = 0;

        filas.forEach(fila => {
            const manzana = fila.querySelector('.proy-input-manzana').value || 'A';
            const lotes = parseInt(fila.querySelector('input[type="number"]').value) || 0;
            totalLotesEtapa += lotes;

            let detallesTerrenos = [];
            const tiposTerreno = fila.querySelectorAll('.proy-tipo-terreno');
            const cantidades = fila.querySelectorAll('.proy-cantidad-terreno');

            // Caso por defecto: si no hay campos de terreno, usar "Calle" con todos los lotes
            if (tiposTerreno.length === 0) {
                detallesTerrenos.push(`Calle: ${lotes}`);
            } else {
                // Caso con campos de terreno definidos
                for (let i = 0; i < tiposTerreno.length; i++) {
                    const tipo = tiposTerreno[i]?.value || 'Calle';
                    const cantidad = cantidades[i]?.value || '0';
                    if (tipo && cantidad) detallesTerrenos.push(`${tipo}: ${cantidad}`);
                }
            }

            resumen.push(`Manzana ${manzana}: ${lotes} lotes | ${detallesTerrenos.join(', ')}`);
        });

        modal.querySelector('.proy-resumen-etapa').value = resumen.join('\n');
        return totalLotesEtapa;
    }

    // 8. Función para actualizar el contador de lotes disponibles
    function actualizarLotesDisponibles(modal) {
        if (!modal) return;

        // Calcular lotes asignados en TODAS las etapas
        let totalLotesAsignados = 0;
        modalEtapas.forEach(m => {
            const filas = m.querySelectorAll('.proy-manzana-row');
            filas.forEach(fila => {
                totalLotesAsignados += parseInt(fila.querySelector('input[type="number"]').value) || 0;
            });
        });

        const totalLotesProyecto = parseInt(numLotes.value) || 0;
        lotesDisponiblesGlobal = totalLotesProyecto - totalLotesAsignados;

        // Actualizar en TODOS los modales
        modalEtapas.forEach(m => {
            let contador = m.querySelector('.proy-lotes-disponibles');
            if (!contador) {
                contador = document.createElement('div');
                contador.className = 'proy-lotes-disponibles';
                // ... (estilos igual que antes)
                const buttonsContainer = m.querySelector('.proy-manzanas-container .d-flex.justify-content-end');
                if (buttonsContainer) {
                    buttonsContainer.parentNode.insertBefore(contador, buttonsContainer.nextSibling);
                }
            }

            contador.innerHTML = `Lotes disponibles: <span style="color: ${lotesDisponiblesGlobal < 0 ? 'red' : 'green'}">${lotesDisponiblesGlobal}</span> / ${totalLotesProyecto}`;
        });

        return lotesDisponiblesGlobal;
    }

    // 9. Modificación en configurarBotonesNavegacion para validar antes de avanzar
    function configurarBotonesNavegacion(modal, index) {
        const btnAnterior = modal.querySelector('.proy-btn-anterior');
        const btnSiguiente = modal.querySelector('.proy-btn-siguiente');

        if (index === 1) {
            btnAnterior.textContent = 'Cancelar';
            btnAnterior.addEventListener('click', () => {
                // Replace native confirm with SweetAlert
                Swal.fire({
                    title: '¿Cancelar la creación del proyecto?',
                    text: 'Los datos no guardados se perderán.',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Sí, cancelar',
                    cancelButtonText: 'No, continuar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        closeModal(modal);
                        closeModal(modalConfigurarPrecios); // Assuming this is defined elsewhere
                        openModal(modalNuevoProyecto); // Assuming this is defined elsewhere
                    }
                });
            });
        } else {
            btnAnterior.addEventListener('click', () => {
                closeModal(modal);
                openModal(modalEtapas[index - 2]);
            });
        }

        if (index === totalEtapas) {
            btnSiguiente.textContent = 'Guardar';
            btnSiguiente.addEventListener('click', () => guardarEtapas(true)); // Guardar final
        } else {
            btnSiguiente.addEventListener('click', () => {
                if (validarEtapaCompleta(modal)) {
                    closeModal(modal);
                    openModal(modalEtapas[index]);
                }
            });
        }
    }

    // 10. Función para validar etapa completa antes de avanzar
    function validarEtapaCompleta(modal) {
        // Validar que todas las manzanas estén completas
        const filas = modal.querySelectorAll('.proy-manzana-row');
        let totalLotesEtapa = 0;

        for (const fila of filas) {
            const manzana = fila.querySelector('.proy-input-manzana').value;
            const lotes = parseInt(fila.querySelector('input[type="number"]').value) || 0;

            if (!manzana) {
                Swal.fire({
                    icon: 'error',
                    title: 'Manzana incompleta',
                    text: 'Todas las manzanas deben tener una letra asignada',
                    confirmButtonText: 'Entendido'
                });
                return false;
            }

            if (lotes <= 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lotes inválidos',
                    text: 'Cada manzana debe tener al menos un lote',
                    confirmButtonText: 'Entendido'
                });
                return false;
            }

            // Validar consistencia entre lotes y terrenos
            if (!validarConsistenciaLotes(fila)) {
                return false;
            }

            totalLotesEtapa += lotes;
        }

        // Validar que no se excedan los lotes disponibles
        const lotesRestantes = actualizarLotesDisponibles(modal);
        if (lotesRestantes < 0) {
            Swal.fire({
                icon: 'error',
                title: 'Lotes excedidos',
                text: `Has asignado ${-lotesRestantes} lotes más de los disponibles`,
                confirmButtonText: 'Entendido'
            });
            return false;
        }

        return true;
    }

    // 11. Modificación de guardarEtapas para permitir guardado parcial
    function guardarEtapas(completo = false) {
        if (!validarEtapaCompleta(modalEtapas[modalEtapas.length - 1])) {
            return;
        }

        const etapasData = [];
        let totalLotesAsignados = 0;

        modalEtapas.forEach((modal, index) => {
            const filas = modal.querySelectorAll('.proy-manzana-row');
            const etapa = {
                numero: index + 1,
                manzanas: []
            };

            filas.forEach(fila => {
                const manzana = fila.querySelector('.proy-input-manzana').value;
                const lotes = parseInt(fila.querySelector('input[type="number"]').value) || 0;
                totalLotesAsignados += lotes;

                const manzanaData = {
                    letra: manzana,
                    lotes: lotes,
                    terrenos: []
                };

                // Caso por defecto: si no hay campos de terreno
                const tiposTerreno = fila.querySelectorAll('.proy-tipo-terreno');
                if (tiposTerreno.length === 0) {
                    manzanaData.terrenos.push({
                        tipo: 'Calle',
                        cantidad: lotes
                    });
                } else {
                    // Caso con campos de terreno definidos
                    const cantidades = fila.querySelectorAll('.proy-cantidad-terreno');
                    for (let i = 0; i < tiposTerreno.length; i++) {
                        manzanaData.terrenos.push({
                            tipo: tiposTerreno[i].value,
                            cantidad: parseInt(cantidades[i].value) || 0
                        });
                    }
                }

                etapa.manzanas.push(manzanaData);
            });

            etapasData.push(etapa);
        });

        // Validar consistencia total de lotes
        const totalLotesProyecto = parseInt(numLotes.value) || 0;
        if (totalLotesAsignados !== totalLotesProyecto && completo) {
            Swal.fire({
                icon: 'error',
                title: 'Error en lotes',
                text: `La suma total de lotes (${totalLotesAsignados}) no coincide con el proyecto (${totalLotesProyecto})`,
                confirmButtonText: 'Entendido'
            });
            return;
        }

        // Mostrar confirmación diferente para guardado parcial/completo
        const confirmText = completo ?
            '¿Guardar todas las etapas y finalizar el proyecto?' :
            '¿Guardar el progreso actual? Podrás continuar más tarde.';

        Swal.fire({
            title: 'Confirmar',
            text: confirmText,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                enviarDatosEtapas(etapasData, completo);
            }
        });
    }

    // 12. Función para enviar datos al servidor (guardado parcial/completo)
    async function enviarDatosEtapas(etapasData, completo) {
        try {
            Swal.fire({
                title: 'Guardando...',
                html: 'Por favor espera mientras guardamos los datos',
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });

            const formData = new FormData();
            formData.append('proyectoId', proyectoId);
            formData.append('etapas', JSON.stringify(etapasData));
            formData.append('completo', completo);

            const response = await fetch('/guardar_etapas', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': document.querySelector('input[name="csrf_token"]').value
                }
            });

            const result = await response.json();

            if (result.success) {
                Swal.fire({
                    icon: 'success',
                    title: completo ? '¡Proyecto completado!' : 'Progreso guardado',
                    text: result.message,
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    if (completo) {
                        // Cerrar todos los modales y recargar
                        modalEtapas.forEach(modal => closeModal(modal));
                        closeModal(modalConfigurarPrecios);
                        closeModal(modalNuevoProyecto);
                        window.location.reload();
                    }
                });
            } else {
                throw new Error(result.message || 'Error al guardar');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message,
                confirmButtonText: 'Entendido'
            });
        }
    }
}