// Utilidades para manejo seguro de DOM
class DOMUtils {
  static safeAddEventListener(elementId, event, handler) {
    const element = document.getElementById(elementId)
    if (element) {
      element.addEventListener(event, handler)
      return true
    } else {
      console.warn(`Elemento con ID '${elementId}' no encontrado`)
      return false
    }
  }

  static safeQuerySelector(selector) {
    const element = document.querySelector(selector)
    if (!element) {
      console.warn(`Elemento con selector '${selector}' no encontrado`)
    }
    return element
  }

  static safeGetElementById(id) {
    const element = document.getElementById(id)
    if (!element) {
      console.warn(`Elemento con ID '${id}' no encontrado`)
    }
    return element
  }

  static waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector)
      if (element) {
        resolve(element)
        return
      }

      const observer = new MutationObserver((mutations, obs) => {
        const element = document.querySelector(selector)
        if (element) {
          obs.disconnect()
          resolve(element)
        }
      })

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      })

      setTimeout(() => {
        observer.disconnect()
        reject(new Error(`Elemento ${selector} no encontrado después de ${timeout}ms`))
      }, timeout)
    })
  }
}

// Función para inicializar modales de forma segura
function safeInitModals(initFunction, moduleName) {
  try {
    if (typeof initFunction === "function") {
      initFunction()
    } else {
      console.warn(`Función de inicialización no válida para ${moduleName}`)
    }
  } catch (error) {
    console.error(`Error inicializando ${moduleName}:`, error)
  }
}

// Exportar para uso global
window.DOMUtils = DOMUtils
window.safeInitModals = safeInitModals
