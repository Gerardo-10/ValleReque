// Función para manejar la verificación de email en el formulario de clientes
function initEmailVerification() {
    console.log("🔧 Inicializando verificación de email en clientes...")

    // Verificar que los elementos existan
    const btnVerificarEmail = document.getElementById("btnVerificarEmail")
    const correoInput = document.getElementById("correoElectronicoCliente")

    if (!btnVerificarEmail || !correoInput) {
        console.warn("⚠️ Elementos de verificación de email no encontrados")
        return
    }

    // Event listener para mostrar sección de verificación
    correoInput.addEventListener("input", function(e) {
        const email = e.target.value.trim()
        const verificationSection = document.getElementById("emailVerificationSection")

        if (email && isValidEmail(email)) {
            if (verificationSection) {
                verificationSection.style.display = "block"
            }
        } else {
            if (verificationSection) {
                verificationSection.style.display = "none"
            }
        }
    })

    // Event listener para el botón de verificar
    btnVerificarEmail.addEventListener("click", function(e) {
        e.preventDefault()
        abrirModalVerificacion()
    })

    console.log("✅ Verificación de email inicializada")
}

function abrirModalVerificacion() {
    const emailInput = document.getElementById("correoElectronicoCliente")
    if (!emailInput) {
        mostrarMensaje("Campo de email no encontrado", "error")
        return
    }

    const email = emailInput.value.trim()
    if (!email) {
        mostrarMensaje("Por favor ingresa un email antes de verificar", "error")
        emailInput.focus()
        return
    }

    if (!isValidEmail(email)) {
        mostrarMensaje("Por favor ingresa un email válido", "error")
        emailInput.focus()
        return
    }

    // Validar que sea Gmail o Hotmail
    if (!email.endsWith("@gmail.com") && !email.endsWith("@hotmail.com")) {
        mostrarMensaje("Solo se permiten correos de Gmail o Hotmail", "error")
        emailInput.focus()
        return
    }

    // Guardar email actual
    window.currentVerificationEmail = email

    // Configurar modal
    const emailConfirmacion = document.getElementById("emailConfirmacion")
    if (emailConfirmacion) {
        emailConfirmacion.value = email
    }

    // Mostrar modal
    mostrarModal("modalVerificacionEmail")
    irAPaso(1)
}

async function enviarCodigoVerificacion() {
    const email = window.currentVerificationEmail
    if (!email) {
        mostrarMensaje("Email no válido", "error")
        return
    }

    try {
        setButtonLoading("btnEnviarCodigo", true)
        console.log("🚀 Enviando código a:", email)

        const response = await fetch("/api/send-verification-code", {
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

        console.log("📡 Respuesta del servidor:", response.status, response.statusText)

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log("📦 Datos recibidos:", data)

        if (data.success) {
            // Mostrar el código en modo prueba
            let mensaje = "Código enviado exitosamente. Revisa tu email."
            if (data.message && data.message.includes("CÓDIGO PARA PRUEBA:")) {
                const codigo = data.message.split("CÓDIGO PARA PRUEBA: ")[1]
                mensaje = `MODO PRUEBA: Tu código es ${codigo}. Cópialo en el siguiente paso.`
            }

            mostrarMensaje(mensaje, "success")
            irAPaso(2)
            iniciarContadorReenvio()

            // Mostrar email en paso 2
            const emailMostrado = document.getElementById("emailMostrado")
            if (emailMostrado) {
                emailMostrado.textContent = email
            }
        } else {
            mostrarMensaje(data.message || "Error enviando código", "error")
        }
    } catch (error) {
        console.error("❌ Error:", error)
        mostrarMensaje("Error de conexión. Intenta nuevamente.", "error")
    } finally {
        setButtonLoading("btnEnviarCodigo", false)
    }
}

async function verificarCodigo() {
    const codigoInput = document.getElementById("codigoVerificacion")
    if (!codigoInput) {
        mostrarMensaje("Campo de código no encontrado", "error")
        return
    }

    const codigo = codigoInput.value.trim().toUpperCase()
    if (!codigo) {
        mostrarMensaje("Por favor ingresa el código de verificación", "error")
        codigoInput.focus()
        return
    }

    if (codigo.length !== 7) {
        mostrarMensaje("El código debe tener formato XXX-XXX", "error")
        codigoInput.focus()
        return
    }

    try {
        setButtonLoading("btnVerificarCodigo", true)
        console.log("🔍 Verificando código:", codigo, "para email:", window.currentVerificationEmail)

        const response = await fetch("/api/verify-code", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCSRFToken(),
            },
            body: JSON.stringify({
                email: window.currentVerificationEmail,
                code: codigo,
            }),
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log("✅ Verificación:", data)

        if (data.success) {
            mostrarMensaje("¡Email verificado exitosamente!", "success")
            window.emailVerified = true
            updateVerificationStatus(true)
            ocultarModal("modalVerificacionEmail")
            limpiarFormularioVerificacion()
            detenerContador()

            // Habilitar botón de confirmar del formulario principal
            habilitarBotonConfirmar()
        } else {
            mostrarMensaje(data.message || "Código inválido", "error")
            codigoInput.focus()
            codigoInput.select()
        }
    } catch (error) {
        console.error("❌ Error:", error)
        mostrarMensaje("Error de conexión. Intenta nuevamente.", "error")
    } finally {
        setButtonLoading("btnVerificarCodigo", false)
    }
}

// Funciones auxiliares
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
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

function getCSRFToken() {
    const token = document.querySelector("meta[name=csrf-token]")
    return token ? token.getAttribute("content") : ""
}

function mostrarMensaje(mensaje, tipo) {
    if (typeof Swal !== "undefined") {
        if (tipo === "success") {
            Swal.fire({
                icon: "success",
                title: "¡Éxito!",
                text: mensaje,
                timer: 5000,
                showConfirmButton: true,
            })
        } else {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: mensaje,
                timer: 4000,
                showConfirmButton: false,
            })
        }
    } else {
        alert(mensaje)
    }
}

function mostrarModal(modalId) {
    const modal = document.getElementById(modalId)
    const overlay = document.getElementById("modalOverlay")

    if (modal) {
        modal.style.display = "flex"
        document.body.style.overflow = "hidden"
    }
    if (overlay) {
        overlay.style.display = "block"
    }
}

function ocultarModal(modalId) {
    const modal = document.getElementById(modalId)
    const overlay = document.getElementById("modalOverlay")

    if (modal) {
        modal.style.display = "none"
        document.body.style.overflow = "auto"
    }
    if (overlay) {
        overlay.style.display = "none"
    }
}

function setButtonLoading(buttonId, loading) {
    const button = document.getElementById(buttonId)
    if (!button) return

    if (loading) {
        button.disabled = true
        button.dataset.originalText = button.textContent
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cargando...'
    } else {
        button.disabled = false
        button.innerHTML = button.dataset.originalText || button.textContent
    }
}

function irAPaso(paso) {
    const paso1 = document.getElementById("pasoConfirmarEmail")
    const paso2 = document.getElementById("pasoVerificarCodigo")
    const step1 = document.getElementById("step1")
    const step2 = document.getElementById("step2")
    const line1 = document.getElementById("line1")

    if (paso === 1) {
        if (paso1) paso1.style.display = "block"
        if (paso2) paso2.style.display = "none"
        if (step1) step1.className = "step active"
        if (step2) step2.className = "step inactive"
        if (line1) line1.className = "step-line"
    } else if (paso === 2) {
        if (paso1) paso1.style.display = "none"
        if (paso2) paso2.style.display = "block"
        if (step1) step1.className = "step active"
        if (step2) step2.className = "step active"
        if (line1) line1.className = "step-line active"

        setTimeout(() => {
            const codigoInput = document.getElementById("codigoVerificacion")
            if (codigoInput) {
                codigoInput.focus()
            }
        }, 100)
    }
}

function updateVerificationStatus(verified) {
    const emailStatus = document.getElementById("emailStatus")
    const btnVerificar = document.getElementById("btnVerificarEmail")

    if (!emailStatus) return

    if (verified) {
        emailStatus.innerHTML = `
            <i class="fas fa-check-circle email-verified"></i>
            <span class="email-verified">Email verificado ✓</span>
        `
        if (btnVerificar) {
            btnVerificar.style.display = "none"
        }
    } else {
        emailStatus.innerHTML = `
            <i class="fas fa-exclamation-circle email-unverified"></i>
            <span class="email-unverified">Email no verificado</span>
        `
        if (btnVerificar) {
            btnVerificar.style.display = "inline-block"
        }
    }
}

function habilitarBotonConfirmar() {
    const btnConfirmar = document.getElementById("btnConfirmarAgregar")
    if (btnConfirmar) {
        btnConfirmar.disabled = false
        btnConfirmar.title = ""
    }
}

function limpiarFormularioVerificacion() {
    const codigoInput = document.getElementById("codigoVerificacion")
    if (codigoInput) {
        codigoInput.value = ""
    }
}

function iniciarContadorReenvio() {
    const btnReenviar = document.getElementById("btnReenviarCodigo")
    const contadorDiv = document.getElementById("contadorReenvio")

    if (!btnReenviar || !contadorDiv) return

    let countdown = 60
    btnReenviar.disabled = true
    contadorDiv.style.display = "block"

    window.countdownInterval = setInterval(() => {
        contadorDiv.textContent = `Puedes reenviar en ${countdown} segundos`
        countdown--

        if (countdown < 0) {
            detenerContador()
        }
    }, 1000)
}

function detenerContador() {
    if (window.countdownInterval) {
        clearInterval(window.countdownInterval)
        window.countdownInterval = null
    }

    const btnReenviar = document.getElementById("btnReenviarCodigo")
    const contadorDiv = document.getElementById("contadorReenvio")

    if (btnReenviar) {
        btnReenviar.disabled = false
    }
    if (contadorDiv) {
        contadorDiv.style.display = "none"
    }
}

// Event listeners para el modal
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar verificación de email
    initEmailVerification()

    // Event listeners para botones del modal
    const btnEnviarCodigo = document.getElementById("btnEnviarCodigo")
    const btnVerificarCodigo = document.getElementById("btnVerificarCodigo")
    const btnReenviarCodigo = document.getElementById("btnReenviarCodigo")
    const btnVolverEmail = document.getElementById("btnVolverEmail")
    const btnCancelarVerificacion = document.getElementById("btnCancelarVerificacion")
    const cerrarModalVerificacion = document.getElementById("cerrarModalVerificacion")

    if (btnEnviarCodigo) {
        btnEnviarCodigo.addEventListener("click", enviarCodigoVerificacion)
    }

    if (btnVerificarCodigo) {
        btnVerificarCodigo.addEventListener("click", verificarCodigo)
    }

    if (btnReenviarCodigo) {
        btnReenviarCodigo.addEventListener("click", async function() {
            try {
                setButtonLoading("btnReenviarCodigo", true)

                const response = await fetch("/api/resend-verification-code", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": getCSRFToken(),
                    },
                    body: JSON.stringify({
                        email: window.currentVerificationEmail,
                        user_name: getUserName(),
                    }),
                })

                const data = await response.json()

                if (data.success) {
                    let mensaje = "Código reenviado exitosamente"
                    if (data.message && data.message.includes("CÓDIGO PARA PRUEBA:")) {
                        const codigo = data.message.split("CÓDIGO PARA PRUEBA: ")[1]
                        mensaje = `MODO PRUEBA: Tu nuevo código es ${codigo}`
                    }

                    mostrarMensaje(mensaje, "success")
                    iniciarContadorReenvio()

                    const codigoInput = document.getElementById("codigoVerificacion")
                    if (codigoInput) {
                        codigoInput.value = ""
                        codigoInput.focus()
                    }
                } else {
                    mostrarMensaje(data.message || "Error reenviando código", "error")
                }
            } catch (error) {
                console.error("❌ Error:", error)
                mostrarMensaje("Error de conexión. Intenta nuevamente.", "error")
            } finally {
                setButtonLoading("btnReenviarCodigo", false)
            }
        })
    }

    if (btnVolverEmail) {
        btnVolverEmail.addEventListener("click", function() {
            irAPaso(1)
            detenerContador()
        })
    }

    if (btnCancelarVerificacion) {
        btnCancelarVerificacion.addEventListener("click", function() {
            ocultarModal("modalVerificacionEmail")
            limpiarFormularioVerificacion()
            detenerContador()
        })
    }

    if (cerrarModalVerificacion) {
        cerrarModalVerificacion.addEventListener("click", function() {
            ocultarModal("modalVerificacionEmail")
            limpiarFormularioVerificacion()
            detenerContador()
        })
    }

    // Formatear código mientras se escribe
    const codigoInput = document.getElementById("codigoVerificacion")
    if (codigoInput) {
        codigoInput.addEventListener("input", function(e) {
            let value = e.target.value.replace(/[^A-Z0-9]/g, "")

            if (value.length > 6) {
                value = value.substring(0, 6)
            }

            // Formatear como XXX-XXX
            if (value.length > 3) {
                value = value.substring(0, 3) + "-" + value.substring(3)
            }

            e.target.value = value
        })
    }

    console.log("✅ Event listeners de verificación de email configurados")
})
