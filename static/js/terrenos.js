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
              paginarTablaTerrenos();
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
  const inputLote = document.getElementById("inputLote");
  const inputArea = document.getElementById("inputArea");
  const inputPrecio = document.getElementById("inputPrecio");
  const selectTipoTerreno = document.getElementById('selectTipoTerreno');
  let etapasPorProyecto = {};

    const preciosDict = (() => {
    try {
      return JSON.parse(document.getElementById("selectProyecto").getAttribute("data-precios"));
    } catch (e) {
      console.error("No se pudo cargar preciosDict:", e);
      return {};
    }
  })();

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

// Función para realizar el cálculo del precio
    function calcularPrecio() {
        const tipoTerreno = selectTipoTerreno.value;  // Obtener el tipo de terreno seleccionado
        const area = parseFloat(inputArea.value);  // Obtener el área ingresada

        if (!tipoTerreno || isNaN(area) || area <= 0) {
            // Si el tipo de terreno no está seleccionado o el área no es válida, no hacer nada
            inputPrecio.value = '';
            return;
        }

        const proyectoId = selectProyecto.value;  // Obtener el proyecto seleccionado
        if (!proyectoId || !preciosDict[proyectoId]) {
            inputPrecio.value = '';
            return;
        }

        // Obtener el precio base según el tipo de terreno
        const precioBase = preciosDict[proyectoId][tipoTerreno.toLowerCase()] || 0;

        // Calcular el precio total
        const precioTotal = precioBase * area;

        // Mostrar el precio calculado en el input de precio
        inputPrecio.value = `${precioTotal.toFixed(2)}`;
    }

// Eventos de cambio
    selectProyecto.addEventListener('change', calcularPrecio);
    selectTipoTerreno.addEventListener('change', calcularPrecio);
    inputArea.addEventListener('input', calcularPrecio);
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
      paginarTablaTerrenos();
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

  // === GUARDAR NUEVO TERRENO ===  
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
                    const tbody = document.querySelector("#tablaTerrenos tbody");
                    const newRow = document.createElement("tr");
                    newRow.setAttribute("data-id", result.terreno.id_terreno);
                    newRow.setAttribute("data-estado", result.terreno.estado.toLowerCase().replace(/\s/g, ''));

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

                    tbody.appendChild(newRow);
                    activarBotonesEditar();
                    paginarTablaTerrenos();  // <-- necesario para que los nuevos botones funcionen
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

  
    // === MODAL DE EDICIÓN ===
  const modalEditar = document.getElementById("modalEditarTerreno");
  function cerrarModalEditar() {
      modalEditar.classList.remove("active");
      overlay.classList.remove("active");
    }

    document.getElementById("btnCancelarEditarTerreno").addEventListener("click", cerrarModalEditar);
    document.getElementById("btnCancelarEditarTerrenoFooter").addEventListener("click", cerrarModalEditar);

  function handleEditarTerreno(e) {
    const btn = e.currentTarget;
    const fila = btn.closest("tr");
    const id = fila.dataset.id;

    document.getElementById("idTerreno").value = id;
    document.getElementById("areaEditar").value = parseFloat(fila.children[3].textContent.trim());
    document.getElementById("precioEditar").value = parseFloat(fila.children[4].textContent.trim());

    const estadoTexto = fila.children[5].innerText.trim().replace(/\s+/g, '');
    document.getElementById("estadoTerreno").value = estadoTexto;
    document.getElementById("nombreProyectoEditar").textContent = fila.children[1].textContent.trim();
    document.getElementById("codigoUnidadMostrar").textContent = fila.children[9].textContent.trim();
    document.getElementById("tipoTerrenoEditar").value = fila.children[6].textContent.trim();
    document.getElementById("manzanaEditar").value = fila.children[7].textContent.trim();
    document.getElementById("loteEditar").value = fila.children[8].textContent.trim();
    document.getElementById("codigo_unidad").value = fila.children[9].textContent.trim();

    // Obtener ID del proyecto desde data-id-proyecto
    const proyectoId = fila.children[1].getAttribute("data-id-proyecto");
    document.getElementById("id_proyecto_editar").value = proyectoId;

    if (proyectoId && etapasPorProyecto.hasOwnProperty(proyectoId)) {
      const maxEtapas = etapasPorProyecto[proyectoId];
      const inputEtapaEditar = document.getElementById('etapaEditar');
      inputEtapaEditar.setAttribute('placeholder', 'Máximo de etapas: ' + maxEtapas);
      inputEtapaEditar.setAttribute('max', maxEtapas);
      inputEtapaEditar.setAttribute('min', 1);
      inputEtapaEditar.value = ''; // opcional
    }

    const badge = document.getElementById("estadoProyectoBadge");
    badge.textContent = "Estado: " + estadoTexto.replace(/([A-Z])/g, ' $1').trim();;

    // Limpia clases anteriores
    badge.className = "badge-estado";

    // Asigna clase según estado
    const estadoClass = {
      disponible: "badge-disponible",
      reservado: "badge-reservado",
      vendido: "badge-vendido",
      enproceso: "badge-enproceso",
      nodisponible: "badge-nodisponible"
    }[estadoTexto.toLowerCase()] || "";

    if (estadoClass) {
      badge.classList.add(estadoClass);
    }

    modalEditar.classList.add("active");
    overlay.classList.add("active");
  }
  // Validación en tiempo real del campo etapaEditar
  const inputEtapaEditar = document.getElementById('etapaEditar');
  inputEtapaEditar.addEventListener('input', function () {
    let etapaValue = this.value;

    const proyectoId = document.getElementById('id_proyecto_editar').value;
    const maxEtapas = etapasPorProyecto[proyectoId];

    etapaValue = etapaValue.replace(/[^0-9]/g, "");

    if (etapaValue.startsWith('0')) {
      etapaValue = etapaValue.slice(1);
    }

    if (etapaValue.length > 2) {
      etapaValue = etapaValue.slice(0, 2);
    }

    if (parseInt(etapaValue) > maxEtapas) {
      etapaValue = maxEtapas.toString();
    }

    this.value = etapaValue;
  });

  function activarBotonesEditar() {
    document.querySelectorAll(".btn-editar-terreno").forEach((btn) => {
      btn.removeEventListener("click", handleEditarTerreno);
      btn.addEventListener("click", handleEditarTerreno);
    });
  }

  const loteEditar = document.getElementById('loteEditar');
  const areaEditar = document.getElementById('areaEditar');
  const precioEditar = document.getElementById('precioEditar');
  
  loteEditar.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "").slice(0, 3);
  });


  areaEditar.addEventListener("input", function () {
    let value = this.value;

    // Solo permitir números y un punto
    value = value.replace(/[^\d.]/g, "");

    // Evitar más de un punto decimal
    const parts = value.split(".");
    if (parts.length > 2) {
      value = parts[0] + "." + parts[1]; // eliminar puntos adicionales
    }

    // Limitar parte entera a 6 dígitos
    if (parts[0].length > 6) {
      parts[0] = parts[0].slice(0, 6);
    }

    // Limitar parte decimal a 2 dígitos
    if (parts[1]) {
      parts[1] = parts[1].slice(0, 2);
    }

    this.value = parts.join(".");
  });

  areaEditar.addEventListener("blur", function (e) {
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

  precioEditar.addEventListener("input", function () {
    let value = this.value;

    value = value.replace(/[^\d.]/g, "");

    const parts = value.split(".");
    if (parts.length > 2) {
      value = parts[0] + "." + parts[1];
    }

    if (parts[0].length > 10) {
      parts[0] = parts[0].slice(0, 10);
    }

    if (parts[1]) {
      parts[1] = parts[1].slice(0, 2);
    }

    this.value = parts.join(".");
  });

  precioEditar.addEventListener("blur", function (e) {
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

  function calcularPrecioEditar() {
  const tipo = document.getElementById("tipoTerrenoEditar").value;
  const area = parseFloat(areaEditar.value);
  const proyectoId = document.getElementById("id_proyecto_editar").value;

  if (!tipo || isNaN(area) || !preciosDict[proyectoId]) {
    precioEditar.value = "";
    return;
  }

  const base = preciosDict[proyectoId][tipo.toLowerCase()] || 0;
  const total = base * area;
  precioEditar.value = total.toFixed(2);
}

  areaEditar.addEventListener("input", calcularPrecioEditar);
  document.getElementById("tipoTerrenoEditar").addEventListener("change", calcularPrecioEditar);

  calcularPrecioEditar();  
  activarBotonesEditar();

    // === GUARDAR CAMBIOS DE EDICIÓN ===
  const btnEditarTerreno = document.getElementById("btnEditarTerreno");
  btnEditarTerreno?.addEventListener("click", async function (e) {
    e.preventDefault();

    const form = document.getElementById("formEditarTerreno");
    const formData = new FormData(form);

    const idTerreno = formData.get("id_terreno");
    const manzana = formData.get("manzana").trim();
    const lote = formData.get("lote").trim();
    const codigoUnidad = `${manzana} - ${lote}`;

    const confirm = await Swal.fire({
      title: "¿Confirmar edición?",
      text: "Se actualizarán los datos del terreno.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (!confirm.isConfirmed) return;

    try {
      const response = await fetch("/actualizar_terreno", {
        method: "POST",
        body: formData,
        headers: {
          "X-Requested-With": "XMLHttpRequest"
        }
      });

      const result = await response.json();

      if (result.success) {
        Swal.fire("Actualizado", "El terreno se actualizó correctamente.", "success");

        const fila = document.querySelector(`#tablaTerrenos tr[data-id='${idTerreno}']`);
        if (fila) {
          const celdas = fila.querySelectorAll("td");

          // Actualizar columnas por posición según tu tabla
          celdas[2].textContent = formData.get("etapa");
          celdas[3].textContent = formData.get("area");
          celdas[4].textContent = formatearMoneda(formData.get("precio"));

          const estado = formData.get("estadoTerreno");
          const claseEstado = estado.toLowerCase().replace(/\s+/g, '');

          celdas[5].innerHTML = `<span class="estado-terreno ${claseEstado}">${formatearEstado(estado)}</span>`;

          celdas[6].textContent = formData.get("tipoTerreno");
          celdas[7].textContent = manzana;
          celdas[8].textContent = lote;
          celdas[9].textContent = codigoUnidad;
        }

        // Cierra el modal
        document.getElementById("modalEditarTerreno")?.classList.remove("active");
        document.getElementById("modalOverlay")?.classList.remove("activo");

      } else {
        Swal.fire("Error", result.message || "No se pudo actualizar el terreno.", "error");
      }

    } catch (error) {
      Swal.fire("Error de conexión", "Fallo en la solicitud: " + error.message, "error");
    }
  });

  // Funciones auxiliares
  function formatearMoneda(valor) {
    const numero = parseFloat(valor);
    return isNaN(numero) ? valor : numero.toFixed(2);
  }

  function formatearEstado(estado) {
    switch (estado) {
      case "Disponible": return "Disponible";
      case "Vendido": return "Vendido";
      case "Reservado": return "Reservado";
      case "EnProceso": return "En Proceso";
      case "NoDisponible": return "No Disponible";
      case "Eliminado": return "Eliminado";
      default: return estado;
    }
  }
  let filasPorPagina = 10;
  let paginaActual = 1;
  function paginarTablaTerrenos() {
    const filas = Array.from(document.querySelectorAll('#tablaTerrenos tbody tr'))
      .filter(fila => fila.style.display !== 'none');
    const totalPaginas = Math.ceil(filas.length / filasPorPagina);
    const paginacion = document.getElementById('paginacion');

    function mostrarPagina(pagina) {
      paginaActual = pagina;
      const inicio = (pagina - 1) * filasPorPagina;
      const fin = inicio + filasPorPagina;

      // Ocultar todas las filas primero
      document.querySelectorAll('#tablaTerrenos tbody tr').forEach(fila => fila.style.display = 'none');

      // Mostrar solo las filas correspondientes a la página actual
      filas.forEach((fila, i) => {
        if (i >= inicio && i < fin) fila.style.display = '';
      });

      // Redibujar la paginación
      paginacion.innerHTML = '';
      for (let i = 1; i <= totalPaginas; i++) {
        const boton = document.createElement('button');
        boton.textContent = i;
        if (i === pagina) boton.classList.add('activo');
        boton.addEventListener('click', () => mostrarPagina(i));
        paginacion.appendChild(boton);
      }
    }

    if (totalPaginas > 0) {
      mostrarPagina(paginaActual);
    } else {
      paginacion.innerHTML = '';
    }
  }
  paginarTablaTerrenos();
  overlay.addEventListener("click", closeModal);
}
