// Función para inicializar el modal de precios
function initModalPreciosTerreno() {
  console.log("Inicializando modal de precios por tipo de terreno...")

  // Elementos del DOM
  const modalBackdrop = document.getElementById("proy-modalBackdrop")
  const btnActualizarPrecios = document.createElement("button")
  btnActualizarPrecios.id = "proy-btnActualizarPrecios"
  btnActualizarPrecios.className = "proy-btn-nuevo"
  btnActualizarPrecios.textContent = "Actualizar Precios"

  // Insertar botón después del título en el header
  const headerTitle = document.querySelector(".proy-header h2")
  if (headerTitle && !document.getElementById("proy-btnActualizarPrecios")) {
    headerTitle.parentNode.insertBefore(btnActualizarPrecios, headerTitle.nextSibling)
  }

  const btnGuardarPrecios = document.getElementById("proy-btnGuardarPrecios")

  // Inputs de precios
  const precioParque = document.getElementById("proy-precioParque")
  const precioEsquina = document.getElementById("proy-precioEsquina")
  const precioAvenida = document.getElementById("proy-precioAvenida")
  const precioCalle = document.getElementById("proy-precioCalle")
  const precioEsquinaParque = document.getElementById("proy-precioEsquinaParque")

  // Elementos de resumen
  const resumenParque = document.getElementById("proy-resumenParque")
  const resumenEsquina = document.getElementById("proy-resumenEsquina")
  const resumenAvenida = document.getElementById("proy-resumenAvenida")
  const resumenCalle = document.getElementById("proy-resumenCalle")
  const resumenEsquinaParque = document.getElementById("proy-resumenEsquinaParque")

  // Función para abrir modal
  function openModal(modalId) {
    const modal = document.getElementById(modalId)
    if (modal) {
      modal.style.display = "block"
      modalBackdrop.style.display = "block"
      document.body.style.overflow = "hidden"
      console.log(`Modal ${modalId} abierto`)
    } else {
      console.error(`Modal ${modalId} no encontrado`)
    }
  }

  // Función para cerrar modal
  function closeModal(modalId) {
    const modal = document.getElementById(modalId)
    if (modal) {
      modal.style.display = "none"

      // Verificar si hay otros modales abiertos
      const openModals = document.querySelectorAll('.proy-modal[style*="display: block"]')
      if (openModals.length === 0) {
        modalBackdrop.style.display = "none"
        document.body.style.overflow = ""
      }
      console.log(`Modal ${modalId} cerrado`)
    }
  }

  // Función para formatear precio
  function formatPrice(value) {
    if (!value || isNaN(value)) return "S/ 0.00"
    return `S/ ${Number.parseFloat(value).toFixed(2)}`
  }

  // Función para actualizar resumen
  function updateResumen() {
    if (resumenParque) resumenParque.textContent = formatPrice(precioParque?.value)
    if (resumenEsquinaParque) resumenEsquinaParque.textContent = formatPrice(precioEsquinaParque?.value)
    if (resumenEsquina) resumenEsquina.textContent = formatPrice(precioEsquina?.value)
    if (resumenAvenida) resumenAvenida.textContent = formatPrice(precioAvenida?.value)
    if (resumenCalle) resumenCalle.textContent = formatPrice(precioCalle?.value)
  }

  // Función para validar precios
  function validatePrices() {
    const inputs = [precioParque, precioEsquinaParque, precioEsquina, precioAvenida, precioCalle].filter(
      (input) => input,
    )
    let isValid = true

    inputs.forEach((input) => {
      const value = Number.parseFloat(input.value)
      if (!input.value || isNaN(value) || value < 0) {
        input.style.borderColor = "#ec4332"
        isValid = false
      } else {
        input.style.borderColor = ""
      }
    })

    return isValid
  }

  // Función para guardar precios en localStorage
  function savePrices() {
    const precios = {
      parque: precioParque?.value || "150.00",
      esquinaParque: precioEsquinaParque?.value || "180.00",
      esquina: precioEsquina?.value || "120.00",
      avenida: precioAvenida?.value || "100.00",
      calle: precioCalle?.value || "80.00",
      timestamp: new Date().toISOString(),
    }

    localStorage.setItem("proyPreciosTerreno", JSON.stringify(precios))
    console.log("Precios guardados:", precios)
    return precios
  }

  // Función para cargar precios desde localStorage
  function loadPrices() {
    const savedPrices = localStorage.getItem("proyPreciosTerreno")
    if (savedPrices) {
      try {
        const precios = JSON.parse(savedPrices)
        if (precioParque) precioParque.value = precios.parque || "150.00"
        if (precioEsquinaParque) precioEsquinaParque.value = precios.esquinaParque || "180.00"
        if (precioEsquina) precioEsquina.value = precios.esquina || "120.00"
        if (precioAvenida) precioAvenida.value = precios.avenida || "100.00"
        if (precioCalle) precioCalle.value = precios.calle || "80.00"
        updateResumen()
        console.log("Precios cargados:", precios)
      } catch (e) {
        console.error("Error al cargar precios:", e)
      }
    } else {
      // Valores por defecto
      if (precioParque) precioParque.value = "150.00"
      if (precioEsquinaParque) precioEsquinaParque.value = "180.00"
      if (precioEsquina) precioEsquina.value = "120.00"
      if (precioAvenida) precioAvenida.value = "100.00"
      if (precioCalle) precioCalle.value = "80.00"
      updateResumen()
    }
  }

  // Event listener para abrir modal de precios
  if (btnActualizarPrecios) {
    btnActualizarPrecios.addEventListener("click", () => {
      openModal("proy-modalActualizarPrecios")
      loadPrices()
    })
  }
  // Event listeners para actualizar resumen en tiempo real
  ;[precioParque, precioEsquinaParque, precioEsquina, precioAvenida, precioCalle]
    .filter((input) => input)
    .forEach((input) => {
      input.addEventListener("input", updateResumen)
      input.addEventListener("blur", function () {
        // Formatear el valor cuando pierde el foco
        if (this.value && !isNaN(this.value)) {
          this.value = Number.parseFloat(this.value).toFixed(2)
          updateResumen()
        }
      })
    })

  // Event listener para guardar precios
  if (btnGuardarPrecios) {
    btnGuardarPrecios.addEventListener("click", () => {
      if (validatePrices()) {
        const precios = savePrices()

        // Actualizar precio por defecto en el formulario de nuevo proyecto
        const precioTerrenoInput = document.getElementById("proy-precioTerreno")
        if (precioTerrenoInput) {
          precioTerrenoInput.value = `S/ ${precios.calle}`
        }

        closeModal("proy-modalActualizarPrecios")
        openModal("proy-modalExitoPrecios")

        // Auto cerrar mensaje de éxito después de 3 segundos
        setTimeout(() => {
          closeModal("proy-modalExitoPrecios")
        }, 3000)
      } else {
        alert("Por favor, complete todos los campos con valores válidos.")
      }
    })
  }

  // Event listeners para botones de cerrar modal
  const closeButtons = document.querySelectorAll(".proy-close[data-modal]")
  closeButtons.forEach((button) => {
    if (!button.hasAttribute("data-proy-listener-added")) {
      button.addEventListener("click", function () {
        const modalId = this.getAttribute("data-modal")
        closeModal(modalId)
      })
      button.setAttribute("data-proy-listener-added", "true")
    }
  })

  // Event listeners para botones de cancelar
  const cancelButtons = document.querySelectorAll(".proy-btn-secondary[data-modal]")
  cancelButtons.forEach((button) => {
    if (!button.hasAttribute("data-proy-listener-added")) {
      button.addEventListener("click", function () {
        const modalId = this.getAttribute("data-modal")
        closeModal(modalId)
      })
      button.setAttribute("data-proy-listener-added", "true")
    }
  })

  console.log("Modal de precios por tipo de terreno inicializado correctamente")
}

// Función para obtener los precios actuales
function getPreciosTerreno() {
  const savedPrices = localStorage.getItem("proyPreciosTerreno")
  if (savedPrices) {
    try {
      return JSON.parse(savedPrices)
    } catch (e) {
      console.error("Error al obtener precios:", e)
    }
  }

  // Valores por defecto
  return {
    parque: "150.00",
    esquinaParque: "180.00",
    esquina: "120.00",
    avenida: "100.00",
    calle: "80.00",
  }
}

// Función para aplicar precios según el tipo de terreno
function aplicarPrecioSegunTipo(tipo) {
  const precios = getPreciosTerreno()
  switch (tipo.toLowerCase()) {
    case "parque":
      return precios.parque
    case "esquina-parque":
    case "esquinaparque":
      return precios.esquinaParque
    case "esquina":
      return precios.esquina
    case "avenida":
      return precios.avenida
    case "calle":
    default:
      return precios.calle
  }
}

// Integrar con el sistema existente
function integrarModalPrecios() {
  // Agregar el modal al DOM si no existe
  if (!document.getElementById("proy-modalActualizarPrecios")) {
    fetch("modal-actualizar-precios.html")
      .then((response) => response.text())
      .then((html) => {
        // Insertar el HTML del modal antes del backdrop
        const backdrop = document.getElementById("proy-modalBackdrop")
        if (backdrop) {
          backdrop.insertAdjacentHTML("beforebegin", html)
          initModalPreciosTerreno()
        }
      })
      .catch((error) => {
        console.error("Error al cargar el modal:", error)
        // Alternativa: crear el modal manualmente
        crearModalManualmente()
      })
  } else {
    initModalPreciosTerreno()
  }
}

// Crear el modal manualmente si no se puede cargar desde un archivo
function crearModalManualmente() {
  const modalHTML = `
    <!-- Modal Actualizar Precios por Tipo de Terreno -->
    <div id="proy-modalActualizarPrecios" class="proy-modal">
        <div class="proy-modal-content">
            <div class="proy-modal-header">
                <div class="proy-modal-title">
                    <i class="fas fa-dollar-sign"></i>
                    <h3>Actualizar Precios por Tipo de Terreno</h3>
                </div>
                <span class="proy-close" data-modal="proy-modalActualizarPrecios">&times;</span>
            </div>
            <div class="proy-modal-subtitle">
                Configura los precios base para cada tipo de terreno. Estos precios se aplicarán como referencia para todos los terrenos del proyecto.
            </div>
            <div class="proy-modal-body">
                <div class="proy-alert proy-alert-info">
                    <i class="fas fa-info-circle"></i>
                    <span>Los precios se actualizarán para todos los terrenos del tipo seleccionado. Puedes ajustar precios individuales más tarde en la sección de Terrenos.</span>
                </div>

                <form id="proy-formActualizarPrecios">
                    <div class="proy-precios-grid">
                        <!-- Precio Parque -->
                        <div class="proy-precio-card proy-precio-parque">
                            <div class="proy-precio-header">
                                <div class="proy-precio-icon">
                                    <i class="fas fa-tree"></i>
                                </div>
                                <h4>Parque</h4>
                            </div>
                            <div class="proy-form-group">
                                <label for="proy-precioParque">Precio por m²*</label>
                                <div class="proy-input-currency">
                                    <span class="proy-currency-symbol">S/</span>
                                    <input type="number" id="proy-precioParque" placeholder="150.00" step="0.01" min="0" required>
                                </div>
                            </div>
                            <div class="proy-precio-description">
                                Terrenos con vista o acceso directo a parques y áreas verdes
                            </div>
                        </div>

                        <!-- Precio Esquina Parque -->
                        <div class="proy-precio-card proy-precio-esquina-parque">
                            <div class="proy-precio-header">
                                <div class="proy-precio-icon">
                                    <i class="fas fa-tree"></i>
                                    <i class="fas fa-map-marker-alt"></i>
                                </div>
                                <h4>Esquina Parque</h4>
                            </div>
                            <div class="proy-form-group">
                                <label for="proy-precioEsquinaParque">Precio por m²*</label>
                                <div class="proy-input-currency">
                                    <span class="proy-currency-symbol">S/</span>
                                    <input type="number" id="proy-precioEsquinaParque" placeholder="180.00" step="0.01" min="0" required>
                                </div>
                            </div>
                            <div class="proy-precio-description">
                                Terrenos en esquina con vista o acceso directo a parques y áreas verdes
                            </div>
                        </div>

                        <!-- Precio Esquina -->
                        <div class="proy-precio-card proy-precio-esquina">
                            <div class="proy-precio-header">
                                <div class="proy-precio-icon">
                                    <i class="fas fa-map-marker-alt"></i>
                                </div>
                                <h4>Esquina</h4>
                            </div>
                            <div class="proy-form-group">
                                <label for="proy-precioEsquina">Precio por m²*</label>
                                <div class="proy-input-currency">
                                    <span class="proy-currency-symbol">S/</span>
                                    <input type="number" id="proy-precioEsquina" placeholder="120.00" step="0.01" min="0" required>
                                </div>
                            </div>
                            <div class="proy-precio-description">
                                Terrenos ubicados en esquinas con doble frente
                            </div>
                        </div>

                        <!-- Precio Avenida -->
                        <div class="proy-precio-card proy-precio-avenida">
                            <div class="proy-precio-header">
                                <div class="proy-precio-icon">
                                    <i class="fas fa-road"></i>
                                </div>
                                <h4>Avenida</h4>
                            </div>
                            <div class="proy-form-group">
                                <label for="proy-precioAvenida">Precio por m²*</label>
                                <div class="proy-input-currency">
                                    <span class="proy-currency-symbol">S/</span>
                                    <input type="number" id="proy-precioAvenida" placeholder="100.00" step="0.01" min="0" required>
                                </div>
                            </div>
                            <div class="proy-precio-description">
                                Terrenos con frente a avenidas principales
                            </div>
                        </div>

                        <!-- Precio Calle -->
                        <div class="proy-precio-card proy-precio-calle">
                            <div class="proy-precio-header">
                                <div class="proy-precio-icon">
                                    <i class="fas fa-home"></i>
                                </div>
                                <h4>Calle</h4>
                            </div>
                            <div class="proy-form-group">
                                <label for="proy-precioCalle">Precio por m²*</label>
                                <div class="proy-input-currency">
                                    <span class="proy-currency-symbol">S/</span>
                                    <input type="number" id="proy-precioCalle" placeholder="80.00" step="0.01" min="0" required>
                                </div>
                            </div>
                            <div class="proy-precio-description">
                                Terrenos estándar con frente a calles internas
                            </div>
                        </div>
                    </div>

                    <!-- Resumen de precios -->
                    <div class="proy-precio-resumen">
                        <h4><i class="fas fa-calculator"></i> Resumen de Precios</h4>
                        <div class="proy-resumen-grid">
                            <div class="proy-resumen-item">
                                <span class="proy-resumen-label">Parque:</span>
                                <span class="proy-resumen-value" id="proy-resumenParque">S/ 0.00</span>
                            </div>
                            <div class="proy-resumen-item">
                                <span class="proy-resumen-label">Esquina Parque:</span>
                                <span class="proy-resumen-value" id="proy-resumenEsquinaParque">S/ 0.00</span>
                            </div>
                            <div class="proy-resumen-item">
                                <span class="proy-resumen-label">Esquina:</span>
                                <span class="proy-resumen-value" id="proy-resumenEsquina">S/ 0.00</span>
                            </div>
                            <div class="proy-resumen-item">
                                <span class="proy-resumen-label">Avenida:</span>
                                <span class="proy-resumen-value" id="proy-resumenAvenida">S/ 0.00</span>
                            </div>
                            <div class="proy-resumen-item">
                                <span class="proy-resumen-label">Calle:</span>
                                <span class="proy-resumen-value" id="proy-resumenCalle">S/ 0.00</span>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="proy-modal-footer">
                <button type="button" class="proy-btn-secondary" data-modal="proy-modalActualizarPrecios">Cancelar</button>
                <button type="button" class="proy-btn-primary" id="proy-btnGuardarPrecios">
                    <i class="fas fa-save"></i>
                    Guardar Precios
                </button>
            </div>
        </div>
    </div>

    <!-- Modal Éxito Precios -->
    <div id="proy-modalExitoPrecios" class="proy-modal">
        <div class="proy-modal-content proy-modal-sm">
            <div class="proy-modal-header proy-success">
                <div class="proy-modal-title">
                    <i class="fas fa-check-circle"></i>
                    <h3>¡Precios actualizados exitosamente!</h3>
                </div>
                <span class="proy-close" data-modal="proy-modalExitoPrecios">&times;</span>
            </div>
            <div class="proy-modal-body proy-text-center">
                <p>Los precios por tipo de terreno han sido configurados correctamente. Ahora puedes proceder a configurar las etapas del proyecto.</p>
            </div>
        </div>
    </div>
    `

  // Insertar el HTML del modal antes del backdrop
  const backdrop = document.getElementById("proy-modalBackdrop")
  if (backdrop) {
    backdrop.insertAdjacentHTML("beforebegin", modalHTML)
    initModalPreciosTerreno()
  }
}

// Agregar estilos CSS para el modal
function agregarEstilosCSS() {
  const styleElement = document.createElement("style")
  styleElement.textContent = `
    /* Variables de colores para tipos de terreno */
    :root {
        --proy-parque-color: #4CAF50;
        --proy-esquina-color: #FF9800;
        --proy-avenida-color: #2196F3;
        --proy-calle-color: #9C27B0;
    }

    /* Estilos para el grid de precios */
    .proy-precios-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
    }

    .proy-precio-card {
        background: #ffffff;
        border: 2px solid #e0e0e0;
        border-radius: 12px;
        padding: 20px;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .proy-precio-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
    }

    .proy-precio-parque::before {
        background: var(--proy-parque-color);
    }

    .proy-precio-esquina::before {
        background: var(--proy-esquina-color);
    }

    .proy-precio-avenida::before {
        background: var(--proy-avenida-color);
    }

    .proy-precio-calle::before {
        background: var(--proy-calle-color);
    }

    .proy-precio-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .proy-precio-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 15px;
    }

    .proy-precio-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        font-size: 18px;
    }

    .proy-precio-parque .proy-precio-icon {
        background: var(--proy-parque-color);
    }

    .proy-precio-esquina .proy-precio-icon {
        background: var(--proy-esquina-color);
    }

    .proy-precio-avenida .proy-precio-icon {
        background: var(--proy-avenida-color);
    }

    .proy-precio-calle .proy-precio-icon {
        background: var(--proy-calle-color);
    }

    .proy-input-currency {
        position: relative;
        display: flex;
        align-items: center;
    }

    .proy-currency-symbol {
        position: absolute;
        left: 12px;
        font-weight: 600;
        color: #666666;
        z-index: 1;
    }

    .proy-input-currency input {
        padding-left: 35px;
        font-weight: 600;
        font-size: 16px;
    }

    .proy-precio-description {
        font-size: 12px;
        color: #666666;
        line-height: 1.4;
        margin-top: 10px;
    }

    /* Resumen de Precios */
    .proy-precio-resumen {
        background: #f8f9fa;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 20px;
        margin-top: 20px;
    }

    .proy-precio-resumen h4 {
        margin: 0 0 15px 0;
        font-size: 16px;
        font-weight: 600;
        color: #333333;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .proy-resumen-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
    }

    .proy-resumen-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 15px;
        background: #ffffff;
        border-radius: 6px;
        border: 1px solid #e0e0e0;
    }

    .proy-resumen-label {
        font-weight: 500;
        color: #666666;
    }

    .proy-resumen-value {
        font-weight: 600;
        color: #333333;
        font-size: 16px;
    }

    /* Responsive */
    @media (max-width: 768px) {
        .proy-precios-grid {
            grid-template-columns: 1fr;
        }
        
        .proy-resumen-grid {
            grid-template-columns: 1fr;
        }
    }

    @media (max-width: 480px) {
        .proy-precio-card {
            padding: 15px;
        }
        
        .proy-precio-header {
            flex-direction: column;
            text-align: center;
            gap: 8px;
        }
    }
    `

  document.head.appendChild(styleElement)
}

// Inicializar todo cuando el DOM esté cargado
document.addEventListener("DOMContentLoaded", () => {
  agregarEstilosCSS()
  integrarModalPrecios()

  // Modificar el flujo existente para incluir el modal de precios
  const btnSiguienteEtapa = document.getElementById("proy-btnSiguienteEtapa")
  if (btnSiguienteEtapa) {
    const originalClickHandler = btnSiguienteEtapa.onclick
    btnSiguienteEtapa.onclick = (e) => {
      e.preventDefault()

      // Validar formulario principal
      const form = document.getElementById("proy-formNuevoProyecto")
      if (!form.checkValidity()) {
        form.reportValidity()
        return
      }

      // Abrir modal de precios antes de continuar con las etapas
      window.closeModal("proy-modalNuevoProyecto")
      window.openModal("proy-modalActualizarPrecios")
      window.loadPrices()
    }
  }
})

// Exponer funciones globalmente para integración
window.getPreciosTerreno = getPreciosTerreno
window.aplicarPrecioSegunTipo = aplicarPrecioSegunTipo
window.openModal = (modalId) => {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.style.display = "block"
    document.getElementById("proy-modalBackdrop").style.display = "block"
    document.body.style.overflow = "hidden"
    console.log(`Modal ${modalId} abierto`)
  } else {
    console.error(`Modal ${modalId} no encontrado`)
  }
}
window.closeModal = (modalId) => {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.style.display = "none"

    // Verificar si hay otros modales abiertos
    const openModals = document.querySelectorAll('.proy-modal[style*="display: block"]')
    if (openModals.length === 0) {
      document.getElementById("proy-modalBackdrop").style.display = "none"
      document.body.style.overflow = ""
    }
    console.log(`Modal ${modalId} cerrado`)
  }
}
window.loadPrices = () => {
  const savedPrices = localStorage.getItem("proyPreciosTerreno")
  if (savedPrices) {
    try {
      const precios = JSON.parse(savedPrices)
      if (document.getElementById("proy-precioParque"))
        document.getElementById("proy-precioParque").value = precios.parque || "150.00"
      if (document.getElementById("proy-precioEsquinaParque"))
        document.getElementById("proy-precioEsquinaParque").value = precios.esquinaParque || "180.00"
      if (document.getElementById("proy-precioEsquina"))
        document.getElementById("proy-precioEsquina").value = precios.esquina || "120.00"
      if (document.getElementById("proy-precioAvenida"))
        document.getElementById("proy-precioAvenida").value = precios.avenida || "100.00"
      if (document.getElementById("proy-precioCalle"))
        document.getElementById("proy-precioCalle").value = precios.calle || "80.00"
      window.updateResumen()
      console.log("Precios cargados:", precios)
    } catch (e) {
      console.error("Error al cargar precios:", e)
      window.setDefaultPrices()
    }
  } else {
    window.setDefaultPrices()
  }
}

window.initProyectosModals = () => {
  console.log("Inicializando modales de proyectos...")

  // Limpiar event listeners anteriores para evitar duplicados
  const existingListeners = document.querySelectorAll("[data-proy-listener-added]")
  existingListeners.forEach((el) => {
    el.removeAttribute("data-proy-listener-added")
  })

  // Variables para gestionar las etapas
  let etapasCreadas = []
  const etapaActual = 0
  let totalEtapas = 0
  let datosProyecto = {} // Para almacenar datos del proyecto entre modales

  // Elementos del DOM
  const modalBackdrop = document.getElementById("proy-modalBackdrop")
  const btnNuevoProyecto = document.getElementById("proy-btnNuevoProyecto")
  const btnSiguienteEtapa = document.getElementById("proy-btnSiguienteEtapa")
  const numEtapasInput = document.getElementById("proy-numEtapas")
  const btnEditarProyectos = document.querySelectorAll(".proy-btn-editar")
  const btnEliminarProyectos = document.querySelectorAll(".proy-btn-eliminar")
  const btnGuardarPrecios = document.getElementById("proy-btnGuardarPrecios")

  // Verificar que los elementos existen
  if (!modalBackdrop) {
    console.error("Modal backdrop no encontrado")
    return
  }

  // Función para abrir modal
  function openModal(modalId) {
    const modal = document.getElementById(modalId)
    if (modal) {
      modal.style.display = "block"
      modalBackdrop.style.display = "block"
      document.body.style.overflow = "hidden"
      console.log(`Modal ${modalId} abierto`)
    } else {
      console.error(`Modal ${modalId} no encontrado`)
    }
  }

  // Función para cerrar modal
  function closeModal(modalId) {
    const modal = document.getElementById(modalId)
    if (modal) {
      modal.style.display = "none"

      // Verificar si hay otros modales abiertos
      const openModals = document.querySelectorAll('.proy-modal[style*="display: block"]')
      if (openModals.length === 0) {
        modalBackdrop.style.display = "none"
        document.body.style.overflow = ""
      }
      console.log("Modal ${modalId} cerrado")
    }
  }

  // Función para cerrar todos los modales
  function closeAllModals() {
    const modals = document.querySelectorAll(".proy-modal")
    modals.forEach((modal) => {
      if (!modal.classList.contains("proy-template")) {
        modal.style.display = "none"
      }
    })
    modalBackdrop.style.display = "none"
    document.body.style.overflow = ""
    console.log("Todos los modales cerrados")
  }

  // Event listeners para botones de cerrar modal (X)
  const closeButtons = document.querySelectorAll(".proy-close[data-modal]")
  closeButtons.forEach((button) => {
    if (!button.hasAttribute("data-proy-listener-added")) {
      button.addEventListener("click", function () {
        const modalId = this.getAttribute("data-modal")
        closeModal(modalId)
      })
      button.setAttribute("data-proy-listener-added", "true")
    }
  })

  // Event listeners para botones de cancelar
  const cancelButtons = document.querySelectorAll(".proy-btn-secondary[data-modal]")
  cancelButtons.forEach((button) => {
    if (!button.hasAttribute("data-proy-listener-added")) {
      button.addEventListener("click", function () {
        const modalId = this.getAttribute("data-modal")
        closeModal(modalId)
      })
      button.setAttribute("data-proy-listener-added", "true")
    }
  })

  // Event listener para cerrar modal al hacer clic en el backdrop
  if (!modalBackdrop.hasAttribute("data-proy-listener-added")) {
    modalBackdrop.addEventListener("click", () => {
      closeAllModals()
    })
    modalBackdrop.setAttribute("data-proy-listener-added", "true")
  }

  // Prevenir que el contenido del modal cierre el modal
  const modalContents = document.querySelectorAll(".proy-modal-content")
  modalContents.forEach((content) => {
    if (!content.hasAttribute("data-proy-listener-added")) {
      content.addEventListener("click", (e) => {
        e.stopPropagation()
      })
      content.setAttribute("data-proy-listener-added", "true")
    }
  })

  // Función para crear modales de etapas dinámicamente
  function crearModalesEtapas(numEtapas) {
    console.log(`Creando ${numEtapas} modales de etapas`)

    // Limpiar etapas anteriores
    etapasCreadas.forEach((etapaId) => {
      const modalEtapa = document.getElementById(etapaId)
      if (modalEtapa && !modalEtapa.classList.contains("proy-template")) {
        modalEtapa.remove()
      }
    })

    etapasCreadas = []
    totalEtapas = numEtapas

    // Crear nuevos modales de etapas
    for (let i = 1; i <= numEtapas; i++) {
      const etapaId = `proy-modalEtapa${i}`
      const template = document.getElementById("proy-modalEtapaTemplate")

      if (!template) {
        console.error("Template de etapa no encontrado")
        return
      }

      const clon = template.cloneNode(true)
      clon.id = etapaId
      clon.classList.remove("proy-template")

      // Actualizar número de etapa
      const etapaNumElement = clon.querySelector(".proy-etapa-num")
      if (etapaNumElement) {
        etapaNumElement.textContent = toRomanNumeral(i)
      }

      // Configurar botones
      const btnAnterior = clon.querySelector(".proy-btn-anterior")
      const btnSiguiente = clon.querySelector(".proy-btn-siguiente")

      if (btnAnterior) {
        if (i === 1) {
          btnAnterior.addEventListener("click", () => {
            closeModal(etapaId)
            openModal("proy-modalActualizarPrecios")
          })
        } else {
          btnAnterior.addEventListener("click", () => {
            closeModal(etapaId)
            openModal(`proy-modalEtapa${i - 1}`)
          })
        }
      }

      if (btnSiguiente) {
        if (i === numEtapas) {
          btnSiguiente.textContent = "Guardar"
          btnSiguiente.addEventListener("click", () => {
            // Validar formulario antes de guardar
            if (validarFormularioEtapa(clon)) {
              closeModal(etapaId)
              openModal("proy-modalExito")

              setTimeout(() => {
                closeModal("proy-modalExito")
              }, 3000)
            }
          })
        } else {
          btnSiguiente.addEventListener("click", () => {
            if (validarFormularioEtapa(clon)) {
              closeModal(etapaId)
              openModal(`proy-modalEtapa${i + 1}`)
            }
          })
        }
      }

      // Configurar cierre del modal
      const closeBtn = clon.querySelector(".proy-close")
      if (closeBtn) {
        closeBtn.setAttribute("data-modal", etapaId)
        closeBtn.addEventListener("click", () => {
          closeModal(etapaId)
        })
      }

      // Agregar funcionalidad para manzanas
      setupManzanaRows(clon)

      // Agregar el modal al body
      document.body.appendChild(clon)
      etapasCreadas.push(etapaId)
    }
  }

  // Función para validar formulario de etapa
  function validarFormularioEtapa(modal) {
    const rows = modal.querySelectorAll(".proy-manzana-row")
    let totalLotes = 0
    let valid = true

    rows.forEach((row) => {
      const manzanaSelect = row.querySelector("select")
      const lotesInput = row.querySelector('input[type="number"]')

      if (!manzanaSelect.value || !lotesInput.value || Number.parseInt(lotesInput.value) <= 0) {
        valid = false
        lotesInput.style.borderColor = "#ec4332"
      } else {
        lotesInput.style.borderColor = ""
        totalLotes += Number.parseInt(lotesInput.value)
      }
    })

    if (!valid) {
      alert("Error de validación: Por favor, complete todos los campos correctamente.")
    }

    return valid
  }

  // Configurar funcionalidad para manzanas
  function setupManzanaRows(modal) {
    const container = modal.querySelector(".proy-manzanas-container")
    if (!container) return

    // Delegación de eventos para botones
    container.addEventListener("click", (e) => {
      // Agregar fila
      if (
        e.target.classList.contains("proy-btn-add-row") ||
        e.target.parentElement.classList.contains("proy-btn-add-row")
      ) {
        const button = e.target.classList.contains("proy-btn-add-row") ? e.target : e.target.parentElement
        const row = button.closest(".proy-manzana-row")
        const newRow = row.cloneNode(true)

        // Limpiar valores
        const inputs = newRow.querySelectorAll("input")
        inputs.forEach((input) => {
          input.value = ""
          input.style.borderColor = ""
        })

        // Cambiar letra de manzana
        const select = newRow.querySelector("select")
        if (select) {
          const options = select.querySelectorAll("option")
          const currentValue = select.value
          let nextSelected = false

          options.forEach((option) => {
            option.selected = false
            if (nextSelected) {
              option.selected = true
              nextSelected = false
            }
            if (option.value === currentValue) {
              nextSelected = true
            }
          })

          // Si llegamos al final, seleccionar la primera opción
          if (nextSelected) {
            options[0].selected = true
          }
        }

        container.appendChild(newRow)
        actualizarResumen(modal)
      }

      // Eliminar fila
      if (
        e.target.classList.contains("proy-btn-delete-row") ||
        e.target.parentElement.classList.contains("proy-btn-delete-row")
      ) {
        const button = e.target.classList.contains("proy-btn-delete-row") ? e.target : e.target.parentElement
        const row = button.closest(".proy-manzana-row")

        // Solo eliminar si hay más de una fila
        if (container.querySelectorAll(".proy-manzana-row").length > 1) {
          container.removeChild(row)
          actualizarResumen(modal)
        }
      }
    })

    // Actualizar resumen cuando cambian los valores
    container.addEventListener("change", (e) => {
      if (e.target.tagName === "SELECT" || e.target.tagName === "INPUT") {
        actualizarResumen(modal)
      }
    })

    // Inicializar resumen
    actualizarResumen(modal)
  }

  // Actualizar resumen de manzanas y lotes
  function actualizarResumen(modal) {
    const rows = modal.querySelectorAll(".proy-manzana-row")
    const resumenTextarea = modal.querySelector(".proy-resumen-etapa")
    if (!resumenTextarea) return

    let resumenText = ""
    let totalLotes = 0

    rows.forEach((row, index) => {
      const manzana = row.querySelector("select").value
      const lotes = Number.parseInt(row.querySelector("input").value) || 0
      totalLotes += lotes

      resumenText += `Manzana: ${manzana} - N° de Lotes: ${lotes}`

      if (index < rows.length - 1) {
        resumenText += " | "
      }
    })

    resumenText += `\nTotal de lotes en esta etapa: ${totalLotes}`
    resumenTextarea.value = resumenText
  }

  // Convertir número a numeral romano
  function toRomanNumeral(num) {
    const romanNumerals = {
      1: "I",
      2: "II",
      3: "III",
      4: "IV",
      5: "V",
      6: "VI",
      7: "VII",
      8: "VIII",
      9: "IX",
      10: "X",
    }
    return romanNumerals[num] || num.toString()
  }

  // Funciones para el modal de precios
  function initModalPrecios() {
    // Inputs de precios
    const precioParque = document.getElementById("proy-precioParque")
    const precioEsquina = document.getElementById("proy-precioEsquina")
    const precioAvenida = document.getElementById("proy-precioAvenida")
    const precioCalle = document.getElementById("proy-precioCalle")
    const precioEsquinaParque = document.getElementById("proy-precioEsquinaParque")

    // Elementos de resumen
    const resumenParque = document.getElementById("proy-resumenParque")
    const resumenEsquina = document.getElementById("proy-resumenEsquina")
    const resumenAvenida = document.getElementById("proy-resumenAvenida")
    const resumenCalle = document.getElementById("proy-resumenCalle")
    const resumenEsquinaParque = document.getElementById("proy-resumenEsquinaParque")

    // Función para formatear precio
    function formatPrice(value) {
      if (!value || isNaN(value)) return "S/ 0.00"
      return `S/ ${Number.parseFloat(value).toFixed(2)}`
    }

    // Función para actualizar resumen
    function updateResumen() {
      if (resumenParque) resumenParque.textContent = formatPrice(precioParque?.value)
      if (resumenEsquinaParque) resumenEsquinaParque.textContent = formatPrice(precioEsquinaParque?.value)
      if (resumenEsquina) resumenEsquina.textContent = formatPrice(precioEsquina?.value)
      if (resumenAvenida) resumenAvenida.textContent = formatPrice(precioAvenida?.value)
      if (resumenCalle) resumenCalle.textContent = formatPrice(precioCalle?.value)
    }

    // Función para validar precios
    function validatePrices() {
      const inputs = [precioParque, precioEsquinaParque, precioEsquina, precioAvenida, precioCalle].filter(
        (input) => input,
      )
      let isValid = true

      inputs.forEach((input) => {
        const value = Number.parseFloat(input.value)
        if (!input.value || isNaN(value) || value < 0) {
          input.style.borderColor = "#ec4332"
          isValid = false
        } else {
          input.style.borderColor = ""
        }
      })

      return isValid
    }

    // Función para cargar precios desde localStorage
    function loadPrices() {
      const savedPrices = localStorage.getItem("proyPreciosTerreno")
      if (savedPrices) {
        try {
          const precios = JSON.parse(savedPrices)
          if (precioParque) precioParque.value = precios.parque || "150.00"
          if (precioEsquinaParque) precioEsquinaParque.value = precios.esquinaParque || "180.00"
          if (precioEsquina) precioEsquina.value = precios.esquina || "120.00"
          if (precioAvenida) precioAvenida.value = precios.avenida || "100.00"
          if (precioCalle) precioCalle.value = precios.calle || "80.00"
          updateResumen()
          console.log("Precios cargados:", precios)
        } catch (e) {
          console.error("Error al cargar precios:", e)
          setDefaultPrices()
        }
      } else {
        setDefaultPrices()
      }
    }

    // Función para establecer precios por defecto
    function setDefaultPrices() {
      if (precioParque) precioParque.value = "150.00"
      if (precioEsquinaParque) precioEsquinaParque.value = "180.00"
      if (precioEsquina) precioEsquina.value = "120.00"
      if (precioAvenida) precioAvenida.value = "100.00"
      if (precioCalle) precioCalle.value = "80.00"
      updateResumen()
    }

    // Función para guardar precios en localStorage
    function savePrices() {
      const precios = {
        parque: precioParque?.value || "150.00",
        esquinaParque: precioEsquinaParque?.value || "180.00",
        esquina: precioEsquina?.value || "120.00",
        avenida: precioAvenida?.value || "100.00",
        calle: precioCalle?.value || "80.00",
        timestamp: new Date().toISOString(),
      }

      localStorage.setItem("proyPreciosTerreno", JSON.stringify(precios))
      console.log("Precios guardados:", precios)
      return precios
    }
    // Event listeners para actualizar resumen en tiempo real
    ;[precioParque, precioEsquinaParque, precioEsquina, precioAvenida, precioCalle]
      .filter((input) => input)
      .forEach((input) => {
        if (input && !input.hasAttribute("data-proy-listener-added")) {
          input.addEventListener("input", updateResumen)
          input.addEventListener("blur", function () {
            // Formatear el valor cuando pierde el foco
            if (this.value && !isNaN(this.value)) {
              this.value = Number.parseFloat(this.value).toFixed(2)
              updateResumen()
            }
          })
          input.setAttribute("data-proy-listener-added", "true")
        }
      })

    // Cargar precios al inicializar
    loadPrices()

    return {
      validatePrices,
      savePrices,
    }
  }

  // Event listeners principales
  if (btnNuevoProyecto && !btnNuevoProyecto.hasAttribute("data-proy-listener-added")) {
    btnNuevoProyecto.addEventListener("click", () => {
      openModal("proy-modalNuevoProyecto")
    })
    btnNuevoProyecto.setAttribute("data-proy-listener-added", "true")
  }

  // Modificar el comportamiento del botón Siguiente en el modal de nuevo proyecto
  if (btnSiguienteEtapa && !btnSiguienteEtapa.hasAttribute("data-proy-listener-added")) {
    btnSiguienteEtapa.addEventListener("click", () => {
      // Validar formulario principal
      const form = document.getElementById("proy-formNuevoProyecto")
      if (!form.checkValidity()) {
        form.reportValidity()
        return
      }

      const numEtapas = Number.parseInt(numEtapasInput.value) || 1

      if (numEtapas < 1 || numEtapas > 10) {
        alert("Error: El número de etapas debe estar entre 1 y 10.")
        return
      }

      // Guardar datos del proyecto para usarlos después
      datosProyecto = {
        numEtapas: numEtapas,
      }

      // Abrir modal de precios en lugar de ir directamente a las etapas
      closeModal("proy-modalNuevoProyecto")
      openModal("proy-modalActualizarPrecios")

      // Inicializar el modal de precios
      initModalPrecios()
    })
    btnSiguienteEtapa.setAttribute("data-proy-listener-added", "true")
  }

  // Configurar el botón de guardar precios para continuar con las etapas
  if (btnGuardarPrecios && !btnGuardarPrecios.hasAttribute("data-proy-listener-added")) {
    btnGuardarPrecios.addEventListener("click", () => {
      const preciosUtils = initModalPrecios()

      if (preciosUtils.validatePrices()) {
        // Guardar precios
        const precios = preciosUtils.savePrices()

        // Actualizar precio por defecto en el formulario de nuevo proyecto
        const precioTerrenoInput = document.getElementById("proy-precioTerreno")
        if (precioTerrenoInput) {
          precioTerrenoInput.value = `S/ ${precios.calle}`
        }

        // Crear modales de etapas y continuar con el flujo
        crearModalesEtapas(datosProyecto.numEtapas)
        closeModal("proy-modalActualizarPrecios")
        openModal("proy-modalEtapa1")
      } else {
        alert("Por favor, complete todos los campos con valores válidos.")
      }
    })
    btnGuardarPrecios.setAttribute("data-proy-listener-added", "true")
  }

  // Event listeners para botones de editar y eliminar
  if (btnEditarProyectos) {
    btnEditarProyectos.forEach((button) => {
      if (!button.hasAttribute("data-proy-listener-added")) {
        button.addEventListener("click", function () {
          const projectId = this.getAttribute("data-project-id")
          console.log(`Editando proyecto ${projectId}`)
          openModal("proy-modalEditarProyecto")
        })
        button.setAttribute("data-proy-listener-added", "true")
      }
    })
  }

  if (btnEliminarProyectos) {
    btnEliminarProyectos.forEach((button) => {
      if (!button.hasAttribute("data-proy-listener-added")) {
        button.addEventListener("click", function () {
          const projectId = this.getAttribute("data-project-id")
          console.log(`Eliminando proyecto ${projectId}`)
          openModal("proy-modalConfirmarEliminar")
        })
        button.setAttribute("data-proy-listener-added", "true")
      }
    })
  }

  // Confirmar eliminación
  const btnConfirmarEliminar = document.getElementById("proy-btnConfirmarEliminar")
  if (btnConfirmarEliminar && !btnConfirmarEliminar.hasAttribute("data-proy-listener-added")) {
    btnConfirmarEliminar.addEventListener("click", () => {
      closeModal("proy-modalConfirmarEliminar")
      openModal("proy-modalEliminadoExito")

      setTimeout(() => {
        closeModal("proy-modalEliminadoExito")
      }, 3000)
    })
    btnConfirmarEliminar.setAttribute("data-proy-listener-added", "true")
  }

  // Guardar edición
  const btnGuardarEdicion = document.getElementById("proy-btnGuardarEdicion")
  if (btnGuardarEdicion && !btnGuardarEdicion.hasAttribute("data-proy-listener-added")) {
    btnGuardarEdicion.addEventListener("click", () => {
      const form = document.getElementById("proy-formEditarProyecto")
      if (!form.checkValidity()) {
        form.reportValidity()
        return
      }

      closeModal("proy-modalEditarProyecto")
      openModal("proy-modalExito")

      setTimeout(() => {
        closeModal("proy-modalExito")
      }, 3000)
    })
    btnGuardarEdicion.setAttribute("data-proy-listener-added", "true")
  }

  // Prevenir envío de formularios
  const forms = document.querySelectorAll("form")
  forms.forEach((form) => {
    if (!form.hasAttribute("data-proy-listener-added")) {
      form.addEventListener("submit", function (e) {
        e.preventDefault()
        console.log("Form submitted:", this.id)
      })
      form.setAttribute("data-proy-listener-added", "true")
    }
  })

  // Funcionalidad de búsqueda
  const searchInput = document.querySelector(".proy-search-input")
  if (searchInput && !searchInput.hasAttribute("data-proy-listener-added")) {
    searchInput.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase()
      const projectCards = document.querySelectorAll(".proy-card")

      projectCards.forEach((card) => {
        const projectTitle = card.querySelector(".proy-card-title").textContent.toLowerCase()
        const projectDetails = card.querySelector(".proy-details").textContent.toLowerCase()

        if (projectTitle.includes(searchTerm) || projectDetails.includes(searchTerm)) {
          card.style.display = "block"
        } else {
          card.style.display = "none"
        }
      })
    })
    searchInput.setAttribute("data-proy-listener-added", "true")
  }

  // Agregar event listener para botones de cancelar que no tienen data-modal
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("proy-btn-secondary") && !e.target.hasAttribute("data-modal")) {
      const modal = e.target.closest(".proy-modal")
      if (modal && modal.id) {
        closeModal(modal.id)
      }
    }
  })

  // Inicializar modal de precios
  initModalPrecios()

  console.log("Modales de proyectos inicializados correctamente")
}

// Auto-inicializar si el DOM ya está cargado
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    if (typeof window.initProyectosModals === "function") {
      window.initProyectosModals()
    }
  })
} else {
  // DOM ya está cargado
  if (typeof window.initProyectosModals === "function") {
    window.initProyectosModals()
  }
}
