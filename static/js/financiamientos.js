window.initFinanciamientosModals = function () {
    const overlay = document.getElementById('modalOverlay');
    const btnAgregarFinanciamiento = document.getElementById('btnAgregarFinanciamiento');
    const modalAgregar = document.getElementById('modalAgregarFinanciamiento');
    const btnCancelarAgregar1 = document.querySelector("#modalAgregarFinanciamiento .close");
    const btnCancelarAgregar2 = document.querySelector("#modalAgregarFinanciamiento .btn-secondary");

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
        this.value = this.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '');
    });

    document.getElementById('monto').addEventListener('input', function () {
        let valor = this.value.replace(/\D/g, ''); //Solo números
        this.value = valor.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    });

    document.getElementById('interes').addEventListener('input', function () {
    let valor = this.value;

    valor = valor.replace(/,/g, '.');
    valor = valor.replace(/[^0-9.]/g, '');
    const partes = valor.split('.');
    if (partes.length > 2) {
        valor = partes[0] + '.' + partes[1]; // Ignora puntos extra
    }

    this.value = valor.slice(0, 5); // Limita a 5 caracteres
    });


};

document.addEventListener('DOMContentLoaded', () => {
    window.initFinanciamientosModals();
});
