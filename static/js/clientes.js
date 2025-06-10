document.addEventListener("DOMContentLoaded", () => {
  const phoneInput = document.getElementById("phone")
  const verificationCodeInput = document.getElementById("verificationCode")
  const verificationCodeSection = document.getElementById("verificationCodeSection")
  const sendCodeButton = document.getElementById("sendCode")
  const verifyCodeButton = document.getElementById("verifyCode")
  const resendCodeButton = document.getElementById("resendCode")
  const phoneConfirmationMessage = document.getElementById("phoneConfirmationMessage")
  const phoneConfirmationSection = document.getElementById("phoneConfirmationSection")
  const registerForm = document.getElementById("registerForm")
  const submitButton = document.getElementById("submitButton")

  let phoneNumber = ""
  let verificationId = ""

  // Function to validate phone number format
  function isValidPhoneNumber(number) {
    const phoneRegex = /^\d{10}$/ // Assumes 10-digit phone number
    return phoneRegex.test(number)
  }

  // Function to show verification code input section
  function showVerificationCodeSection() {
    verificationCodeSection.style.display = "block"
    sendCodeButton.disabled = true
    phoneInput.disabled = true
  }

  // Function to hide verification code input section
  function hideVerificationCodeSection() {
    verificationCodeSection.style.display = "none"
    sendCodeButton.disabled = false
    phoneInput.disabled = false
  }

  // Function to show phone confirmation message
  function showPhoneConfirmationMessage() {
    phoneConfirmationMessage.textContent = `Teléfono ${phoneNumber} verificado.`
    phoneConfirmationSection.style.display = "block"
    verificationCodeSection.style.display = "none"
    verifyCodeButton.disabled = true
    resendCodeButton.disabled = true
    verificationCodeInput.disabled = true
    submitButton.disabled = false
  }

  // Function to hide phone confirmation message
  function hidePhoneConfirmationMessage() {
    phoneConfirmationSection.style.display = "none"
  }

  // Event listener for sending verification code
  sendCodeButton.addEventListener("click", () => {
    phoneNumber = phoneInput.value

    if (!isValidPhoneNumber(phoneNumber)) {
      alert("Por favor, ingrese un número de teléfono válido (10 dígitos).")
      return
    }

    fetch("/api/send-verification-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone: phoneNumber }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          verificationId = data.verificationId
          showVerificationCodeSection()
          alert("Código de verificación enviado.")
        } else {
          alert("Error al enviar el código de verificación: " + data.message)
        }
      })
      .catch((error) => {
        console.error("Error:", error)
        alert("Error al enviar el código de verificación.")
      })
  })

  // Event listener for verifying code
  verifyCodeButton.addEventListener("click", () => {
    const code = verificationCodeInput.value

    fetch("/api/verify-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone: phoneNumber,
        code: code,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          showPhoneConfirmationMessage()
          alert("Teléfono verificado.")
        } else {
          alert("Código de verificación incorrecto.")
        }
      })
      .catch((error) => {
        console.error("Error:", error)
        alert("Error al verificar el código.")
      })
  })

  // Event listener for resending code
  resendCodeButton.addEventListener("click", () => {
    fetch("/api/resend-verification-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone: phoneNumber }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Nuevo código de verificación enviado.")
        } else {
          alert("Error al reenviar el código de verificación: " + data.message)
        }
      })
      .catch((error) => {
        console.error("Error:", error)
        alert("Error al reenviar el código de verificación.")
      })
  })

  // Event listener for form submission (example)
  registerForm.addEventListener("submit", (event) => {
    if (phoneConfirmationSection.style.display !== "block") {
      event.preventDefault() // Prevent form submission if phone is not verified
      alert("Por favor, verifique su número de teléfono.")
    }
  })
})

window.initClientesModals = () => {
  // Referencias a elementos del DOM
  const btnCambiarEstado = document.getElementById("btnCambiarEstado")
  const btnAgregar = document.getElementById("btnAgregar")
  const modalCambiarEstado = document.getElementById("modalCambiarEstado")
  const modalAgregarCliente = document.getElementById("modalAgregarCliente")
  const modalExito = document.getElementById("modalExito")
  const modalOverlay = document.getElementById("modalOverlay")
  const cerrarModalEstado = document.getElementById("cerrarModalEstado")
  const cerrarModalAgregar = document.getElementById("cerrarModalAgregar")
  const cerrarModalExito = document.getElementById("cerrarModalExito")
  const btnCancelarAgregar = document.getElementById("btnCancelarAgregar")
  const btnConfirmarEstado = document.getElementById("btnConfirmarEstado")
  const formAgregarCliente = document.getElementById("formAgregarCliente")
  const opcionesEstado = document.querySelectorAll(".opcion-estado")
  const btnEliminar = document.getElementById("btnEliminar")
  const modalEliminarCliente = document.getElementById("modalConfirmarEliminacion")
  const btnCancelarEliminar = document.getElementById("btnCancelarEliminar")
  const btnConfirmarEliminar = document.getElementById("btnConfirmarEliminar")
  const cargaFamiliarSelect = document.getElementById("cargaFamiliarCliente")
  const datosFamiliarContainer = document.getElementById("datosFamiliarContainer")

  // Referencias para verificación de email
  const correoInput = document.getElementById("correoElectronicoCliente")
  const emailVerificationSection = document.getElementById("emailVerificationSection")
  const btnVerificarEmail = document.getElementById("btnVerificarEmail")
  const btnConfirmarAgregar = document.getElementById("btnConfirmarAgregar")
  const modalVerificacionEmail = document.getElementById("modalVerificacionEmail")
  const emailConfirmacion = document.getElementById("emailConfirmacion")
  const btnEnviarCodigo = document.getElementById("btnEnviarCodigo")
  const btnVerificarCodigo = document.getElementById("btnVerificarCodigo")
  const btnReenviarCodigo = document.getElementById("btnReenviarCodigo")
  const btnVolverEmail = document.getElementById("btnVolverEmail")
  const btnCancelarVerificacion = document.getElementById("btnCancelarVerificacion")
  const cerrarModalVerificacion = document.getElementById("cerrarModalVerificacion")
  const codigoVerificacion = document.getElementById("codigoVerificacion")
  const pasoConfirmarEmail = document.getElementById("pasoConfirmarEmail")
  const pasoVerificarCodigo = document.getElementById("pasoVerificarCodigo")
  const emailMostrado = document.getElementById("emailMostrado")
  const contadorReenvio = document.getElementById("contadorReenvio")
  const step1 = document.getElementById("step1")
  const step2 = document.getElementById("step2")
  const line1 = document.getElementById("line1")

  let estadoSeleccionado = null
  let emailVerificado = false
  let countdownTimer = null

  // Funciones de modal
  function abrirModal(modal) {
    modal.classList.add("activo")
    modalOverlay.classList.add("activo")
    document.body.style.overflow = "hidden"
  }

  function cerrarModal(modal) {
    modal.classList.remove("activo")
    modalOverlay.classList.remove("activo")
    document.body.style.overflow = ""
  }

  function cerrarTodosLosModales() {
    document.querySelectorAll(".modal").forEach((modal) => modal.classList.remove("activo"))
    modalOverlay.classList.remove("activo")
    document.body.style.overflow = ""
  }

  function mostrarExito(titulo, mensaje) {
    document.getElementById("tituloExito").textContent = titulo
    document.getElementById("mensajeExito").textContent = mensaje
    abrirModal(modalExito)
  }

  // Funciones de verificación de email
  function mostrarSeccionVerificacion() {
    emailVerificationSection.style.display = "block"
    actualizarEstadoBotonConfirmar()
  }

  function ocultarSeccionVerificacion() {
    emailVerificationSection.style.display = "none"
    emailVerificado = false
    actualizarEstadoBotonConfirmar()
  }

  function marcarEmailComoVerificado() {
    const emailStatus = document.getElementById("emailStatus")
    emailStatus.innerHTML = `
            <i class="fas fa-check-circle email-verified"></i>
            <span class="email-verified">Email verificado correctamente</span>
        `
    btnVerificarEmail.style.display = "none"
    emailVerificado = true
    actualizarEstadoBotonConfirmar()
  }

  function actualizarEstadoBotonConfirmar() {
    btnConfirmarAgregar.disabled = !emailVerificado
    btnConfirmarAgregar.style.opacity = emailVerificado ? "1" : "0.6"
  }

  function resetearVerificacionEmail() {
    emailVerificado = false
    const emailStatus = document.getElementById("emailStatus")
    emailStatus.innerHTML = `
            <i class="fas fa-exclamation-circle email-unverified"></i>
            <span class="email-unverified">Email no verificado</span>
        `
    btnVerificarEmail.style.display = "inline-block"
    actualizarEstadoBotonConfirmar()
  }

  // Funciones del modal de verificación
  function mostrarPasoConfirmar(email) {
    pasoConfirmarEmail.style.display = "block"
    pasoVerificarCodigo.style.display = "none"
    emailConfirmacion.value = email
    step1.classList.add("active")
    step1.classList.remove("inactive")
    step2.classList.add("inactive")
    step2.classList.remove("active")
    line1.classList.remove("active")
    document.getElementById("tituloVerificacion").textContent = "Verificación de Email"
  }

  function mostrarPasoVerificar(email) {
    pasoConfirmarEmail.style.display = "none"
    pasoVerificarCodigo.style.display = "block"
    emailMostrado.textContent = email
    step2.classList.add("active")
    step2.classList.remove("inactive")
    line1.classList.add("active")
    document.getElementById("tituloVerificacion").textContent = "Ingresa el Código"
    codigoVerificacion.focus()
    iniciarContadorReenvio()
  }

  function iniciarContadorReenvio() {
    let timeLeft = 60
    btnReenviarCodigo.disabled = true
    contadorReenvio.style.display = "block"

    countdownTimer = setInterval(() => {
      contadorReenvio.textContent = `Podrás reenviar en ${timeLeft} segundos`
      timeLeft--

      if (timeLeft < 0) {
        clearInterval(countdownTimer)
        btnReenviarCodigo.disabled = false
        contadorReenvio.style.display = "none"
      }
    }, 1000)
  }

  function limpiarContador() {
    if (countdownTimer) {
      clearInterval(countdownTimer)
      countdownTimer = null
    }
    contadorReenvio.style.display = "none"
    btnReenviarCodigo.disabled = false
  }

  function getCSRFToken() {
    const token = document.querySelector("meta[name=csrf-token]")
    return token ? token.getAttribute("content") : ""
  }

  function getUserName() {
    const nombreInput = document.getElementById("nombreCliente")
    const apellidoInput = document.getElementById("apellidoCliente")

    let nombre = "Usuario"
    if (nombreInput && nombreInput.value.trim()) {
      nombre = nombreInput.value.trim()
      if (apellidoInput && apellidoInput.value.trim()) {
        nombre += " " + apellidoInput.value.trim()
      }
    }
    return nombre
  }

  // Event listeners para verificación de email
  correoInput.addEventListener("input", function () {
    const email = this.value.trim()
    if (email && /^[a-zA-Z0-9._%+.-]+@(gmail|hotmail)\.com$/.test(email)) {
      mostrarSeccionVerificacion()
      resetearVerificacionEmail()
    } else {
      ocultarSeccionVerificacion()
    }
  })

  btnVerificarEmail.addEventListener("click", () => {
    const email = correoInput.value.trim()
    if (email) {
      mostrarPasoConfirmar(email)
      abrirModal(modalVerificacionEmail)
    }
  })

  // Formatear código automáticamente
  codigoVerificacion.addEventListener("input", (e) => {
    let value = e.target.value.replace(/[^A-Z0-9]/g, "")
    if (value.length > 6) value = value.slice(0, 6)

    if (value.length > 3) {
      value = value.slice(0, 3) + "-" + value.slice(3)
    }

    e.target.value = value
  })

  // Event listeners del modal de verificación
  btnEnviarCodigo.addEventListener("click", function () {
    const email = emailConfirmacion.value.trim()

    this.disabled = true
    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...'

    console.log("🚀 Enviando código a:", email)

    fetch("/api/send-verification-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCSRFToken(),
      },
      body: JSON.stringify({
        email: email,
        user_name: getUserName(),
      }),
    })
      .then((response) => {
        console.log("📡 Respuesta del servidor:", response.status, response.statusText)
        return response.json()
      })
      .then((data) => {
        console.log("📦 Datos recibidos:", data)
        if (data.success) {
          // Mostrar el código en modo prueba si está disponible
          let mensaje = "Código enviado exitosamente. Revisa tu email."
          if (data.message && data.message.includes("CÓDIGO PARA PRUEBA:")) {
            const codigo = data.message.split("CÓDIGO PARA PRUEBA: ")[1]
            mensaje = `MODO PRUEBA: Tu código es ${codigo}. Cópialo en el siguiente paso.`
          }

          Swal.fire({
            icon: "success",
            title: "¡Código enviado!",
            text: mensaje,
            timer: 3000,
            showConfirmButton: true,
          })
          setTimeout(() => {
            mostrarPasoVerificar(email)
          }, 1500)
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: data.message,
          })
        }
      })
      .catch((error) => {
        console.error("❌ Error:", error)
        Swal.fire({
          icon: "error",
          title: "Error de conexión",
          text: "No se pudo enviar el código. Intenta nuevamente.",
        })
      })
      .finally(() => {
        this.disabled = false
        this.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Código'
      })
  })

  btnVerificarCodigo.addEventListener("click", function () {
    const code = codigoVerificacion.value.trim().toUpperCase()
    const email = emailConfirmacion.value.trim()

    if (!code || code.length < 7) {
      Swal.fire({
        icon: "warning",
        title: "Código incompleto",
        text: "Por favor ingresa el código completo",
      })
      return
    }

    this.disabled = true
    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando...'

    console.log("🔍 Verificando código:", code, "para email:", email)

    fetch("/api/verify-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCSRFToken(),
      },
      body: JSON.stringify({
        email: email,
        code: code,
      }),
    })
      .then((response) => {
        console.log("📡 Respuesta verificación:", response.status)
        return response.json()
      })
      .then((data) => {
        console.log("✅ Resultado verificación:", data)
        if (data.success) {
          Swal.fire({
            icon: "success",
            title: "¡Email verificado!",
            text: data.message,
            timer: 2000,
            showConfirmButton: false,
          })

          marcarEmailComoVerificado()
          limpiarContador()

          setTimeout(() => {
            cerrarModal(modalVerificacionEmail)
          }, 1500)
        } else {
          Swal.fire({
            icon: "error",
            title: "Código incorrecto",
            text: data.message,
          })
          codigoVerificacion.value = ""
          codigoVerificacion.focus()
        }
      })
      .catch((error) => {
        console.error("❌ Error:", error)
        Swal.fire({
          icon: "error",
          title: "Error de conexión",
          text: "No se pudo verificar el código. Intenta nuevamente.",
        })
      })
      .finally(() => {
        this.disabled = false
        this.innerHTML = '<i class="fas fa-check"></i> Verificar'
      })
  })

  btnReenviarCodigo.addEventListener("click", function () {
    const email = emailConfirmacion.value.trim()

    this.disabled = true
    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Reenviando...'

    console.log("🔄 Reenviando código a:", email)

    fetch("/api/resend-verification-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCSRFToken(),
      },
      body: JSON.stringify({
        email: email,
        user_name: getUserName(),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Mostrar el código en modo prueba si está disponible
          let mensaje = "Código reenviado exitosamente"
          if (data.message && data.message.includes("CÓDIGO PARA PRUEBA:")) {
            const codigo = data.message.split("CÓDIGO PARA PRUEBA: ")[1]
            mensaje = `MODO PRUEBA: Tu nuevo código es ${codigo}`
          }

          Swal.fire({
            icon: "success",
            title: "Código reenviado",
            text: mensaje,
            timer: 3000,
            showConfirmButton: true,
          })
          iniciarContadorReenvio()

          // Limpiar y enfocar campo de código
          codigoVerificacion.value = ""
          codigoVerificacion.focus()
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: data.message,
          })
        }
      })
      .catch((error) => {
        console.error("❌ Error:", error)
        Swal.fire({
          icon: "error",
          title: "Error de conexión",
          text: "No se pudo reenviar el código. Intenta nuevamente.",
        })
      })
      .finally(() => {
        this.disabled = false
        this.innerHTML = '<i class="fas fa-redo"></i> Reenviar código'
      })
  })

  btnVolverEmail.addEventListener("click", () => {
    mostrarPasoConfirmar(emailConfirmacion.value)
    limpiarContador()
  })

  btnCancelarVerificacion.addEventListener("click", () => {
    cerrarModal(modalVerificacionEmail)
    limpiarContador()
  })

  cerrarModalVerificacion.addEventListener("click", () => {
    cerrarModal(modalVerificacionEmail)
    limpiarContador()
  })

  // Resto de funciones existentes...
  function obtenerClientesSeleccionados() {
    return [...document.querySelectorAll(".checkbox-cliente:checked")].map((cb) => cb.dataset.id)
  }

  function actualizarClientesSeleccionados() {
    const seleccionados = obtenerClientesSeleccionados()
    btnCambiarEstado.disabled = seleccionados.length === 0
    btnCambiarEstado.style.opacity = seleccionados.length === 0 ? "0.6" : "1"
  }

  document.addEventListener("change", (e) => {
    if (e.target.classList.contains("checkbox-cliente")) {
      actualizarClientesSeleccionados()
    }
  })

  opcionesEstado.forEach((opcion) => {
    opcion.addEventListener("click", function () {
      opcionesEstado.forEach((op) => op.classList.remove("seleccionado"))
      this.classList.add("seleccionado")
      estadoSeleccionado = this.dataset.estado
    })
  })

  formAgregarCliente.addEventListener("submit", function (e) {
    e.preventDefault()

    // Verificar que el email esté verificado
    if (!emailVerificado) {
      Swal.fire({
        icon: "warning",
        title: "Email no verificado",
        text: "Debes verificar tu email antes de continuar",
      })
      return
    }

    // Obtener valores
    const nombre = document.getElementById("nombreCliente").value.trim()
    const apellido = document.getElementById("apellidoCliente").value.trim()
    const ocupacion = document.getElementById("ocupacionCliente").value.trim()
    const direccion = document.getElementById("direccionCliente").value.trim()
    const dni = document.getElementById("dniCliente").value.trim()
    const telefono = document.getElementById("telefonoCliente").value.trim()
    const correo = document.getElementById("correoElectronicoCliente").value.trim()
    const ingreso = document.getElementById("ingresoCliente").value.trim()
    const cargaFamiliar = document.getElementById("cargaFamiliarCliente").value
    const nombreFamiliar = document.getElementById("nombreFamiliar").value.trim()
    const apellidoFamiliar = document.getElementById("apellidoFamiliar").value.trim()
    const dniFamiliar = document.getElementById("dniFamiliar").value.trim()

    // Validaciones (mantener las existentes)
    const letrasRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,50}$/
    const direccionRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s#]{1,50}$/
    const dniRegex = /^\d{8}$/
    const telefonoRegex = /^9\d{8}$/
    const correoRegex = /^[a-zA-Z0-9._%+-]+@(gmail|hotmail)\.com$/
    const ingresoRegex = /^[0-9]+(\.[0-9]{1,2})?$/

    if (!letrasRegex.test(nombre)) {
      Swal.fire("Nombre inválido", "Solo letras y espacios, máximo 50 caracteres.", "warning")
      return
    }

    if (!letrasRegex.test(apellido)) {
      Swal.fire("Apellido inválido", "Solo letras y espacios, máximo 50 caracteres.", "warning")
      return
    }

    if (!letrasRegex.test(ocupacion)) {
      Swal.fire("Ocupación inválida", "Solo letras y espacios, máximo 50 caracteres.", "warning")
      return
    }

    if (!direccionRegex.test(direccion)) {
      Swal.fire("Dirección inválida", "Solo letras, números y el carácter #, máximo 50 caracteres.", "warning")
      return
    }

    if (!dniRegex.test(dni)) {
      Swal.fire("DNI inválido", "Debe contener exactamente 8 dígitos numéricos.", "warning")
      return
    }

    if (!telefonoRegex.test(telefono)) {
      Swal.fire("Teléfono inválido", "Debe comenzar con 9 y contener 9 dígitos.", "warning")
      return
    }

    if (!correoRegex.test(correo)) {
      Swal.fire("Correo inválido", "Debe ser @gmail.com o @hotmail.com.", "warning")
      return
    }

    if (!ingresoRegex.test(ingreso)) {
      Swal.fire("Ingreso inválido", "Ingrese un monto válido (número positivo).", "warning")
      return
    }

    if (cargaFamiliar === "1") {
      if (!letrasRegex.test(nombreFamiliar)) {
        Swal.fire("Nombre del familiar inválido", "Solo letras y espacios, máximo 50 caracteres.", "warning")
        return
      }

      if (!letrasRegex.test(apellidoFamiliar)) {
        Swal.fire("Apellido del familiar inválido", "Solo letras y espacios, máximo 50 caracteres.", "warning")
        return
      }

      if (!dniRegex.test(dniFamiliar)) {
        Swal.fire("DNI del familiar inválido", "Debe contener exactamente 8 dígitos numéricos.", "warning")
        return
      }
    }

    // Desactivar campos de familiar si es "No"
    if (cargaFamiliar !== "1") {
      document.getElementById("nombreFamiliar").setAttribute("disabled", "disabled")
      document.getElementById("apellidoFamiliar").setAttribute("disabled", "disabled")
      document.getElementById("dniFamiliar").setAttribute("disabled", "disabled")
    }

    const formData = new FormData(this)

    if (cargaFamiliar !== "1") {
      document.getElementById("nombreFamiliar").removeAttribute("disabled")
      document.getElementById("apellidoFamiliar").removeAttribute("disabled")
      document.getElementById("dniFamiliar").removeAttribute("disabled")
    }

    fetch("/insertar_cliente", {
      method: "POST",
      body: formData,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "X-CSRFToken": document.querySelector("input[name=csrf_token]").value,
      },
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || `Error HTTP ${res.status}`)
        return data
      })
      .then((data) => {
        if (data.success) {
          const cliente = data.cliente
          const nuevaFila = document.createElement("tr")
          const clasesEstado = {
            Activo: "activo",
            Evaluado: "evaluado",
            NoDisponible: "no-disponible",
            SinEvaluar: "sin-evaluar",
          }
          const claseEstado = clasesEstado[cliente.estado] || "sin-evaluar"
          nuevaFila.setAttribute("data-id", cliente.id_cliente)
          nuevaFila.setAttribute("data-estado", cliente.estado.toLowerCase())
          nuevaFila.innerHTML = `
                    <td><input type="checkbox" class="checkbox-cliente" data-id="${cliente.id_cliente}"></td>
                    <td>${cliente.id_cliente}</td>
                    <td data-filtro="nombreCompleto">${cliente.nombre} ${cliente.apellido}</td>
                    <td data-filtro="dni">${cliente.dni}</td>
                    <td>${cliente.direccion}</td>
                    <td>${cliente.telefono}</td>
                    <td>${cliente.ingreso_neto}</td>
                    <td><span class="estado-badge ${claseEstado}">${cliente.estado}</span></td>
                    <td style="text-align: center;">
                        <button class="btn-detalles" data-id="${cliente.id_cliente}"><i class="fas fa-eye"></i></button>
                    </td>
                `
          document.getElementById("tabla_clientes_body").appendChild(nuevaFila)
          cerrarModal(modalAgregarCliente)
          mostrarExito("Cliente agregado", data.message)
          this.reset()
          resetearVerificacionEmail()
          ocultarSeccionVerificacion()
          actualizarClientesSeleccionados()
        } else {
          Swal.fire({ icon: "error", title: "Error", text: data.message })
        }
      })
      .catch((error) => {
        console.error("Error al enviar formulario:", error)
        Swal.fire({ icon: "error", title: "Error inesperado", text: error.message })
      })
  })

  // Resto de event listeners existentes...
  btnEliminar.addEventListener("click", () => {
    if (obtenerClientesSeleccionados().length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Atención",
        text: "Por favor, seleccione al menos un cliente",
      })
      return
    }
    abrirModal(modalEliminarCliente)
  })

  btnCancelarEliminar.addEventListener("click", () => cerrarModal(modalEliminarCliente))

  btnConfirmarEliminar.addEventListener("click", () => {
    const clientesSeleccionados = obtenerClientesSeleccionados()
    if (clientesSeleccionados.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Atención",
        text: "No hay clientes seleccionados",
      })
      return
    }

    const formData = new FormData()
    formData.append("clientes", JSON.stringify(clientesSeleccionados))

    fetch("/eliminar_clientes", {
      method: "POST",
      body: formData,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "X-CSRFToken": document.querySelector("input[name=csrf_token]").value,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          clientesSeleccionados.forEach((id) => {
            const fila = document.querySelector(`tr[data-id="${id}"]`)
            if (fila) fila.remove()
          })
          cerrarModal(modalEliminarCliente)
          mostrarExito("Clientes eliminados", data.message)
          actualizarClientesSeleccionados()
        } else {
          alert("Error: " + data.message)
        }
      })
      .catch((error) => {
        console.error("Error al eliminar clientes:", error)
        Swal.fire({
          icon: "error",
          title: "Error inesperado",
          text: "Ocurrió un problema al eliminar los clientes",
        })
      })
  })

  btnConfirmarEstado.addEventListener("click", () => {
    const clientesSeleccionados = obtenerClientesSeleccionados()

    if (!estadoSeleccionado) {
      Swal.fire({
        icon: "warning",
        title: "Atención",
        text: "Por favor, seleccione un estado",
      })
      return
    }

    if (clientesSeleccionados.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Atención",
        text: "Por favor, seleccione al menos un cliente",
      })
      return
    }

    Swal.fire({
      title: "¿Estás seguro de cambiar el estado?",
      text: `Se cambiará el estado de ${clientesSeleccionados.length} cliente(s).`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cambiar estado",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        const formData = new FormData()
        formData.append("clientes", JSON.stringify(clientesSeleccionados))
        formData.append("estado", estadoSeleccionado)

        fetch("/actualizar_estado_clientes", {
          method: "POST",
          body: formData,
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRFToken": document.querySelector("input[name=csrf_token]").value,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              clientesSeleccionados.forEach((id) => {
                const fila = document.querySelector(`tr[data-id="${id}"]`)
                if (fila) {
                  const spanEstado = fila.querySelector(".estado-badge")
                  const clasesEstado = {
                    activo: "activo",
                    evaluado: "evaluado",
                    "no-disponible": "no-disponible",
                    "sin-evaluar": "sin-evaluar",
                  }

                  spanEstado.className = "estado-badge " + (clasesEstado[estadoSeleccionado] || "sin-evaluar")
                  spanEstado.textContent =
                    estadoSeleccionado.charAt(0).toUpperCase() + estadoSeleccionado.slice(1).replace("-", " ")
                  fila.setAttribute("data-estado", estadoSeleccionado)
                }
              })

              cerrarModal(modalCambiarEstado)

              Swal.fire({
                title: "Estado Actualizado",
                text: `Se actualizó el estado de ${clientesSeleccionados.length} cliente(s).`,
                icon: "success",
                confirmButtonText: "Cerrar",
              })

              estadoSeleccionado = null
              opcionesEstado.forEach((op) => op.classList.remove("seleccionado"))
            } else {
              alert("Error: " + data.message)
            }
          })
          .catch((error) => {
            console.error("Error al actualizar estado:", error)
            Swal.fire({
              icon: "error",
              title: "Error inesperado",
              text: "Ocurrió un problema al actualizar el estado",
            })
          })
      }
    })
  })

  btnCambiarEstado.addEventListener("click", () => {
    if (obtenerClientesSeleccionados().length === 0) {
      alert("Por favor, seleccione al menos un cliente")
      return
    }
    abrirModal(modalCambiarEstado)
  })

  btnAgregar.addEventListener("click", () => abrirModal(modalAgregarCliente))
  cerrarModalEstado.addEventListener("click", () => cerrarModal(modalCambiarEstado))
  cerrarModalAgregar.addEventListener("click", () => {
    cerrarModal(modalAgregarCliente)
    resetearVerificacionEmail()
    ocultarSeccionVerificacion()
  })
  cerrarModalExito.addEventListener("click", () => cerrarModal(modalExito))
  btnCancelarAgregar.addEventListener("click", () => {
    cerrarModal(modalAgregarCliente)
    resetearVerificacionEmail()
    ocultarSeccionVerificacion()
  })
  modalOverlay.addEventListener("click", cerrarTodosLosModales)

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") cerrarTodosLosModales()
  })

  cargaFamiliarSelect.addEventListener("change", () => {
    if (cargaFamiliarSelect.value === "1") {
      datosFamiliarContainer.style.display = "block"
    } else {
      datosFamiliarContainer.style.display = "none"
      document.getElementById("nombreFamiliar").value = ""
      document.getElementById("apellidoFamiliar").value = ""
      document.getElementById("dniFamiliar").value = ""
    }
  })

  // Inicializar selección
  actualizarClientesSeleccionados()

  // Buscador de clientes
  document.getElementById("buscarCliente").addEventListener("input", filtrarClientes)
  document.getElementById("filtroClientes").addEventListener("change", filtrarClientes)
  document.getElementById("filtroClientesEstado").addEventListener("change", filtrarClientes)

  function filtrarClientes() {
    const textoBusqueda = document.getElementById("buscarCliente").value.toLowerCase()
    const filtro = document.getElementById("filtroClientes").value
    const filtroEstado = document.getElementById("filtroClientesEstado").value.toLowerCase()
    document.querySelectorAll(".tabla-clientes tbody tr").forEach((fila) => {
      const estadoCliente = fila.getAttribute("data-estado").toLowerCase()
      const coincideEstado = filtroEstado === "todos" || estadoCliente === filtroEstado
      if (!coincideEstado) {
        fila.style.display = "none"
        return
      }
      let mostrar = false
      if (!filtro) {
        mostrar = fila.textContent.toLowerCase().includes(textoBusqueda)
      } else {
        const celda = fila.querySelector(`td[data-filtro="${filtro}"]`)
        if (celda) {
          mostrar = celda.textContent.toLowerCase().includes(textoBusqueda)
        }
      }
      fila.style.display = mostrar ? "" : "none"
    })
    paginarTabla()
  }

  // Paginación en la tabla de clientes
  const filasPorPagina = 10
  let paginaActual = 1

  function paginarTabla() {
    const filas = Array.from(document.querySelectorAll("#tabla_clientes_body tr")).filter(
      (fila) => fila.style.display !== "none",
    )
    const totalPaginas = Math.ceil(filas.length / filasPorPagina)
    const paginacion = document.getElementById("paginacion")

    function mostrarPagina(pagina) {
      paginaActual = pagina
      const inicio = (pagina - 1) * filasPorPagina
      const fin = inicio + filasPorPagina

      document.querySelectorAll("#tabla_clientes_body tr").forEach((fila) => (fila.style.display = "none"))

      filas.forEach((fila, i) => {
        if (i >= inicio && i < fin) {
          fila.style.display = ""
        }
      })

      paginacion.innerHTML = ""
      for (let i = 1; i <= totalPaginas; i++) {
        const boton = document.createElement("button")
        boton.textContent = i
        if (i === pagina) boton.classList.add("activo")
        boton.addEventListener("click", () => mostrarPagina(i))
        paginacion.appendChild(boton)
      }
    }

    if (totalPaginas > 0) {
      mostrarPagina(paginaActual)
    } else {
      paginacion.innerHTML = ""
    }
  }

  paginarTabla()

  // Validaciones en tiempo real
  function validarSoloLetras(e) {
    const char = String.fromCharCode(e.which)
    if (!/[A-Za-zÁÉÍÓÚáéíóúÑñ\s]/.test(char)) {
      e.preventDefault()
    }
  }

  function validarSoloNumeros(e) {
    const char = String.fromCharCode(e.which)
    if (!/[0-9]/.test(char)) {
      e.preventDefault()
    }
  }

  const camposNombres = ["nombreCliente", "apellidoCliente", "nombreFamiliar", "apellidoFamiliar"]

  camposNombres.forEach((id) => {
    const campo = document.getElementById(id)
    if (campo) {
      campo.addEventListener("keypress", validarSoloLetras)
    }
  })

  const camposNumeros = ["dniCliente", "telefonoCliente", "dniFamiliar"]

  camposNumeros.forEach((id) => {
    const campo = document.getElementById(id)
    if (campo) {
      campo.addEventListener("keypress", validarSoloNumeros)
    }
  })

  // Inicializar estado del botón confirmar
  actualizarEstadoBotonConfirmar()
}

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  if (typeof window.initClientesModals === "function") {
    window.initClientesModals()
    console.log("✅ initClientesModals ejecutado correctamente")
  } else {
    console.error("❌ initClientesModals no está definido")
  }
})
