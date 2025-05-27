function initFinanciamientosModals() {
    const overlay = document.getElementById('modalOverlay');

    // Agregar Financiamiento
    const btnAgregarFinanciamiento = document.getElementById('btnAgregarFinanciamiento');
    const modalAgregar = document.getElementById('modalAgregarFinanciamiento');
    const btnCancelarAgregar1 = document.querySelector("#modalAgregarFinanciamiento .close");
    const btnCancelarAgregar2 = document.querySelector("#modalAgregarFinanciamiento .btn-secondary");

    btnAgregarFinanciamiento?.addEventListener("click", () => {
        modalAgregar.classList.add("active");
        overlay.classList.add("active");
    });

    [btnCancelarAgregar1, btnCancelarAgregar2].forEach(el => {
        el?.addEventListener("click", () => {
            modalAgregar.classList.remove("active");
            overlay.classList.remove("active");
        });
    });

    // Confirmar Guardar Financiamiento
    const modalGuardar = document.getElementById('modalConfirmarGuardarFinanciamiento');
    const btnAbrirModalGuardar = document.getElementById('btn-guardar-financiamiento');
    const btnCancelarGuardar1 = document.querySelector("#modalConfirmarGuardarFinanciamiento .close");
    const btnCancelarGuardar2 = document.querySelector("#modalConfirmarGuardarFinanciamiento .btn-secondary");

    const btnConfirmarGuardar = document.getElementById('btn-confirmar-guardar-financiamiento');

    btnAbrirModalGuardar?.addEventListener("click", (e) => {
        e.preventDefault();
        modalGuardar.classList.add("active");
        overlay.classList.add("active");
    });

    [btnCancelarGuardar1, btnCancelarGuardar2].forEach(el => {
        el?.addEventListener("click", () => {
            modalGuardar.classList.remove("active");
            overlay.classList.remove("active");
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
                console.log("Modal Agregar:", modalAgregar);
                modalAgregar.classList.remove("active");
                overlay.classList.remove("active");

                const f = result.financiamiento;

                const card = document.createElement("div");
                card.classList.add("card");
                card.setAttribute("data-id", f.id);

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
            } else {
                alert("Error al guardar: " + (result.error || "desconocido"));
            }
        } catch (error) {
            alert("Error en la solicitud: " + error.message);
        }
    });


    // Éxito al agregar
    function mostrarModalExitoAgregar() {
        const modal = document.getElementById("modalExitoAgregar");
        modal.classList.add("active");
        overlay.classList.add("active");
        setTimeout(() => {
            modal.classList.remove("active");
            overlay.classList.remove("active");
        }, 3000);
    }

    // Cerrar por overlay
    overlay?.addEventListener("click", () => {
        modalAgregar?.classList.remove("active");
        modalGuardar?.classList.remove("active");
        overlay.classList.remove("active");
    });
}
