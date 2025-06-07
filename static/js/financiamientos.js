window.initFinanciamientosModals = function () {
    const overlay = document.getElementById('modalOverlay');
    const btnAgregarFinanciamiento = document.getElementById('btnAgregarFinanciamiento');
    const modalAgregar = document.getElementById('modalAgregarFinanciamiento');
    const btnCancelarAgregar1 = document.querySelector("#modalAgregarFinanciamiento .close");
    const btnCancelarAgregar2 = document.querySelector("#modalAgregarFinanciamiento .btn-secondary");
    const modalEditar = document.getElementById('modalEditarFinanciamiento');
    const btnCancelarEditar = document.querySelector("#modalEditarFinanciamiento .btn-secondary");
    const btnCerrarEditar = document.querySelector("#modalEditarFinanciamiento .close");
    const btnActualizar = document.getElementById("btn-actualizar-financiamiento");
    const formEditar = document.getElementById("formEditarFinanciamiento");
    const vistaPreviaImagen = document.getElementById("imagenVistaEditar");

    btnAgregarFinanciamiento?.addEventListener("click", () => {
        limpiarMensaje();
        modalAgregar.classList.add("active");
        overlay.classList.add("active");
        document.body.style.overflow = 'hidden';
    });

    [btnCancelarAgregar1, btnCancelarAgregar2].filter(Boolean).forEach(el => {
        el.addEventListener("click", () => {
            modalAgregar.classList.remove("active");
            overlay.classList.remove("active");
            document.body.style.overflow = '';
            limpiarMensaje();
            document.getElementById("formAgregarFinanciamiento").reset();
        });
    });

    function limpiarMensaje() {
        const mensaje = modalAgregar.querySelector('.alert');
        if (mensaje) mensaje.remove();
    }

    function formatearFecha(fechaDDMMYYYY) {
        const [dd, mm, yyyy] = fechaDDMMYYYY.split('/');
        return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
    }

    const btnAbrirModalGuardar = document.getElementById('btn-guardar-financiamiento');
    btnAbrirModalGuardar?.addEventListener("click", async (e) => {
    e.preventDefault();
    limpiarMensaje();

    const form = document.getElementById("formAgregarFinanciamiento");

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Oculta el modal antes de mostrar SweetAlert
    modalAgregar?.classList.remove("active");
    overlay?.classList.remove("active");
    document.body.style.overflow = '';

    const confirm = await Swal.fire({
        icon: 'warning',
        title: '¿Desea guardar el nuevo Financiamiento?',
        showCancelButton: true,
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Atrás',
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#6c757d'
    });

    if (!confirm.isConfirmed) {
        // Si cancela, volver a mostrar el modal
        modalAgregar?.classList.add("active");
        overlay?.classList.add("active");
        document.body.style.overflow = 'hidden';
        return;
    }

    // Preparamos los datos con formato limpio
    const formData = new FormData(form);
    const fMonto = formData.get("monto") || "0";
    formData.set("monto", fMonto.replace(/,/g, '')); // limpiar comas

    try {
        const response = await fetch("/insertar_financiamiento", {
            method: "POST",
            body: formData,
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            }
        });

        const result = await response.json();

        if (result.success) {
            const f = result.financiamiento;

            const card = document.createElement("div");
            card.classList.add("card");
            card.setAttribute("data-id", f.id);
            card.setAttribute("data-estado", f.estado.toLowerCase());
            card.setAttribute("data-tipo", f.tipo.toString());

            card.innerHTML = `
                <img src="/static/img/financiamientos/${f.imagen}" alt="${f.nombre}" class="card-img-top" style="height: 200px; width: 100%; object-fit: contain;" />
                <div class="card-body m-auto" style="width: 90%;">
                    <div class="card-title text-center">
                        <h2>${f.nombre}</h2>
                        <span class="rounded p-1 my-2 financiamiento-badge ${f.estado === "Activo" ? 'active' : 'inactive'}">
                            ${f.estado}
                        </span>
                    </div>
                    <div class="card-text d-flex flex-column gap-2">
                        <div class="d-flex flex-row justify-content-between">
                            <div><span class="label">Tipo:</span> <span class="value">${f.tipo === 1 ? 'Estatal' : 'Privado'}</span></div>
                            <div><span class="label">Monto:</span> <span class="value">S/ ${Number(f.monto).toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span></div>
                        </div>
                        <div class="d-flex flex-row justify-content-between">
                            <div><span class="label">Interés:</span> <span class="value highlight">${f.interes}% Anual</span></div>
                            <div><span class="label">Creación:</span> <span class="value">${new Date(f.fecha_creacion).toLocaleDateString('es-PE')}</span></div>
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <div style="width: 90%;" class="m-auto">
                        <div class="d-flex justify-content-between">
                            <button class="btn-outline ${f.estado === 'Activo' ? 'btn-danger' : 'btn-success'} toggle-status">
                                <i class="fas fa-power-off"></i> ${f.estado === "Activo" ? 'Desactivar' : 'Activar'}
                            </button>
                            <button class="btn-outline btn-info show-details">
                                <i class="fas fa-info-circle"></i> Detalles
                            </button>
                        </div>
                    </div>
                </div>
            `;

            document.querySelector(".cards").prepend(card);
            form.reset();

            Swal.fire({
                icon: 'success',
                title: '¡Financiamiento creado!',
                text: 'Se ha guardado correctamente.',
                confirmButtonColor: '#28a745',
                timer: 2500,
                timerProgressBar: true,
                showConfirmButton: false
            });

            card.querySelector(".toggle-status").addEventListener("click", toggleStatusHandler);
            filtrarFinanciamientos();

        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error al guardar',
                text: result.error || 'Ocurrió un error inesperado.',
                confirmButtonColor: '#dc3545'
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text: error.message || 'No se pudo completar la solicitud.',
            confirmButtonColor: '#dc3545'
        });
    }
});


    async function toggleStatusHandler(e) {
        const card = e.target.closest(".card");
        const financiamientoId = card.getAttribute("data-id");
        const badge = card.querySelector(".financiamiento-badge");
        const btnToggle = card.querySelector(".toggle-status");
        const estaActivo = badge.classList.contains("active");
        const nuevoEstado = estaActivo ? "Inactivo" : "Activo";

        const confirm = await Swal.fire({
            icon: 'warning',
            title: 'Confirmar esta Acción',
            text: `¿Está seguro que desea ${estaActivo ? 'desactivar' : 'activar'} este financiamiento?`,
            showCancelButton: true,
            confirmButtonText: estaActivo ? 'Desactivar' : 'Activar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: estaActivo ? '#dc3545' : '#28a745',
            cancelButtonColor: '#6c757d'
        });

        if (!confirm.isConfirmed) return;

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute("content");

            const response = await fetch("/cambiar_estado_financiamiento", {
                method: "POST",
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken
                },
                body: JSON.stringify({
                    id_financiamiento: financiamientoId,
                    estado: nuevoEstado
                })
            });

            const result = await response.json();

            if (result.success) {
                card.setAttribute('data-estado', nuevoEstado.toLowerCase());
                badge.textContent = nuevoEstado;
                badge.classList.toggle("active", nuevoEstado === "Activo");
                badge.classList.toggle("inactive", nuevoEstado === "Inactivo");

                btnToggle.innerHTML = `<i class="fas fa-power-off"></i> ${nuevoEstado === "Activo" ? "Desactivar" : "Activar"}`;
                btnToggle.classList.remove("btn-danger", "btn-success", "btn-outline");
                btnToggle.classList.add("btn-outline", nuevoEstado === "Activo" ? "btn-danger" : "btn-success");

                Swal.fire({
                    icon: 'success',
                    title: 'Estado actualizado',
                    text: `El financiamiento ahora está ${nuevoEstado === 'Activo' ? 'activado' : 'desactivado'}.`,
                    confirmButtonColor: '#28a745',
                    timer: 2000,
                    showConfirmButton: false
                });

                filtrarFinanciamientos();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'No se pudo cambiar el estado',
                    text: result.error || '',
                    confirmButtonColor: '#dc3545'
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error en la solicitud',
                text: error.message,
                confirmButtonColor: '#dc3545'
            });
        }
    }

    document.querySelectorAll(".toggle-status").forEach(btn => {
        btn.addEventListener("click", toggleStatusHandler);
    });

    const inputBusqueda = document.querySelector('.financiamiento-search-box input');
    const filtroEstado = document.getElementById('filterEstado');
    const filtroTipo = document.getElementById('filterTipo');
    const contenedorCards = document.querySelector('.cards');

    function filtrarFinanciamientos() {
        const texto = inputBusqueda.value.trim().toLowerCase();
        const estadoSeleccionado = filtroEstado.value.toLowerCase();
        const tipoSeleccionado = filtroTipo.value.toLowerCase();

        const cards = contenedorCards.querySelectorAll('.card');

        cards.forEach(card => {
            const estadoCard = (card.getAttribute('data-estado') || '').toLowerCase();
            const tipoCard = (card.getAttribute('data-tipo') || '').toLowerCase();
            const nombre = card.querySelector('.card-title h2').textContent.toLowerCase();

            const cumpleEstado = (estadoSeleccionado === 'todos' || estadoCard === estadoSeleccionado);
            const cumpleTipo = (tipoSeleccionado === 'todos' || tipoCard === tipoSeleccionado);
            const cumpleBusqueda = nombre.includes(texto);

            card.style.display = (cumpleEstado && cumpleTipo && cumpleBusqueda) ? '' : 'none';
        });
    }

    inputBusqueda.addEventListener('input', filtrarFinanciamientos);
    filtroEstado.addEventListener('change', filtrarFinanciamientos);
    filtroTipo.addEventListener('change', filtrarFinanciamientos);
    filtrarFinanciamientos();

    document.getElementById('nombre').addEventListener('input', function () {
        this.value = this.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '')
        .slice(0, 50); 
    });

    document.getElementById('monto').addEventListener('input', function(e) {
    // Obtener el valor actual
    let value = this.value;
    
    // Eliminar cualquier caracter que no sea número o punto
    value = value.replace(/[^0-9.]/g, '');
    
    // Eliminar puntos adicionales después del primero
    const decimalSplit = value.split('.');
    if (decimalSplit.length > 2) {
        value = decimalSplit[0] + '.' + decimalSplit.slice(1).join('');
    }
    
    // Limitar la parte entera a 10 dígitos
    if (decimalSplit[0].length > 10) {
        value = decimalSplit[0].substring(0, 10) + (decimalSplit[1] ? '.' + decimalSplit[1] : '');
    }
    
    // Limitar decimales a 2 dígitos
    if (decimalSplit.length > 1 && decimalSplit[1].length > 2) {
        value = decimalSplit[0] + '.' + decimalSplit[1].substring(0, 2);
    }
    
    // Actualizar el valor
    this.value = value;
});

    document.getElementById('monto').addEventListener('blur', function(e) {
        // Formatear el valor al salir del campo
        let value = this.value;
        
        if (value === '') return;
        
        // Si no tiene punto, agregar .00
        if (value.indexOf('.') === -1) {
            value += '.00';
        } 
        // Si tiene punto pero no decimales, agregar 00
        else if (value.split('.')[1].length === 0) {
            value += '00';
        }
        // Si tiene solo 1 decimal, agregar 0
        else if (value.split('.')[1].length === 1) {
            value += '0';
        }
        
        // Actualizamos el valor del input
        this.value = value;
    });


    document.getElementById('interes').addEventListener('input', function () {
        let valor = this.value;
        valor = valor.replace(/,/g, '.').replace(/[^0-9.]/g, '');
        const partes = valor.split('.');
        if (partes.length > 2) {
            valor = partes[0] + '.' + partes[1];
        }
        this.value = valor.slice(0, 5);
    });

    document.getElementById('imagen').addEventListener('change', async function () {
    const archivo = this.files[0];
    if (archivo) {
        const tipo = archivo.type;
        if (tipo !== "image/png" && tipo !== "image/jpeg") {
            // Oculta momentáneamente el modal actual
            modalAgregar.classList.remove("active");
            overlay.classList.remove("active");
            document.body.style.overflow = '';

            await Swal.fire({
                icon: 'warning',
                title: 'Archivo no permitido',
                text: 'Solo se permiten imágenes PNG o JPG.',
                confirmButtonColor: '#f44336'
            });

            this.value = "";

            // Reabre el modal
            modalAgregar.classList.add("active");
            overlay.classList.add("active");
            document.body.style.overflow = 'hidden';
        }
    }
});

document.getElementById('fecha_creacion').addEventListener('change', async function () {
    const hoy = new Date().toISOString().split('T')[0];
    if (this.value > hoy) {
        // Cerrar momentáneamente el modal para que Swal se vea al frente
        modalAgregar.classList.remove("active");
        overlay.classList.remove("active");
        document.body.style.overflow = '';

        await Swal.fire({
            icon: 'warning',
            title: 'Fecha inválida',
            text: 'La fecha no puede ser futura.',
            confirmButtonColor: '#f44336'
        });

        this.value = "";

        // Reabrir el modal
        modalAgregar.classList.add("active");
        overlay.classList.add("active");
        document.body.style.overflow = 'hidden';
    }
});


[btnCancelarEditar, btnCerrarEditar].forEach(btn => {
    btn?.addEventListener("click", () => {
        modalEditar.classList.remove("active");
        overlay.classList.remove("active");
        document.body.style.overflow = '';
        formEditar.reset();
        if (vistaPreviaImagen) vistaPreviaImagen.src = "/static/img/default.jpg";
    });
});

// Mostrar imagen seleccionada en la vista previa antes de guardar
document.getElementById("imagenEditar").addEventListener("change", function (event) {
    const archivo = event.target.files[0];
    if (archivo && vistaPreviaImagen) {
        const urlTemporal = URL.createObjectURL(archivo);
        vistaPreviaImagen.src = urlTemporal;
    }
});

document.addEventListener('click', function (e) {
    const editBtn = e.target.closest('.edit-financiamiento');
    if (!editBtn) return;

    const card = editBtn.closest('.card');
    if (!card) {
        console.error("No se encontró tarjeta .card para editar");
        return;
    }

    const id = card.getAttribute("data-id");
    const nombre = card.querySelector(".card-title h2")?.textContent.trim();
    const tipo = card.getAttribute("data-tipo");
    const valores = card.querySelectorAll(".value");

    const montoTexto = valores[1]?.textContent.trim();
    const interesTexto = valores[2]?.textContent.trim();
    const fechaTexto = valores[3]?.textContent.trim();
    const imagenElement = card.querySelector("img.card-img-top");
    const imagenSrc = imagenElement?.getAttribute("src");

    function formatearFecha(fechaDDMMYYYY) {
        const [dd, mm, yyyy] = fechaDDMMYYYY.split('/');
        return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
    }

    const monto = montoTexto.replace(/[^\d]/g, '');
    const interes = interesTexto.replace('% Anual', '').replace(',', '.').trim();
    const fechaFormateada = formatearFecha(fechaTexto);

    document.getElementById("id_financiamiento_editar").value = id;
    document.getElementById("nombreEditar").value = nombre;
    document.getElementById("tipoEditar").value = tipo;
    document.getElementById("montoEditar").value = Number(monto).toLocaleString('es-PE');
    document.getElementById("interesEditar").value = interes;
    document.getElementById("fechaEditar").value = fechaFormateada;

    const vistaPrevia = document.getElementById("imagenVistaEditar");
    const baseRuta = vistaPrevia?.dataset.rutaBase || "/static/uploads/";

    if (imagenSrc) {
        const imagenNombre = imagenSrc.split("/").pop();
        const rutaCompleta = baseRuta + imagenNombre + "?t=" + Date.now();
        vistaPrevia.src = rutaCompleta;
        document.getElementById("imagen_actual").value = imagenNombre;
        console.log("✅ Cargando imagen:", rutaCompleta);
    } else {
        vistaPrevia.src = "/static/img/default.jpg";
        document.getElementById("imagen_actual").value = "";
        console.warn("⚠️ No se encontró src en la tarjeta, cargando imagen por defecto.");
    }

    modalEditar.classList.add("active");
    overlay.classList.add("active");
    document.body.style.overflow = 'hidden';
});

document.getElementById('nombreEditar').addEventListener('input', function () {
    this.value = this.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '').slice(0, 50);
});

document.getElementById('montoEditar').addEventListener('input', function () {
    let valor = this.value.replace(/\D/g, '').slice(0, 10); // Limitar a 10 dígitos
    this.value = valor.replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Formatear con coma
});

document.getElementById('interesEditar').addEventListener('input', function () {
    let valor = this.value.replace(/,/g, '.').replace(/[^0-9.]/g, '');
    const partes = valor.split('.');
    if (partes.length > 2) {
        valor = partes[0] + '.' + partes[1];
    }
    this.value = valor.slice(0, 5);
});

btnActualizar?.addEventListener("click", async (e) => {
    e.preventDefault();

    if (!formEditar.checkValidity()) {
        formEditar.reportValidity();
        return;
    }

    modalEditar.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = '';

    const confirm = await Swal.fire({
        icon: 'warning',
        title: '¿Desea actualizar el financiamiento?',
        showCancelButton: true,
        confirmButtonText: 'Actualizar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#007bff',
        cancelButtonColor: '#6c757d'
    });

    if (!confirm.isConfirmed) {
        modalEditar.classList.add("active");
        overlay.classList.add("active");
        document.body.style.overflow = 'hidden';
        return;
    }

    const formData = new FormData(formEditar);
    const id = formData.get("id_financiamiento");
    const fMonto = formData.get("monto") || "0";
    formData.set("monto", fMonto.replace(/,/g, ''));

    try {
        const response = await fetch("/actualizar_financiamiento", {
            method: "POST",
            body: formData,
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            }
        });

        const result = await response.json();

        if (result.success) {
            Swal.fire({
                icon: 'success',
                title: 'Actualizado correctamente',
                text: 'Los datos fueron actualizados.',
                confirmButtonColor: '#28a745',
                timer: 2000,
                showConfirmButton: false
            });

            const card = document.querySelector(`.card[data-id="${id}"]`);
            if (card) {
                const nombre = document.getElementById("nombreEditar").value.trim();
                const tipo = document.getElementById("tipoEditar").value;
                const monto = document.getElementById("montoEditar").value.trim();
                const interes = document.getElementById("interesEditar").value.trim();
                const fecha = document.getElementById("fechaEditar").value;

                card.querySelector(".card-title h2").textContent = nombre;
                card.setAttribute("data-tipo", tipo);

                const valores = card.querySelectorAll(".value");
                valores[1].textContent = "S/ " + Number(monto.replace(/,/g, '')).toLocaleString('es-PE');
                valores[2].textContent = interes + "% Anual";

                const fechaObj = new Date(fecha);
                valores[3].textContent = fechaObj.toLocaleDateString('es-PE');

                const imagenInput = document.getElementById("imagenEditar");
                const imagenCard = card.querySelector("img.card-img-top");
                if (imagenInput && imagenInput.files.length > 0 && imagenCard) {
                    const nombreImagen = imagenInput.files[0].name;
                    imagenCard.src = "/static/uploads/" + nombreImagen + "?t=" + Date.now();
                }
                card.classList.add("actualizado");
                setTimeout(() => card.classList.remove("actualizado"), 2000);
            }

            formEditar.reset();
            if (vistaPreviaImagen) vistaPreviaImagen.src = "/static/img/default.jpg";

        } else {
            throw new Error(result.error || "Error al actualizar");
        }

    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || "Error al actualizar financiamiento.",
            confirmButtonColor: '#dc3545'
        });
    }
});


};

document.addEventListener('DOMContentLoaded', () => {
    window.initFinanciamientosModals();
});