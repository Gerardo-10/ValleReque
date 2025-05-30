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
    const btnCancelarEditar1 = document.querySelector("#modalEditarTerreno .close");
    const btnCancelarEditar2 = document.querySelector("#modalEditarTerreno .btn-secondary");

    document.querySelectorAll(".btn-editar-terreno").forEach(btn => {
        btn.addEventListener("click", () => {
            const fila = btn.closest("tr");

            const idTerreno = fila.dataset.id;
            const nombreProyecto = fila.children[1].textContent; // segunda columna

            // Rellenar el input oculto con el nombre del proyecto
            document.getElementById("idTerreno").value = idTerreno;
            document.getElementById("nombre_proyecto").value = nombreProyecto;

            // rellenar otros campos también...

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
    const btnConfirmarEliminar = document.getElementById("btn-eliminar-terreno");

    // Al hacer clic en cualquier botón de eliminar de la tabla
    botonesEliminar.forEach((boton) => {
        boton.addEventListener("click", (e) => {
            const id = e.currentTarget.getAttribute("data-id");
            console.log("ID seleccionado:", id);

            // Guardar ID en un atributo del botón de confirmar
            btnConfirmarEliminar.setAttribute("data-id", id);

            modalEliminar.classList.add("active");
            overlay.classList.add("active");
        });
    });

    btnConfirmarEliminar?.addEventListener("click", async () => {
        const idTerrenoAEliminar = btnConfirmarEliminar.getAttribute("data-id");

        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute("content");

        if (idTerrenoAEliminar) {
            try {
                const response = await fetch("/eliminar_terreno", {
                    method: "POST",
                    body: JSON.stringify({id_terreno: idTerrenoAEliminar}),
                    headers: {
                        "Content-Type": "application/json",
                        "X-Requested-With": "XMLHttpRequest",
                        "X-CSRFToken": csrfToken
                    }
                });

                const result = await response.json();

                if (result.success) {
                    const fila = document.querySelector(`tr[data-id="${idTerrenoAEliminar}"]`);
                    fila?.remove();

                    modalEliminar.classList.remove("active");
                    overlay.classList.remove("active");

                    mostrarModalExitoEliminar();
                } else {
                    alert("Error al eliminar terreno: " + (result.error || "desconocido"));
                }
            } catch (error) {
                alert("Error en la solicitud: " + error.message);
            }
        } else {
            alert("ID de terreno no proporcionado.");
        }
    });

    [btnCancelarEliminar1, btnCancelarEliminar2].forEach(el => {
        el?.addEventListener("click", () => {
            modalEliminar.classList.remove("active");
            overlay.classList.remove("active");
        });
    });

    // Confirmar Guardar Terreno
    const modalGuardar = document.getElementById("modalConfirmarGuardarTerreno");
    const btnAbrirModalGuardar = document.getElementById("btn-guardar-terreno");
    const btnCancelarGuardar1 = document.querySelector("#modalConfirmarGuardarTerreno .close");
    const btnCancelarGuardar2 = document.querySelector("#modalConfirmarGuardarTerreno .btn-secondary");
    const btnConfirmarGuardar = document.getElementById("btn-confirmar-guardar-terreno");

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
        const form = document.getElementById("formAgregarTerreno");
        const formData = new FormData(form);
        formData.append('estadoTerreno', 'Disponible');

        try {
            const response = await fetch("/insertar_terreno", {
                method: "POST",
                body: formData,
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                }
            });

            const result = await response.json();

            if (result.success) {
                modalGuardar.classList.remove("active");
                overlay.classList.remove("active");
                modalAgregar.classList.remove("active");

                const terreno = result.terreno;

                const nuevaFila = document.createElement('tr');
                nuevaFila.setAttribute('data-id', terreno.id_terreno);
                nuevaFila.setAttribute('data-estado', (terreno.estado || 'Disponible').toLowerCase());
                nuevaFila.innerHTML = `
                    <td>${terreno.id_terreno}</td>
                    <td>${terreno.nombre_proyecto}</td>
                    <td>${terreno.etapa}</td>
                    <td>${terreno.codigo_unidad}</td>
                    <td>${terreno.unidad}</td>
                    <td>${terreno.manzana}</td>
                    <td>${terreno.lote}</td>
                    <td>${terreno.area}</td>
                    <td>${terreno.precio}</td>
                    <td>${terreno.tipo}</td>
                    <td>${terreno.estado || 'Disponible'}</td>
                    <td class="acciones">
                        <button class="btn-editar-terreno" data-id="${terreno.id_terreno}">Editar</button>
                        <button class="btn-eliminar-terreno" data-id="${terreno.id_terreno}">Eliminar</button>
                    </td>
                `;
                document.getElementById('tabla_terrenos_body').appendChild(nuevaFila);

                form.reset();
                mostrarModalExitoAgregar();
            } else {
                alert("Error al guardar el terreno: " + (result.error || "desconocido"));
            }
        } catch (error) {
            alert("Error en la solicitud: " + error.message);
        }
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

    btnConfirmarEditar?.addEventListener("click", async () => {
        const form = document.getElementById("formEditarTerreno");
        const formData = new FormData(form);
        const idTerreno = formData.get("id_terreno");


        try {
            const response = await fetch("/actualizar_terreno", {
                method: "POST",
                body: formData,
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                }
            });

            const data = await response.json();

            if (data.success && data.terreno) {
                const terreno = data.terreno;

                // Cerrar todos los modales
                modalConfirmarEditar.classList.remove("active");
                modalEditar.classList.remove("active");
                overlay.classList.remove("active");

                // Actualizar la fila en la tabla
                const fila = document.querySelector(`tr[data-id="${idTerreno}"]`);
                if (fila) {
                    fila.innerHTML = `
                    <td>${terreno.id_terreno}</td>
                    <td>${terreno.nombre_proyecto}</td>
                    <td>${terreno.etapa}</td>
                    <td>${terreno.codigo_unidad}</td>
                    <td>${terreno.unidad}</td>
                    <td>${terreno.manzana}</td>
                    <td>${terreno.lote}</td>
                    <td>${terreno.area}</td>
                    <td>${terreno.precio}</td>
                    <td>${terreno.tipoTerreno}</td>
                    <td>${terreno.estadoTerreno}</td>
                    <td class="acciones">
                        <button class="btn-editar-terreno" data-id="${terreno.id_terreno}">Editar</button>
                        <button class="btn-eliminar-terreno" data-id="${terreno.id_terreno}">Eliminar</button>
                    </td>
                `;
                }

                // Reasignar eventos a botones recién creados
                initTerrenosModals(); // vuelve a vincular eventos a los botones nuevos
                form.reset();
                mostrarModalExitoEditar();
            } else {
                alert("Error al actualizar terreno: " + (data.error || "desconocido"));
            }
        } catch (error) {
            console.error("Error en la petición:", error);
            alert("Error al enviar la solicitud.");
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

    // Éxito al eliminar
    function mostrarModalExitoEliminar() {
        const modal = document.getElementById("modalExitoEliminar");
        modal.classList.add("active");
        overlay.classList.add("active");
        setTimeout(() => {
            modal.classList.remove("active");
            overlay.classList.remove("active");
        }, 3000);
    }

    function cerrarTodosLosModales() {
        modalAgregar?.classList.remove("active");
        modalEditar?.classList.remove("active");
        modalEliminar?.classList.remove("active");
        modalGuardar?.classList.remove("active");
        modalConfirmarEditar?.classList.remove("active");
        overlay?.classList.remove("active");
    }

    // Cerrar por overlay
    overlay?.addEventListener("click", () => {
        modalAgregar?.classList.remove("active");
        modalEditar?.classList.remove("active");
        modalEliminar?.classList.remove("active");
        modalGuardar?.classList.remove("active");
        modalConfirmarEditar?.classList.remove("active");
        overlay.classList.remove("active");
    });
}
