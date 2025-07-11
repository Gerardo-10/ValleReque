window.initSecurityModals = () => {
  const btnCambiarEstado = document.getElementById("btnCambiarEstado")
  const btnAgregar = document.getElementById("btnAgregar")
  const modalCambiarEstado = document.getElementById("modalCambiarEstado")
  const modalAgregarEmpleado = document.getElementById("modalAgregarEmpleado")
  const modalExito = document.getElementById("modalExito")
  const modalOverlay = document.getElementById("modalOverlay")
  const cerrarModalEstado = document.getElementById("cerrarModalEstado")
  const cerrarModalAgregar = document.getElementById("cerrarModalAgregar")
  const cerrarModalExito = document.getElementById("cerrarModalExito")
  const btnCancelarAgregar = document.getElementById("btnCancelarAgregar")
  const btnConfirmarEstado = document.getElementById("btnConfirmarEstado")
  const formAgregarEmpleado = document.getElementById("formAgregarEmpleado")
  const opcionesEstado = document.querySelectorAll(".opcion-estado")
  const checkboxesEmpleados = document.querySelectorAll(".checkbox-empleado")

  // Referencias para verificación de email
  const correoInput = document.getElementById("correoEmpleado")
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

  let empleadosSeleccionados = []
  let estadoSeleccionado = null
  let emailVerificado = false
  let countdownTimer = null

  // === VALIDACIONES EN TIEMPO REAL ===
  document.getElementById("dniEmpleado").addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "").slice(0, 8)
  })

  document.getElementById("telefonoEmpleado").addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "").slice(0, 9)
  })

  function soloLetrasYEspacios(texto) {
    return texto.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ ]/g, "")
  }

  document.getElementById("nombreEmpleado").addEventListener("input", function () {
    this.value = soloLetrasYEspacios(this.value)
  })

  document.getElementById("apellidoEmpleado").addEventListener("input", function () {
    this.value = soloLetrasYEspacios(this.value)
  })

  // === MODALES ===
  function abrirModal(modal) {
    if (!modal) {
      console.error("Modal no encontrado", modal)
      return
    }
    modal.classList.add("activo")
    modalOverlay.classList.add("activo")
    document.body.style.overflow = "hidden"
  }

  function cerrarModal(modal) {
    if (!modal) {
      console.error("Modal no encontrado", modal)
      return
    }
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

  function actualizarEmpleadosSeleccionados() {
    empleadosSeleccionados = []
    document.querySelectorAll(".checkbox-empleado").forEach((checkbox) => {
      if (checkbox.checked) empleadosSeleccionados.push(checkbox.dataset.id)
    })
    btnCambiarEstado.disabled = empleadosSeleccionados.length === 0
    btnCambiarEstado.style.opacity = empleadosSeleccionados.length === 0 ? "0.6" : "1"
  }

  document.addEventListener("change", actualizarEmpleadosSeleccionados)

  opcionesEstado.forEach((opcion) => {
    opcion.addEventListener("click", function () {
      opcionesEstado.forEach((op) => op.classList.remove("seleccionado"))
      this.classList.add("seleccionado")
      estadoSeleccionado = this.dataset.estado
    })
  })

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
    const nombreInput = document.getElementById("nombreEmpleado")
    const apellidoInput = document.getElementById("apellidoEmpleado")

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

  // === FORMULARIO AGREGAR EMPLEADO ===
  formAgregarEmpleado.addEventListener("submit", function (e) {
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

    const nombre = this.nombre.value.trim()
    const apellido = this.apellido.value.trim()
    const dni = this.dni.value.trim()
    const direccion = this.direccion.value.trim()
    const telefono = this.telefono.value.trim()
    const correo = this.correo.value.trim()
    const fechaNacimiento = this.fecha_nacimiento.value
    const area = this.area.value

    if (!nombre || !apellido || !dni || !direccion || !telefono || !correo || !fechaNacimiento || !area) {
      Swal.fire({
        icon: "warning",
        title: "Formulario incompleto",
        text: "Por favor, completa todos los campos obligatorios.",
      })
      return
    }

    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!correoRegex.test(correo)) {
      Swal.fire({ icon: "error", title: "Correo inválido", text: "Por favor, ingresa un correo electrónico válido." })
      return
    }

    const formData = new FormData(this)
    const btnConfirmar = this.querySelector('button[type="submit"]')
    btnConfirmar.disabled = true
    btnConfirmar.textContent = "Procesando..."

    Swal.fire({
      title: "Registrando...",
      text: "Por favor espera",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    })

    fetch(this.action, {
      method: "POST",
      body: formData,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "X-CSRFToken": document.querySelector("input[name=csrf_token]").value,
      },
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.message)
        return data
      })
      .then((data) => {
        Swal.close()
        btnConfirmar.disabled = false
        btnConfirmar.textContent = "Confirmar"

        if (data.success) {
          const empleado = data.empleado
          const estadoTexto = empleado.estado === 1 ? "Activo" : "Inactivo"
          const estadoClase = empleado.estado === 1 ? "activo" : "inactivo"
          const estadoData = empleado.estado === 1 ? "activos" : "inactivos"

          const nuevaFila = document.createElement("tr")
          nuevaFila.setAttribute("data-estado", estadoData)
          nuevaFila.innerHTML = `
                    <td><input type="checkbox" class="checkbox-empleado" data-id="${empleado.id_empleado}"></td>
                    <td>${empleado.id_empleado}</td>
                    <td data-filtro="nombre">${empleado.nombre}</td>
                    <td data-filtro="apellido">${empleado.apellido}</td>
                    <td data-filtro="dni">${empleado.dni}</td>
                    <td data-filtro="area">${empleado.area}</td>
                    <td><span class="estado-badge ${estadoClase}">${estadoTexto}</span></td>
                    <td style="text-align: center;"><button class="btn-detalles" data-id="${empleado.id_empleado}"><i class="fas fa-eye"></i></button></td>`

          document.getElementById("tabla_empleados_body").appendChild(nuevaFila)
          cerrarModal(modalAgregarEmpleado)

          // Mostrar SweetAlert2 con el mensaje de éxito al agregar el empleado
          Swal.fire({
            title: "Empleado agregado",
            text: "Empleado creado con éxito",
            icon: "success",
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#3085d6",
          })

          this.reset()
          resetearVerificacionEmail()
          ocultarSeccionVerificacion()
          paginarTabla()
          cargarVista("/seguridad", initSecurityModals)
        }
      })
      .catch((error) => {
        Swal.close()
        btnConfirmar.disabled = false
        btnConfirmar.textContent = "Confirmar"

        const mensaje = error.message.toLowerCase()
        let mensajeUsuario
        if (mensaje.includes("dni") && mensaje.includes("registrado"))
          mensajeUsuario = "El DNI ingresado ya está registrado."
        else if (mensaje.includes("teléfono") && mensaje.includes("registrado"))
          mensajeUsuario = "El número de teléfono ya está registrado."
        else if (mensaje.includes("correo") && mensaje.includes("registrado"))
          mensajeUsuario = "El correo electrónico ya se encuentra en uso."
        else if (mensaje.includes("correo") && mensaje.includes("no parece ser válido"))
          mensajeUsuario = "El correo electrónico ingresado no existe o no es válido."
        else if (mensaje.includes("nombre_usuario") && mensaje.includes("duplicate"))
          mensajeUsuario = "Ya existe un nombre de usuario generado con este nombre y apellido."
        else mensajeUsuario = error.message

        Swal.fire({
          icon: "error",
          title: "Error al registrar empleado",
          text: mensajeUsuario,
          confirmButtonText: "Entendido",
          confirmButtonColor: "#d33",
        })
      })
  })

  // === CAMBIAR ESTADO EMPLEADOS ===
  btnConfirmarEstado.addEventListener("click", () => {
    if (!estadoSeleccionado || empleadosSeleccionados.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Selección incompleta",
        text: "Por favor selecciona al menos un empleado y un estado.",
      })
      return
    }

    // Confirma con SweetAlert2
    Swal.fire({
      title: "¿Estás seguro de cambiar el estado?",
      text: `Se cambiará el estado de ${empleadosSeleccionados.length} empleado(s).`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cambiar estado",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        // Enviar la solicitud al backend
        fetch("/cambiar_estado_empleados", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": document.querySelector("input[name=csrf_token]").value,
          },
          body: JSON.stringify({ ids: empleadosSeleccionados, estado: estadoSeleccionado }),
        })
          .then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)))
          .then((data) => {
            if (data.success) {
              // Si la actualización es exitosa, actualiza la tabla
              empleadosSeleccionados.forEach((id) => {
                const fila = document.querySelector(`.checkbox-empleado[data-id="${id}"]`)?.closest("tr")
                if (fila) {
                  const nuevoEstado = estadoSeleccionado === "activo" ? "Activo" : "Inactivo"
                  const estadoClase = estadoSeleccionado === "activo" ? "activo" : "inactivo"
                  fila.querySelector(".estado-badge").textContent = nuevoEstado
                  fila.querySelector(".estado-badge").className = `estado-badge ${estadoClase}`
                  fila.setAttribute("data-estado", estadoClase === "activo" ? "activos" : "inactivos")
                }
              })

              const cantidad = empleadosSeleccionados.length

              // Limpia la selección de empleados
              opcionesEstado.forEach((op) => op.classList.remove("seleccionado"))
              estadoSeleccionado = null
              document.querySelectorAll(".checkbox-empleado").forEach((cb) => (cb.checked = false))
              empleadosSeleccionados = []

              cerrarModal(modalCambiarEstado)

              // Mostrar la alerta de éxito con SweetAlert2
              Swal.fire({
                title: "Estado actualizado",
                text: `Se actualizó el estado de ${cantidad} empleado(s).`,
                icon: "success",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#3085d6",
              })

              actualizarEmpleadosSeleccionados()
            } else {
              Swal.fire({
                icon: "error",
                title: "Error al actualizar estado",
                text: data.message || "Hubo un error inesperado.",
              })
            }
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Error inesperado",
              text: error,
            })
          })
      }
    })
  })

  // === ABRIR MODAL CAMBIO DE ESTADO ===
  btnCambiarEstado.addEventListener("click", () => {
    if (empleadosSeleccionados.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Selecciona empleados",
        text: "Por favor, selecciona al menos un empleado para cambiar su estado.",
      })
    } else {
      abrirModal(modalCambiarEstado)
    }
  })

  // === EVENTOS GENERALES ===
  btnCambiarEstado.addEventListener("click", () => {
    if (empleadosSeleccionados.length === 0) {
      alert("Por favor, seleccione al menos un empleado")
    } else {
      abrirModal(modalCambiarEstado)
    }
  })

  btnAgregar.addEventListener("click", () => abrirModal(modalAgregarEmpleado))
  cerrarModalEstado.addEventListener("click", () => cerrarModal(modalCambiarEstado))
  cerrarModalAgregar.addEventListener("click", () => {
    cerrarModal(modalAgregarEmpleado)
    resetearVerificacionEmail()
    ocultarSeccionVerificacion()
  })
  cerrarModalExito.addEventListener("click", () => cerrarModal(modalExito))
  btnCancelarAgregar.addEventListener("click", () => {
    cerrarModal(modalAgregarEmpleado)
    resetearVerificacionEmail()
    ocultarSeccionVerificacion()
  })
  modalOverlay.addEventListener("click", cerrarTodosLosModales)
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") cerrarTodosLosModales()
  })

  // Add proper event listeners for modal buttons
  if (btnAgregar) {
    btnAgregar.addEventListener("click", () => {
      console.log("Abriendo modal agregar empleado")
      abrirModal(modalAgregarEmpleado)
    })
  }

  if (btnCambiarEstado) {
    btnCambiarEstado.addEventListener("click", () => {
      if (empleadosSeleccionados.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "Selecciona empleados",
          text: "Por favor, selecciona al menos un empleado para cambiar su estado.",
        })
      } else {
        console.log("Abriendo modal cambiar estado")
        abrirModal(modalCambiarEstado)
      }
    })
  }

  if (cerrarModalEstado) {
    cerrarModalEstado.addEventListener("click", () => cerrarModal(modalCambiarEstado))
  }

  if (cerrarModalAgregar) {
    cerrarModalAgregar.addEventListener("click", () => {
      cerrarModal(modalAgregarEmpleado)
      resetearVerificacionEmail()
      ocultarSeccionVerificacion()
    })
  }

  if (cerrarModalExito) {
    cerrarModalExito.addEventListener("click", () => cerrarModal(modalExito))
  }

  if (btnCancelarAgregar) {
    btnCancelarAgregar.addEventListener("click", () => {
      cerrarModal(modalAgregarEmpleado)
      resetearVerificacionEmail()
      ocultarSeccionVerificacion()
    })
  }

  if (modalOverlay) {
    modalOverlay.addEventListener("click", cerrarTodosLosModales)
  }

  let filasPorPagina = 10,
    paginaActual = 1

  function paginarTabla() {
    const filas = Array.from(document.querySelectorAll("#tabla_empleados_body tr")).filter(
      (fila) => fila.style.display !== "none",
    )
    const totalPaginas = Math.ceil(filas.length / filasPorPagina)
    const paginacion = document.getElementById("paginacion")

    function mostrarPagina(pagina) {
      paginaActual = pagina
      const inicio = (pagina - 1) * filasPorPagina
      const fin = inicio + filasPorPagina

      document.querySelectorAll("#tabla_empleados_body tr").forEach((fila) => (fila.style.display = "none"))
      filas.slice(inicio, fin).forEach((fila) => (fila.style.display = ""))
      paginacion.innerHTML = ""
      for (let i = 1; i <= totalPaginas; i++) {
        const btn = document.createElement("button")
        btn.textContent = i
        if (i === pagina) btn.classList.add("activo")
        btn.addEventListener("click", () => mostrarPagina(i))
        paginacion.appendChild(btn)
      }
    }

    if (totalPaginas > 0) mostrarPagina(paginaActual)
    else paginacion.innerHTML = ""
  }

  document.getElementById("buscarEmpleado").addEventListener("input", filtrarEmpleados)
  document.getElementById("filtroEmpleados").addEventListener("change", filtrarEmpleados)
  document.getElementById("filtroEmpleadosEstado").addEventListener("change", filtrarEmpleados)
  // === FILTROS Y PAGINACIÓN ===
  function filtrarEmpleados() {
    const textoBusqueda = document.getElementById("buscarEmpleado").value.toLowerCase()
    const filtro = document.getElementById("filtroEmpleados").value
    const filtroEstado = document.getElementById("filtroEmpleadosEstado").value
    const filas = document.querySelectorAll(".tabla-empleados tbody tr")
    filas.forEach((fila) => {
      const estadoEmpleado = fila.getAttribute("data-estado") // activos o inactivos
      const coincideEstado = filtroEstado === "todos" || filtroEstado === "" || estadoEmpleado === filtroEstado
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
    paginarTabla() // Siempre actualizar la paginación después del filtro
  }

  // Inicializar estado del botón confirmar
  actualizarEstadoBotonConfirmar()
  actualizarEmpleadosSeleccionados()
  paginarTabla()
}

// Fix the initialization at the end of the file
document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 Inicializando módulos de seguridad...")

  // Verificar que la función existe antes de llamarla
  if (typeof window.initSecurityModals === "function") {
    try {
      window.initSecurityModals()
      console.log("✅ initSecurityModals ejecutado correctamente")
    } catch (error) {
      console.error("❌ Error en initSecurityModals:", error)
    }
  } else {
    console.error("❌ initSecurityModals no está definido")
  }
})
