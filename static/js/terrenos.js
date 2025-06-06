function initTerrenosModals() {
    const overlay = document.getElementById("modalOverlay");

    // Agregar Terreno
    const btnAgregarTerreno = document.getElementById("btnAgregarTerreno");
    const modalAgregar = document.getElementById("modalAgregarTerreno");
    const btnCancelarAgregar1 = document.querySelector("#modalAgregarTerreno .close");
    const btnCancelarAgregar2 = document.querySelector("#modalAgregarTerreno .btn-secondary");

    const selectProyecto = document.getElementById('proyecto');
    const inputEtapa = document.getElementById('etapa');

      // Leer etapas desde atributo data-etapas
    let etapasPorProyecto = {};
    try {
        etapasPorProyecto = JSON.parse(selectProyecto.getAttribute('data-etapas'));
    } catch (e) {
        console.error("Error al leer etapasPorProyecto:", e);
    }

    //MOSTRAR MODAL AGREGAR
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

    // Validar etapa según proyecto
    selectProyecto?.addEventListener('change', () => {
        const idProyecto = selectProyecto.value;
        const maxEtapas = etapasPorProyecto[idProyecto];

        if (maxEtapas) {
            inputEtapa.max = maxEtapas;
            inputEtapa.placeholder = `Máximo: ${maxEtapas}`;

            const etapaActual = parseInt(inputEtapa.value);
            if (etapaActual && (etapaActual < 1 || etapaActual > maxEtapas)) {
                alert(`El proyecto tiene solo ${maxEtapas} etapas. Ingrese un valor válido.`);
                inputEtapa.value = "";
            }
        } else {
            inputEtapa.removeAttribute('max');
            inputEtapa.placeholder = 'Ingrese una etapa válida';
            inputEtapa.value = "";
        }
    });

    // Confirmar Guardar Terreno
    const modalGuardar = document.getElementById("modalConfirmarGuardarTerreno");
    const btnAbrirModalGuardar = document.getElementById("btn-guardar-terreno");
    const btnCancelarGuardar1 = document.querySelector("#modalConfirmarGuardarTerreno .close");
    const btnCancelarGuardar2 = document.querySelector("#modalConfirmarGuardarTerreno .btn-secondary");
    const btnConfirmarGuardar = document.getElementById("btn-confirmar-guardar-terreno");

    btnAbrirModalGuardar?.addEventListener("click", (e) => {
        e.preventDefault();

        const idProyecto = selectProyecto.value;
        const etapaIngresada = parseInt(inputEtapa.value);
        const maxEtapas = etapasPorProyecto[idProyecto];

        if (!idProyecto || !maxEtapas) {
            alert("Seleccione un proyecto válido.");
            return;
        }

        if (isNaN(etapaIngresada) || etapaIngresada < 1 || etapaIngresada > maxEtapas) {
            alert(`Etapa inválida. Debe estar entre 1 y ${maxEtapas}`);
            inputEtapa.focus();
            return;
        }

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
    formData.append('estadoTerreno', 'Disponible');  // Aquí se puede modificar según el valor real del estado

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
            const estado = (terreno.estado || 'Disponible').toLowerCase(); // Se asegura de que el estado esté en minúsculas

            if (estado === "eliminado") return;

            // Asignamos la clase correspondiente según el estado
            const clasesEstado = {
                'disponible': 'disponible',
                'vendido': 'vendido',
                'reservado': 'reservado',
                'enproceso': 'enproceso',
                'nodisponible': 'nodisponible',
                'eliminado': 'eliminado'
            };

            const nuevaFila = document.createElement('tr');
            nuevaFila.setAttribute('data-id', terreno.id_terreno);
            nuevaFila.setAttribute('data-estado', estado);

            // Aquí agregamos la clase correspondiente al estado
            const claseEstado = clasesEstado[estado] || 'disponible';  // Si no hay coincidencia, asigna 'disponible' como predeterminado
            nuevaFila.innerHTML = `
                <td>${terreno.id_terreno}</td>
                <td>${terreno.nombre_proyecto}</td>
                <td>${terreno.etapa}</td>
                <td>${terreno.area}</td>
                <td>${parseFloat(terreno.precio).toFixed(2)}</td>
                <td><span class="estado-terreno ${claseEstado}">${estado}</span></td>
                <td>${terreno.tipo}</td>
                <td>${terreno.manzana}</td>
                <td>${terreno.lote}</td>
                <td>${terreno.codigo_unidad}</td>
                <td class="acciones">
                    <button class="btn-editar-terreno" data-id="${terreno.id_terreno}"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="btn-eliminar-terreno" data-id="${terreno.id_terreno}"><i class="fa-solid fa-trash"></i></button>
                </td>`;

            document.getElementById('tabla_terrenos_body').appendChild(nuevaFila);
            initTerrenosModals();  // Asegúrate de inicializar los modales si es necesario
            form.reset();
            mostrarModalExitoAgregar();
        } else {
            alert("Error al guardar el terreno: " + (result.error || "desconocido"));
        }
    } catch (error) {
        alert("Error en la solicitud: " + error.message);
    }
});



    // === LÓGICA DE BÚSQUEDA Y FILTRO DE TERRENOS ===
const inputBuscarTerreno = document.getElementById("buscarTerreno");
const filtroCampoTerreno = document.getElementById("filtroTerrenos");
const filtroEstadoTerreno = document.getElementById("filtroTerrenosEstado");

// Función de filtrado
function filtrarTerrenos() {
    const texto = inputBuscarTerreno.value.trim().toLowerCase();
    const campo = filtroCampoTerreno.value;
    const estado = filtroEstadoTerreno.value.toLowerCase();

    document.querySelectorAll("#tabla_terrenos tbody tr").forEach(fila => {
        const cols = fila.children;

        // Extraemos el estado y lo comparamos en formato limpio
        const estadoTexto = cols[5].querySelector("span") ?
            cols[5].querySelector("span").textContent.trim().toLowerCase().replace(/\s+/g, '') : "";

        const data = {
            proyecto: cols[1].textContent.toLowerCase(),
            etapa: cols[2].textContent.toLowerCase(),
            unidad: cols[9].textContent.toLowerCase(),
            estado: estadoTexto
        };

        // Filtro por campo específico
        const coincideCampo = campo
            ? data[campo]?.includes(texto)
            : Object.values(data).some(val => val.includes(texto));

        // Filtro por estado
        const coincideEstado = estado === "todos" || data.estado === estado;

        fila.style.display = (coincideCampo && coincideEstado) ? "" : "none";
    });
}



// Agregar los event listeners y depurar
inputBuscarTerreno.addEventListener("input", function() {
    console.log("Evento 'input' activado en búsqueda de terreno");
    filtrarTerrenos();
});

filtroCampoTerreno.addEventListener("change", function() {
    console.log("Evento 'change' activado en campo de filtro");
    inputBuscarTerreno.value = ""; // Limpiar búsqueda
    filtrarTerrenos();
});

filtroEstadoTerreno.addEventListener("change", function() {
    console.log("Evento 'change' activado en filtro de estado");
    filtrarTerrenos();
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
                if (terreno.estadoTerreno.toLowerCase() === "eliminado") {
                    fila.remove(); // Elimina la fila si ahora está eliminada
                    return;
                }
                if (fila) {
                    fila.innerHTML = `
                    <td>${terreno.id_terreno}</td>
                    <td>${terreno.nombre_proyecto}</td>
                    <td>${terreno.etapa}</td>
                    <td>${terreno.area}</td>
                    <td>${terreno.precio}</td>
                    <td>${terreno.estado}</td>
                    <td>${terreno.tipo}</td>
                    <td>${terreno.manzana}</td>
                    <td>${terreno.lote}</td>
                    <td>${terreno.codigo_unidad}</td>
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
document.addEventListener("DOMContentLoaded", () => {
    initTerrenosModals();
});
