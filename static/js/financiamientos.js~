window.initFinanciamientosModals = function () {
    const overlay = document.getElementById('modalOverlay');

    // Botones y modales
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

    [btnCancelarAgregar1, btnCancelarAgregar2].forEach(el => {
        el?.addEventListener("click", () => {
            modalAgregar.classList.remove("active");
            overlay.classList.remove("active");
            document.body.style.overflow = '';
            limpiarMensaje();
            document.getElementById("formAgregarFinanciamiento").reset();
        });
    });

    // Funciones para mostrar y limpiar mensajes dentro del modal
    function mostrarMensaje(texto, tipo = 'error') {
        let mensaje = modalAgregar.querySelector('.alert');
        if (!mensaje) {
            mensaje = document.createElement('div');
            mensaje.classList.add('alert');
            modalAgregar.querySelector('.modal-body').appendChild(mensaje);
        }
        mensaje.textContent = texto;
        mensaje.className = 'alert'; // reset clases
        if (tipo === 'error') mensaje.classList.add('alert-error');
        else if (tipo === 'success') mensaje.classList.add('alert-success');
    }
    function limpiarMensaje() {
        const mensaje = modalAgregar.querySelector('.alert');
        if (mensaje) mensaje.remove();
    }

    // Guardar nuevo financiamiento con validación previa
    const modalGuardar = document.getElementById('modalConfirmarGuardarFinanciamiento');
    const btnAbrirModalGuardar = document.getElementById('btn-guardar-financiamiento');
    const btnCancelarGuardar1 = document.querySelector("#modalConfirmarGuardarFinanciamiento .close");
    const btnCancelarGuardar2 = document.querySelector("#modalConfirmarGuardarFinanciamiento .btn-secondary");
    const btnConfirmarGuardar = document.getElementById('btn-confirmar-guardar-financiamiento');

    btnAbrirModalGuardar?.addEventListener("click", (e) => {
        e.preventDefault();
        limpiarMensaje();

        const form = document.getElementById("formAgregarFinanciamiento");
        const nombre = form.nombre.value.trim();
        const monto = form.monto.value.trim();
        const interes = form.interes.value.trim();

        if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(nombre)) {
            mostrarMensaje('El nombre solo debe contener letras y espacios.');
            form.nombre.focus();
            return;
        }
        if (!/^\d{1,3}(,\d{3})*(\.\d{1,2})?$/.test(monto) && !/^\d+(\.\d{1,2})?$/.test(monto)) {
            mostrarMensaje('El monto debe ser un número válido');
            form.monto.focus();
            return;
        }
        if (!/^\d+(\.\d+)?$/.test(interes)) {
            mostrarMensaje('El interés debe ser un número decimal válido');
            form.interes.focus();
            return;
        }

        // Si pasa validación, abrir modal de confirmación
        modalGuardar.classList.add("active");
        overlay.classList.add("active");
        document.body.style.overflow = 'hidden';
    });

    [btnCancelarGuardar1, btnCancelarGuardar2].forEach(el => {
        el?.addEventListener("click", () => {
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
                card.setAttribute("data-id", f.id);
                card.setAttribute("data-estado", f.estado.toLowerCase());
                card.setAttribute("data-tipo", f.tipo.toString());

                card.innerHTML = `
                    <div class="card-header">
                        <input type="checkbox" class="card-checkbox">
                        <div class="card-logo">
                            <img src="/static/img/${f.imagen}" alt="${f.nombre}">
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="card-title-badge">
                            <h2>${f.nombre}</h2>
                            <span class="financiamiento-badge ${f.estado === "Activo" ? 'active' : 'inactive'}">
                                ${f.estado === "Activo" ? 'Activo' : 'Inactivo'}
                            </span>
                        </div>
                        <div class="card-info">
                            <div><span class="label">Tipo:</span> <span class="value">${f.tipo === 1 ? 'Estatal' : 'Privado'}</span></div>
                            <div><span class="label">Monto:</span> <span class="value">S/ ${f.monto ? parseFloat(f.monto).toLocaleString(undefined, {minimumFractionDigits: 2}) : "0.00"}</span></div>
                            <div><span class="label">Interés:</span> <span class="value highlight">${f.interes}% Anual</span></div>
                            <div><span class="label">Creación:</span> <span class="value">${f.fecha_creacion}</span></div>
                        </div>
                    </div>
                    <div class="card-footer">
                        <button class="btn-outline btn-danger toggle-status">
                            <i class="fas fa-power-off"></i> Desactivar
                        </button>
                        <button class="btn-outline btn-info show-details">
                            <i class="fas fa-info-circle"></i> Detalles
                        </button>
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

    const modalEstado = document.getElementById('modalConfirmarEstadoFinanciamiento');
    const confirmText = document.getElementById('confirmText');
    const btnConfirmar = document.getElementById('btn-confirmar-estado');
    const btnCerrar1 = document.getElementById('btn-cancelar-estado');
    const btnCerrar2 = document.getElementById('btn-cancelar-financiamiento-footer');

    let financiamientoId = null;
    let nuevoEstado = null;

    [btnCerrar1, btnCerrar2].forEach(btn => {
        btn?.addEventListener("click", () => {
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

    // Variables para filtros y búsqueda
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
            const nombre = card.querySelector('.card-title-badge h2').textContent.toLowerCase();

            const cumpleEstado = (estadoSeleccionado === 'todos' || estadoCard === estadoSeleccionado);
            const cumpleTipo = (tipoSeleccionado === 'todos' || tipoCard === tipoSeleccionado);
            const cumpleBusqueda = nombre.includes(texto);

            if (cumpleEstado && cumpleTipo && cumpleBusqueda) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }

    inputBusqueda.addEventListener('input', filtrarFinanciamientos);
    filtroEstado.addEventListener('change', filtrarFinanciamientos);
    filtroTipo.addEventListener('change', filtrarFinanciamientos);

    filtrarFinanciamientos();
};

document.addEventListener('DOMContentLoaded', () => {
    window.initFinanciamientosModals();
});
