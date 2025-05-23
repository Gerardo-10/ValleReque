function initTerrenosModals() {
    const overlay = document.getElementById("modalOverlay");

    // Agregar Terreno
    const btnAgregarTerreno = document.getElementById("btnAgregarTerreno");
    const modalAgregar = document.getElementById("modalAgregarTerreno");
    const btnCancelarAgregar1 = document.querySelector("#modalAgregarTerreno .close");
    const btnCancelarAgregar2 = document.querySelector("#modalAgregarTerreno .btn-secondary");

    btnAgregarTerreno?.addEventListener("click", () => {
        modalAgregar.classList.add("active");
        overlay.classList.add("active");
    });

    [btnCancelarAgregar1, btnCancelarAgregar2].forEach(el => {
        el?.addEventListener("click", () => {
            modalAgregar.classList.remove("active");
            overlay.classList.remove("active");
        });
    });

    // Editar Terreno
    const modalEditar = document.getElementById("modalEditarTerreno");
    const botonesEditar = document.querySelectorAll(".btn-editar-terreno");
    const btnCancelarEditar1 = document.querySelector("#modalEditarTerreno .close");
    const btnCancelarEditar2 = document.querySelector("#modalEditarTerreno .btn-secondary");

    botonesEditar.forEach((boton) => {
        boton.addEventListener("click", () => {
            const idTerreno = boton.getAttribute("data-id");
            // Aquí podrías rellenar el formulario con datos si lo necesitas
            modalEditar.classList.add("active");
            overlay.classList.add("active");
        });
    });

    [btnCancelarEditar1, btnCancelarEditar2].forEach(el => {
        el?.addEventListener("click", () => {
            modalEditar.classList.remove("active");
            overlay.classList.remove("active");
        });
    });

    // Confirmar Eliminar Terreno
    const modalEliminar = document.getElementById("modalConfirmarEliminarTerreno");
    const botonesEliminar = document.querySelectorAll(".btn-eliminar-terreno");
    const btnCancelarEliminar1 = document.querySelector("#modalConfirmarEliminarTerreno .close");
    const btnCancelarEliminar2 = document.querySelector("#modalConfirmarEliminarTerreno .btn-secondary");

    botonesEliminar.forEach((boton) => {
        boton.addEventListener("click", () => {
            const idTerreno = boton.getAttribute("data-id");
            // Puedes guardar el ID en un input oculto o variable global si lo necesitas para eliminar
            modalEliminar.classList.add("active");
            overlay.classList.add("active");
        });
    });

    [btnCancelarEliminar1, btnCancelarEliminar2].forEach(el => {
        el?.addEventListener("click", () => {
            modalEliminar.classList.remove("active");
            overlay.classList.remove("active");
        });
    });

    // Confirmar Guardar Terreno
    const modalGuardar = document.getElementById("modalConfirmarGuardarTerreno");
    const btnAbrirModalGuardar = document.getElementById("btn-guardar-terreno"); // Botón que muestra el modal
    const btnCancelarGuardar1 = document.querySelector("#modalConfirmarGuardarTerreno .close");
    const btnCancelarGuardar2 = document.querySelector("#modalConfirmarGuardarTerreno .btn-secondary");
    const btnConfirmarGuardar = document.getElementById("btn-confirmar-guardar-terreno"); // Nuevo ID del botón Continuar

    btnAbrirModalGuardar?.addEventListener("click", (e) => {
        e.preventDefault(); // Previene el envío del formulario inmediato
        modalGuardar.classList.add("active");
        overlay.classList.add("active");
    });

    [btnCancelarGuardar1, btnCancelarGuardar2].forEach(el => {
        el?.addEventListener("click", () => {
            modalGuardar.classList.remove("active");
            overlay.classList.remove("active");
        });
    });

    // Aquí puedes manejar la acción final de guardar
    btnConfirmarGuardar?.addEventListener("click", () => {
        // Aquí podrías hacer submit al formulario manualmente:
        // document.getElementById("formTerreno").submit();
        console.log("Terreno confirmado para guardar");
        modalGuardar.classList.remove("active");
        overlay.classList.remove("active");
    });

    // Confirmar Editar Terreno
    const modalConfirmarEditar = document.getElementById("modalConfirmarEditarTerreno");
    const btnAbrirModalEditarConfirmar = document.getElementById("btn-editar-terreno");
    const btnCancelarEditarConfirmar1 = document.querySelector("#modalConfirmarEditarTerreno .close");
    const btnCancelarEditarConfirmar2 = document.querySelector("#modalConfirmarEditarTerreno .btn-secondary");
    const btnConfirmarEditar = document.getElementById("btn-confirmar-editar-terreno");

    btnAbrirModalEditarConfirmar?.addEventListener("click", (e) => {
        e.preventDefault();
        modalConfirmarEditar.classList.add("active");
        overlay.classList.add("active");
    });

    [btnCancelarEditarConfirmar1, btnCancelarEditarConfirmar2].forEach(el => {
        el?.addEventListener("click", () => {
            modalConfirmarEditar.classList.remove("active");
            overlay.classList.remove("active");
        });
    });

    btnConfirmarEditar?.addEventListener("click", () => {
        // Aquí podrías hacer submit al formulario manualmente o vía fetch
        console.log("Terreno confirmado para editar");
        modalConfirmarEditar.classList.remove("active");
        overlay.classList.remove("active");
        mostrarModalExitoEditar(); // Muestra mensaje de éxito
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

    // Éxito al editar
    function mostrarModalExitoEditar() {
        const modal = document.getElementById("modalExitoEditar");
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
        modalEditar?.classList.remove("active");
        modalEliminar?.classList.remove("active");
        modalGuardar?.classList.remove("active");
        overlay.classList.remove("active");
    });
}