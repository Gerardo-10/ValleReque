document.addEventListener("DOMContentLoaded", () => {
  initTerrenosModals();
});

function initTerrenosModals() {
  //ELIMINAR TERRENOS FUNCIONALIDAD Y SWEETALERT
  const btnEliminarTerreno = document.querySelectorAll(".btn-eliminar-terreno");
  btnEliminarTerreno.forEach((button) => {
    button.addEventListener("click", function (e) {
      const terrenoId = this.getAttribute("data-id");
      Swal.fire({
        title: "¿Estás seguro?",
        text: "¡Esta acción no se puede deshacer!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
        customClass: {
          confirmButton: "btn-confirmar-eliminar",
          cancelButton: "btn-cancelar-eliminar",
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            .getAttribute("content");
          try {
            const response = await fetch("/eliminar_terreno", {
              method: "POST",
              body: JSON.stringify({ id_terreno: terrenoId }),
              headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
                "X-CSRFToken": csrfToken,
              },
            });
            const result = await response.json();
            if (result.success) {
              const fila = document.querySelector(`tr[data-id="${terrenoId}"]`);
              fila?.remove();
              Swal.fire(
                "Eliminado!",
                "El terreno ha sido eliminado.",
                "success"
              );
            } else {
              Swal.fire(
                "Error!",
                "Hubo un problema al eliminar el terreno: " +
                  (result.message || "desconocido"),
                "error"
              );
            }
          } catch (error) {
            Swal.fire(
              "Error!",
              "Hubo un problema con la conexión: " + error.message,
              "error"
            );
          }
        } else {
          Swal.fire("Cancelado", "El terreno no fue eliminado", "info");
        }
      });
    });
  });

  // AGREGAR NUEVO TERRENO FUNCIONALIDAD

  const btnAgregarTerreno = document.getElementById("btnAgregarTerreno");
  const modalAgregar = document.getElementById("modalAgregarNuevoTerreno");
  const btnCancelarNuevoTerreno = document.getElementById("btnCancelarNuevoTerreno"); //la x
  const btnCancelarTerreno = document.getElementById("btnCancelarTerreno"); //el botón de cancelar en el modal
  const btnGuardarNuevoTerreno = document.getElementById("btnGuardarNuevoTerreno"); //el botón de guardar en el modal
  const overlay = document.getElementById("modalOverlay");
  const selectProyecto = document.getElementById('selectProyecto');
  const inputEtapa = document.getElementById('inputEtapa');
  const inputManzana = document.getElementById("inputManzana");
  const inputLote = document.getElementById("inputLote");
  const inputArea = document.getElementById("inputArea");
  const inputPrecio = document.getElementById("inputPrecio");
  let etapasPorProyecto = {};
  // Mostrar el modal de agregar terreno cuando se haga clic en "Agregar"
  btnAgregarTerreno.addEventListener("click", () => {
    modalAgregar.classList.add("active"); // Mostrar modal
    overlay.classList.add("active"); // Mostrar overlay
  });

  // Cerrar el modal cuando se haga clic en el botón de cancelar
  const closeModal = () => {
    modalAgregar.classList.remove("active"); // Ocultar modal
    overlay.classList.remove("active"); // Ocultar overlay
  };

  btnCancelarNuevoTerreno.addEventListener("click", closeModal);
  btnCancelarTerreno.addEventListener("click", closeModal);

   // Leer etapas desde atributo data-etapasAdd commentMore actions
try {
    etapasPorProyecto = JSON.parse(selectProyecto.getAttribute('data-etapas'));
} catch (e) {
    console.error("Error al leer etapasPorProyecto:", e);
}

// Evento para cuando se cambia la selección de proyecto
selectProyecto.addEventListener('change', function() {
    const proyectoId = this.value;  // Obtener el ID del proyecto seleccionado
    const maxEtapas = etapasPorProyecto[proyectoId];  // Obtener la cantidad de etapas para el proyecto seleccionado

    if (maxEtapas) {
        // Actualizar el input de etapa con el rango permitido
        inputEtapa.setAttribute('placeholder', 'Máximo de etapas: ' + maxEtapas);  // Establecer el placeholder
        inputEtapa.setAttribute('max', maxEtapas);  // Establecer el valor máximo en el input
        inputEtapa.setAttribute('min', 1);  // Establecer el valor mínimo en el input
        inputEtapa.value = '';  // Limpiar el campo de etapa
    }
  });

  inputEtapa.addEventListener('input', function() {
    let etapaValue = this.value;

    const maxEtapas = etapasPorProyecto[selectProyecto.value];

    // Evitar que el valor empiece con 0
    if (etapaValue.startsWith('0')) {
        etapaValue = etapaValue.slice(1);  // Eliminar el primer cero
    }

    // Limitar la longitud a 2 dígitos
    if (etapaValue.length > 2) {
        etapaValue = etapaValue.slice(0, 2);  // Limitar a 2 caracteres
    }

    // Evitar caracteres no numéricos (permitir solo números)
    etapaValue = etapaValue.replace(/[^0-9]/g, "");

    // Si el valor supera el máximo, no permitirlo
    if (parseInt(etapaValue) > maxEtapas) {
        etapaValue = etapaValue.slice(0, -1);  // Eliminar el último dígito
    }

    // Asignar el valor limpio al input
    this.value = etapaValue;
});


  // Solo números para inputLote (máximo 3 dígitos)
  inputLote.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "").slice(0, 3);
  });

  inputArea.addEventListener("input", function (e) {
    // Obtener el valor actual
    let value = this.value;

    // Eliminar cualquier caracter que no sea número o punto
    value = value.replace(/[^0-9.]/g, "");

    // Eliminar puntos adicionales después del primero
    const decimalSplit = value.split(".");
    if (decimalSplit.length > 2) {
      value = decimalSplit[0] + "." + decimalSplit.slice(1).join("");
    }

    // Limitar la parte entera a 10 dígitos
    if (decimalSplit[0].length > 5) {
      value =
        decimalSplit[0].substring(0, 5) +
        (decimalSplit[1] ? "." + decimalSplit[1] : "");
    }

    // Limitar decimales a 2 dígitos
    if (decimalSplit.length > 1 && decimalSplit[1].length > 2) {
      value = decimalSplit[0] + "." + decimalSplit[1].substring(0, 2);
    }

    // Actualizar el valor
    this.value = value;
  });
  inputArea.addEventListener("blur", function (e) {
    // Formatear el valor al salir del campo
    let value = this.value;
    if (value === "") return;
    // Si no tiene punto, agregar .00
    if (value.indexOf(".") === -1) {
      value += ".00";
    }
    // Si tiene punto pero no decimales, agregar 00
    else if (value.split(".")[1].length === 0) {
      value += "00";
    }
    // Si tiene solo 1 decimal, agregar 0
    else if (value.split(".")[1].length === 1) {
      value += "0";
    }
    // Actualizamos el valor del input
    this.value = value;
  });

  inputPrecio.addEventListener("input", function (e) {
    // Obtener el valor actual
    let value = this.value;
    // Eliminar cualquier caracter que no sea número o punto
    value = value.replace(/[^0-9.]/g, "");

    // Eliminar puntos adicionales después del primero
    const decimalSplit = value.split(".");
    if (decimalSplit.length > 2) {
      value = decimalSplit[0] + "." + decimalSplit.slice(1).join("");
    }
    // Limitar la parte entera a 10 dígitos
    if (decimalSplit[0].length > 10) {
      value =
        decimalSplit[0].substring(0, 10) +
        (decimalSplit[1] ? "." + decimalSplit[1] : "");
    }
    // Limitar decimales a 2 dígitos
    if (decimalSplit.length > 1 && decimalSplit[1].length > 2) {
      value = decimalSplit[0] + "." + decimalSplit[1].substring(0, 2);
    }
    // Actualizar el valor
    this.value = value;
  });

  inputPrecio.addEventListener("blur", function (e) {
    // Formatear el valor al salir del campo
    let value = this.value;
    if (value === "") return;
    // Si no tiene punto, agregar .00
    if (value.indexOf(".") === -1) {
      value += ".00";
    }
    // Si tiene punto pero no decimales, agregar 00
    else if (value.split(".")[1].length === 0) {
      value += "00";
    }
    // Si tiene solo 1 decimal, agregar 0
    else if (value.split(".")[1].length === 1) {
      value += "0";
    }
    // Actualizamos el valor del input
    this.value = value;
  });

//FUNCIONALIDAD FILTROS
    const inputBuscarTerreno = document.getElementById("inputBuscarTerreno");
    const filtroCampoTerreno = document.getElementById("filtroTerrenos");
    const filtroEstadoTerreno = document.getElementById("filtroTerrenosEstado");

    // Función de filtrado
    function filtrarTerrenos() {
        const texto = inputBuscarTerreno.value.trim().toLowerCase();
        const campo = filtroCampoTerreno.value;
        const estado = filtroEstadoTerreno.value.toLowerCase();

        // Iteramos sobre las filas de la tabla
        document.querySelectorAll("#tablaTerrenos tbody tr").forEach(fila => {
            const cols = fila.children;

            // Extraemos el estado del terreno
            const estadoTexto = cols[5].querySelector("span") ?
                cols[5].querySelector("span").textContent.trim().toLowerCase().replace(/\s+/g, '') : "";

            const data = {
                proyecto: cols[1].textContent.toLowerCase(),
                etapa: cols[2].textContent.toLowerCase(),
                unidad: cols[9].textContent.toLowerCase(),
                estado: estadoTexto
            };

            // Filtro por campo específico (Proyecto, Etapa, o Unidad)
            const coincideCampo = campo
                ? data[campo]?.includes(texto)
                : Object.values(data).some(val => val.includes(texto));

            // Filtro por estado
            const coincideEstado = estado === "todos" || data.estado === estado;

            // Mostrar u ocultar la fila según los filtros
            fila.style.display = (coincideCampo && coincideEstado) ? "" : "none";
        });
    }

    // Evento 'input' para búsqueda
    inputBuscarTerreno.addEventListener("input", function () {
        console.log("Evento 'input' activado en búsqueda de terreno");
        filtrarTerrenos();
    });

    // Evento 'change' para el filtro de campo (Proyecto, Etapa, o Unidad)
    filtroCampoTerreno.addEventListener("change", function () {
        console.log("Evento 'change' activado en campo de filtro");
        inputBuscarTerreno.value = ""; // Limpiar búsqueda cuando se cambia el filtro
        filtrarTerrenos();
    });

    // Evento 'change' para el filtro de estado (Disponible, En Proceso, etc.)
    filtroEstadoTerreno.addEventListener("change", function () {
        console.log("Evento 'change' activado en filtro de estado");
        filtrarTerrenos();
    });
  
  btnGuardarNuevoTerreno.addEventListener("click", function (e) {
    e.preventDefault(); // Prevenir el envío del formulario automáticamente
    // Mostrar SweetAlert de confirmación
    Swal.fire({
        title: "¿Estás seguro?",
        text: "¡Confirmar para agregar el nuevo terreno!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
    }).then(async (result) => {
        if (result.isConfirmed) {
            const form = document.getElementById("formAgregarTerrenoNuevo");
            const formData = new FormData(form);

            try {
                const response = await fetch("/insertar_terreno", {
                    method: "POST",
                    body: formData,
                    headers: {
                        "X-Requested-With": "XMLHttpRequest",
                    },
                });

                const result = await response.json();
                
                if (result.success) {
                    // Definir las clases de estado en JavaScript
                    const clasesEstado = {
                        'Disponible': 'disponible',
                        'Vendido': 'vendido',
                        'Reservado': 'reservado',
                        'EnProceso': 'enproceso',
                        'NoDisponible': 'nodisponible',
                        'Eliminado': 'eliminado'
                    };

                    // Obtener la clase correspondiente al estado
                    const estadoClase = clasesEstado[result.terreno.estado] || 'disponible'; // Valor por defecto 'disponible'

                    // Formatear el área y precio a 2 decimales
                    const areaFormateada = parseFloat(result.terreno.area).toFixed(2);
                    const precioFormateado = parseFloat(result.terreno.precio).toFixed(2);

                    // Agregar el nuevo terreno dinámicamente en la tabla
                    const newRow = document.createElement("tr");
                    newRow.innerHTML = `
                        <td>${result.terreno.id_terreno}</td>
                        <td>${result.terreno.nombre_proyecto}</td>
                        <td>${result.terreno.etapa}</td>
                        <td>${areaFormateada}</td>
                        <td>${precioFormateado}</td>
                        <td>
                            <span class="estado-terreno ${estadoClase}">
                                ${result.terreno.estado}
                            </span>
                        </td>
                        <td>${result.terreno.tipo}</td>
                        <td>${result.terreno.manzana}</td>
                        <td>${result.terreno.lote}</td>
                        <td>${result.terreno.codigo_unidad}</td>
                        <td>
                            <button class="btn-editar-terreno" data-id="${result.terreno.id_terreno}">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button class="btn-eliminar-terreno" data-id="${result.terreno.id_terreno}">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </td>
                    `;
                    document.querySelector("#tablaTerrenos tbody").appendChild(newRow);
                    Swal.fire("Agregado!", "El terreno ha sido agregado correctamente.", "success");
                    form.reset();
                    closeModal(); // Cerrar el modal después de agregar
                } else {
                    // Mostrar error con el mensaje recibido del backend
                    Swal.fire("Error!", result.message, "error");
                }
            } catch (error) {
                // En caso de error en la conexión
                Swal.fire("Error!", "Hubo un problema con la conexión: " + error.message, "error");
            }
        }
    });
  });
  overlay.addEventListener("click", closeModal);
}
