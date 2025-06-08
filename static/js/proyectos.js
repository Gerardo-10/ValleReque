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
            {input: precioEsquinaParque, nombre: 'Esquina-Parque'},
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
                        const proyectoId = result.proyectoId || null;
                        if (proyectoId) {
                            // Puedes almacenar este ID para usarlo en los siguientes pasos
                            sessionStorage.setItem('proyectoActual', proyectoId);
                        }

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
        const numEtapasInput = document.getElementById('proy-numEtapas');
        if (!numEtapasInput) return;

        totalEtapas = parseInt(numEtapasInput.value) || 0;
        modalEtapas = [];

        const modalTemplate = document.getElementById('proy-modalEtapaTemplate');
        if (!modalTemplate) return;

        for (let i = 1; i <= totalEtapas; i++) {
            const modalTemplate = document.getElementById('proy-modalEtapaTemplate');
            const newModal = modalTemplate.cloneNode(true);
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

            document.body.appendChild(newModal);
            modalEtapas.push(newModal);
        }
    }

    // Función para configurar la primera fila
    function configurarPrimeraFila(fila, modal) {
        // Agregar campos de tipo de terreno
        agregarCampoTipoTerreno(fila, modal);

        // Configurar botón +
        const btnAdd = fila.querySelector('.proy-btn-add-row');
        btnAdd.addEventListener('click', () => {
            agregarNuevaFila(modal);
        });

        // Ocultar botón - en primera fila
        fila.querySelector('.proy-btn-delete-row').style.display = 'none';

        // Configurar eventos de los inputs
        configurarEventosInputs(fila, modal);
    }

    // Función para agregar una nueva fila
    function agregarNuevaFila(modal) {
        const contenedor = modal.querySelector('.proy-manzanas-container');
        const primeraFila = modal.querySelector('.proy-manzana-row');
        const nuevaFila = primeraFila.cloneNode(true);

        // Limpiar campos
        nuevaFila.querySelector('.proy-input-manzana').value = '';
        nuevaFila.querySelector('input[type="number"]').value = '';
        nuevaFila.querySelector('.proy-tipo-terreno').selectedIndex = 0;
        nuevaFila.querySelector('.proy-cantidad-terreno').value = '';

        // Configurar botones
        const btnAdd = nuevaFila.querySelector('.proy-btn-add-row');
        const btnDelete = nuevaFila.querySelector('.proy-btn-delete-row');

        btnAdd.style.display = 'none'; // Ocultar botón + en nuevas filas
        btnDelete.style.display = 'block'; // Mostrar botón -

        btnDelete.addEventListener('click', function () {
            if (modal.querySelectorAll('.proy-manzana-row').length > 1) {
                this.closest('.proy-manzana-row').remove();
                actualizarResumenEtapa(modal);
            }
        });

        // Configurar eventos de inputs
        configurarEventosInputs(nuevaFila, modal);

        // Agregar al contenedor
        contenedor.appendChild(nuevaFila);
        actualizarResumenEtapa(modal);
    }

    // Función para configurar eventos de inputs
    function configurarEventosInputs(fila, modal) {
        // Input manzana
        fila.querySelector('.proy-input-manzana').addEventListener('input', function (e) {
            this.value = this.value.replace(/[^a-zA-Z]/g, '').toUpperCase();
            actualizarResumenEtapa(modal);
        });

        // Input lotes
        fila.querySelector('input[type="number"]').addEventListener('input', function (e) {
            this.value = this.value.replace(/[^0-9]/g, '');
            if (this.value < 1) this.value = '';
            actualizarResumenEtapa(modal);
        });

        // Select tipo terreno
        const selectTipo = fila.querySelector('.proy-tipo-terreno');
        if (selectTipo) {
            selectTipo.addEventListener('change', () => {
                actualizarResumenEtapa(modal);
            });
        }

        // Input cantidad terreno
        const inputCantidad = fila.querySelector('.proy-cantidad-terreno');
        if (inputCantidad) {
            inputCantidad.addEventListener('input', function (e) {
                this.value = this.value.replace(/[^0-9]/g, '');
                if (this.value < 1) this.value = '';
                actualizarResumenEtapa(modal);
            });
        }
    }

    // Función para configurar los botones de navegación
    function configurarBotonesNavegacion(modal, index) {
        const btnAnterior = modal.querySelector('.proy-btn-anterior');
        const btnSiguiente = modal.querySelector('.proy-btn-siguiente');

        if (index === 1) {
            btnAnterior.textContent = 'Cancelar';
            btnAnterior.addEventListener('click', () => {
                closeModal(modal);
                closeModal(modalConfigurarPrecios);
                openModal(modalNuevoProyecto);
            });
        } else {
            btnAnterior.addEventListener('click', () => {
                closeModal(modal);
                openModal(modalEtapas[index - 2]);
            });
        }

        if (index === totalEtapas) {
            btnSiguiente.textContent = 'Guardar';
            btnSiguiente.addEventListener('click', () => guardarEtapas());
        } else {
            btnSiguiente.addEventListener('click', () => {
                closeModal(modal);
                openModal(modalEtapas[index]);
            });
        }
    }

    // Función para reemplazar select de manzana por input text
    function reemplazarSelectManzana(modal) {
        const selects = modal.querySelectorAll('.proy-select-container select');
        selects.forEach(select => {
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'proy-input-manzana';
            input.placeholder = 'A';
            select.replaceWith(input);
        });
    }

    // Función para configurar una fila completa
    function configurarFilaManzana(fila, modal, esPrimeraFila) {
        // Configurar input de manzana
        const inputManzana = fila.querySelector('.proy-input-manzana');
        inputManzana.addEventListener('input', function (e) {
            this.value = this.value.replace(/[^a-zA-Z]/g, '').toUpperCase();
            actualizarResumenEtapa(modal);
        });

        // Configurar input de cantidad de lotes
        const inputLotes = fila.querySelector('input[type="number"]');
        inputLotes.addEventListener('input', function (e) {
            this.value = this.value.replace(/[^0-9]/g, '');
            if (this.value < 1) this.value = '';
            actualizarResumenEtapa(modal);
        });

        // Agregar campos de tipo de terreno (solo si no existen)
        if (!fila.querySelector('.proy-tipo-terreno')) {
            agregarCampoTipoTerreno(fila, modal);
        }
    }

    // Función mejorada para agregar campo de tipo de terreno
    function agregarCampoTipoTerreno(fila, modal) {
        // Verificar si ya existen los campos
        if (fila.querySelector('.proy-tipo-terreno')) return;

        // Crear contenedores
        const tipoDiv = document.createElement('div');
        tipoDiv.className = 'proy-form-group';
        tipoDiv.innerHTML = `
        <label>Tipo de Terreno*</label>
        <div class="proy-select-container">
            <select class="proy-tipo-terreno">
                <option value="Calle">Calle</option>
                <option value="Avenida">Avenida</option>
                <option value="Esquina">Esquina</option>
                <option value="Parque">Parque</option>
                <option value="Esquina-Parque">Esquina-Parque</option>
            </select>
        </div>
    `;

        const cantidadDiv = document.createElement('div');
        cantidadDiv.className = 'proy-form-group';
        cantidadDiv.innerHTML = `
        <label>Cantidad*</label>
        <input type="number" class="proy-cantidad-terreno" placeholder="123" min="1">
    `;

        // Insertar antes de los botones de acción
        const actionsDiv = fila.querySelector('.proy-row-actions');
        fila.insertBefore(tipoDiv, actionsDiv);
        fila.insertBefore(cantidadDiv, actionsDiv);
    }


    // Función para limpiar campos de una fila
    function limpiarCamposFila(fila) {
        fila.querySelector('.proy-input-manzana').value = '';
        fila.querySelector('input[type="number"]').value = '';
        const selectTipo = fila.querySelector('.proy-tipo-terreno');
        if (selectTipo) selectTipo.selectedIndex = 0;
        const inputCantidad = fila.querySelector('.proy-cantidad-terreno');
        if (inputCantidad) inputCantidad.value = '';
    }

    // Función mejorada para actualizar el resumen de la etapa
    function actualizarResumenEtapa(modal) {
        const filas = modal.querySelectorAll('.proy-manzana-row');
        let resumen = [];

        filas.forEach(fila => {
            const manzana = fila.querySelector('.proy-input-manzana').value;
            const lotes = fila.querySelector('input[type="number"]').value;
            const tipoTerreno = fila.querySelector('.proy-tipo-terreno')?.value || 'Calle';
            const cantidad = fila.querySelector('.proy-cantidad-terreno')?.value || '';

            if (manzana || lotes || cantidad) {
                resumen.push(`Manzana ${manzana || 'A'}: ${lotes || '0'} lotes | ${tipoTerreno}: ${cantidad || '0'}`);
            }
        });

        modal.querySelector('.proy-resumen-etapa').value = resumen.join('\n');
    }

    // Función para convertir número a romano
    function numeroRomano(num) {
        const romanos = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
        return romanos[num] || num;
    }

    // Función para guardar todas las etapas
    function guardarEtapas() {
        const etapasData = [];

        modalEtapas.forEach((modal, index) => {
            const filas = modal.querySelectorAll('.proy-manzana-row');
            const etapa = {
                numero: index + 1,
                manzanas: []
            };

            filas.forEach(fila => {
                etapa.manzanas.push({
                    letra: fila.querySelector('.proy-input-manzana').value,
                    lotes: parseInt(fila.querySelector('input[type="number"]').value || 0),
                    tipoTerreno: fila.querySelector('.proy-tipo-terreno').value,
                    cantidad: parseInt(fila.querySelectorAll('input[type="number"]')[1].value || 0)
                });
            });

            etapasData.push(etapa);
        });

        console.log('Datos de etapas:', etapasData);
        // Aquí puedes implementar el envío al servidor

        Swal.fire({
            icon: 'success',
            title: '¡Proyecto completado!',
            text: 'Todas las etapas han sido configuradas correctamente',
            confirmButtonText: 'Aceptar'
        }).then(() => {
            // Cerrar todos los modales
            modalEtapas.forEach(modal => closeModal(modal));
            closeModal(modalConfigurarPrecios);
            closeModal(modalNuevoProyecto);

            // Recargar o redirigir
            window.location.reload();
        });
    }
}