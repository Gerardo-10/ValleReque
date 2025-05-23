function initTerrenosModals() {
    const btnAgregarTerreno = document.getElementById("btnAgregarTerreno");
    const modal = document.getElementById("modalAgregarTerreno");
    const overlay = document.getElementById("modalOverlay");
    const btnCancelar1 = document.getElementById("btn-cancelar-terreno");
    const btnCancelar2 = document.getElementById("btn-cancelar-terreno-footer");

    // Abrir el modal
    btnAgregarTerreno?.addEventListener("click", () => {
        modal.classList.add("active");
        overlay.classList.add("active");
    });

    // Cerrar el modal
    [btnCancelar1, btnCancelar2, overlay].forEach(el => {
        el?.addEventListener("click", () => {
            modal.classList.remove("active");
            overlay.classList.remove("active");
        });
    });
}