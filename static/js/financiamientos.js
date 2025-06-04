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

    const modalGuardar = document.getElementById('modalConfirmarGuardarFinanciamiento');
    const btnAbrirModalGuardar = document.getElementById('btn-guardar-financiamiento');
    const btnCancelarGuardar1 = document.querySelector("#modalConfirmarGuardarFinanciamiento .close");
    const btnCancelarGuardar2 = document.querySelector("#modalConfirmarGuardarFinanciamiento .btn-secondary");
    const btnConfirmarGuardar = document.getElementById('btn-confirmar-guardar-financiamiento');

    // ✅ Validación nativa automática
    btnAbrirModalGuardar?.addEventListener("click", (e) => {
        e.preventDefault();
        limpiarMensaje();

        const form = document.getElementById("formAgregarFinanciamiento");

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        modalGuardar.classList.add("active");
        overlay.classList.add("active");
        document.body.style.overflow = 'hidden';
    });

    [btnCancelarGuardar1, btnCancelarGuardar2].filter(Boolean).forEach(el => {
        el.addEventListener("click", () => {
            modalGuardar.classList.remove("active");
            overlay.classList.remove("active");
            document.body.style.overflow = '';
        });
    });

    btnConfirmarGuardar?.addEventListener("click", async () => {
        const form = document.getElementById("formAgregarFinanciamiento");
        const formData = new FormData(form);

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
                modalGuardar.classList.remove("active");
                modalAgregar.classList.remove("active");
                overlay.classList.remove("active");
                document.body.style.overflow = '';

                const f = result.financiamiento;

                const card = document.createElement("div");
                card.classList.add("card");
                card.offsetHeight;
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
                                <div><span class="value">S/ ${parseFloat(f.monto).toLocaleString('es-PE', { maximumFractionDigits: 0 })}</span></div>
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
                mostrarModalExitoAgregar();

                card.querySelector(".toggle-status").addEventListener("click", toggleStatusHandler);
                filtrarFinanciamientos();
            } else {
                alert("Error al guardar: " + (result.error || "desconocido"));
            }
        } catch (error) {
            alert("Error en la solicitud: " + error.message);
        }
    });

    function mostrarModalExitoAgregar() {
        const modal = document.getElementById("modalExitoAgregar");
        modal.classList.add("active");
        overlay.classList.add("active");
        setTimeout(() => {
            modal.classList.remove("active");
            overlay.classList.remove("active");
        }, 3000);
    }

    // --- Cambiar estado (se mantiene igual) ---
    const modalEstado = document.getElementById('modalConfirmarEstadoFinanciamiento');
    const confirmText = document.getElementById('confirmText');
    const btnConfirmar = document.getElementById('btn-confirmar-estado');
    const btnCerrar1 = document.getElementById('btn-cancelar-estado');
    const btnCerrar2 = document.getElementById('btnCancelarEstadoFooter');

    let financiamientoId = null;
    let nuevoEstado = null;

    [btnCerrar1, btnCerrar2].filter(Boolean).forEach(btn => {
        btn.addEventListener("click", () => {
            modalEstado.classList.remove("active");
            overlay.classList.remove("active");
            document.body.style.overflow = '';
        });
    });

    function toggleStatusHandler(e) {
        const card = e.target.closest(".card");
        financiamientoId = card.getAttribute("data-id");

        const estaActivo = card.querySelector(".financiamiento-badge").classList.contains("active");
        nuevoEstado = estaActivo ? "Inactivo" : "Activo";

        confirmText.textContent = `¿Está seguro que desea ${estaActivo ? "desactivar" : "activar"} este financiamiento?`;
        btnConfirmar.textContent = estaActivo ? "Desactivar" : "Activar";

        btnConfirmar.classList.remove("btn-danger", "btn-success");
        btnConfirmar.classList.add(estaActivo ? "btn-danger" : "btn-success");

        modalEstado.classList.add("active");
        overlay.classList.add("active");
        document.body.style.overflow = 'hidden';
    }

    document.querySelectorAll(".toggle-status").forEach(btn => {
        btn.addEventListener("click", toggleStatusHandler);
    });

    btnConfirmar?.addEventListener("click", async () => {
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
                const card = document.querySelector(`.card[data-id="${financiamientoId}"]`);
                const badge = card.querySelector(".financiamiento-badge");
                const btnToggle = card.querySelector(".toggle-status");
                const modalExito = document.getElementById("modalExitoEstado");

                card.setAttribute('data-estado', nuevoEstado.toLowerCase());
                badge.textContent = nuevoEstado;
                badge.classList.toggle("active", nuevoEstado === "Activo");
                badge.classList.toggle("inactive", nuevoEstado === "Inactivo");

                btnToggle.innerHTML = `<i class="fas fa-power-off"></i> ${nuevoEstado === "Activo" ? "Desactivar" : "Activar"}`;
                btnToggle.classList.remove("btn-danger", "btn-success", "btn-outline");
                btnToggle.classList.add("btn-outline", nuevoEstado === "Activo" ? "btn-danger" : "btn-success");

                modalEstado.classList.remove("active");
                overlay.classList.remove("active");
                document.body.style.overflow = '';

                modalExito.classList.add("active");
                setTimeout(() => {
                    modalExito.classList.remove("active");
                    overlay.classList.remove("active");
                }, 2500);

                filtrarFinanciamientos();
            } else {
                alert("No se pudo cambiar el estado.");
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    });

    overlay?.addEventListener("click", () => {
        modalAgregar?.classList.remove("active");
        modalGuardar?.classList.remove("active");
        modalEstado.classList.remove("active");
        overlay.classList.remove("active");
        document.body.style.overflow = '';
    });

    // 🔎 Filtro
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

    // 🚫 Restricciones automáticas de entrada
    document.getElementById('nombre').addEventListener('input', function () {
        this.value = this.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '');
    });

    document.getElementById('monto').addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '').slice(0, 20);
    });

    document.getElementById('interes').addEventListener('input', function () {
    // Permitir solo 1 punto o 1 coma y números
    this.value = this.value
        .replace(/[^0-9.,]/g, '')           // Elimina todo excepto números, punto y coma
        .replace(/[.,](?=.*[.,])/g, '')     // Permite solo un separador
        .slice(0, 5);                       // Limita longitud máxima
    });


};

document.addEventListener('DOMContentLoaded', () => {
    window.initFinanciamientosModals();
});
