class PasswordRecovery {
    constructor() {
        this.attempts = 3
        this.userEmail = ""
        this.apiBaseUrl = "http://127.0.0.1:5000"
        this.csrfToken = this.getCookie("csrf_token") // Si usas cookie para CSRF
        this.init()
    }

    init() {
        this.bindEvents()
        console.log("🚀 Sistema Valle Reque iniciado")
        console.log("🌐 Conectando a:", this.apiBaseUrl)
        this.createNotificationContainer()
    }

    // Crear contenedor para notificaciones
    createNotificationContainer() {
        if (!document.getElementById("notification-container")) {
            const container = document.createElement("div")
            container.id = "notification-container"
            container.style.position = "fixed"
            container.style.top = "20px"
            container.style.right = "20px"
            container.style.zIndex = "9999"
            container.style.width = "300px"
            document.body.appendChild(container)
        }
    }

    // Mostrar notificación (tipo: 'success' | 'error')
    showNotification(message, type = "success", duration = 3000) {
        const container = document.getElementById("notification-container")
        const notification = document.createElement("div")
        notification.textContent = message
        notification.style.padding = "12px 20px"
        notification.style.marginTop = "10px"
        notification.style.borderRadius = "5px"
        notification.style.color = "#fff"
        notification.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)"
        notification.style.fontWeight = "bold"
        notification.style.opacity = "0"
        notification.style.transition = "opacity 0.3s ease"

        if (type === "success") {
            notification.style.backgroundColor = "#4CAF50"
        } else if (type === "error") {
            notification.style.backgroundColor = "#F44336"
        } else {
            notification.style.backgroundColor = "#333"
        }

        container.appendChild(notification)

        // Forzar reflow para animación
        void notification.offsetWidth
        notification.style.opacity = "1"

        setTimeout(() => {
            notification.style.opacity = "0"
            notification.addEventListener("transitionend", () => {
                notification.remove()
            })
        }, duration)
    }

    // Obtener valor de cookie por nombre
    getCookie(name) {
        const value = `; ${document.cookie}`
        const parts = value.split(`; ${name}=`)
        if (parts.length === 2) return parts.pop().split(";").shift()
        return null
    }

    bindEvents() {
        // Evento para abrir modal de recuperación
        document.getElementById("forgotPasswordLink").addEventListener("click", (e) => {
            e.preventDefault()
            this.openEmailModal()
        })

        // Eventos para cerrar modales
        document.getElementById("closeEmailModal").addEventListener("click", () => {
            this.closeModal("emailModal")
        })

        document.getElementById("closeCodeModal").addEventListener("click", () => {
            this.closeModal("codeModal")
        })

        document.getElementById("closeNewPasswordModal").addEventListener("click", () => {
            this.closeModal("newPasswordModal")
        })

        // Cerrar modal al hacer clic fuera
        window.addEventListener("click", (e) => {
            if (e.target.classList.contains("modal")) {
                e.target.style.display = "none"
            }
        })

        // Formulario de email
        document.getElementById("emailForm").addEventListener("submit", (e) => {
            e.preventDefault()
            this.handleEmailSubmit()
        })

        // Formulario de código
        document.getElementById("codeForm").addEventListener("submit", (e) => {
            e.preventDefault()
            this.handleCodeSubmit()
        })

        // Reenviar código
        document.getElementById("resendCode").addEventListener("click", () => {
            this.resendCode()
        })

        // Formulario de nueva contraseña
        document.getElementById("newPasswordForm").addEventListener("submit", (e) => {
            e.preventDefault()
            this.handleNewPasswordSubmit()
        })

        // Auto-focus en inputs de código
        this.setupCodeInputs()

        // Formulario de login principal
        document.getElementById("loginForm").addEventListener("submit", (e) => {
            e.preventDefault()
            this.handleLogin()
        })
    }

    openEmailModal() {
        document.getElementById("emailModal").style.display = "block"
        document.getElementById("recoveryEmail").focus()
    }

    closeModal(modalId) {
        document.getElementById(modalId).style.display = "none"
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    async handleEmailSubmit() {
        const emailInput = document.getElementById("recoveryEmail")
        const email = emailInput.value.trim()

        if (!this.validateEmail(email)) {
            this.showNotification("Por favor, ingresa un correo electrónico válido", "error")
            return
        }

        this.userEmail = email
        await this.sendVerificationCode()
    }

    async sendVerificationCode() {
        try {
            // Extraer el token CSRF desde el DOM
            const csrfToken = document.querySelector('input[name="csrf_token"]').value;
            this.showNotification("Enviando código a tu correo...", "success", 1500)

            const response = await fetch(`/verificar-correo`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify({
                    correo: this.userEmail,
                }),
                credentials: "include", // si el backend usa cookies para CSRF
            })

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(`Error del servidor: ${response.status} - ${errorText}`)
            }

            const data = await response.json()

            if (data.success) {
                this.showNotification("¡Código enviado! Revisa tu correo electrónico", "success")
                setTimeout(() => {
                    this.closeModal("emailModal")
                    this.openCodeModal()
                }, 1500)
            } else {
                this.showNotification(data.message || "Error al enviar el código", "error")
            }
        } catch (error) {
            console.error("Error enviando código:", error)
            this.showNotification("Error de conexión o de servidor. Verifica que el backend esté funcionando y el correo sea válido.", "error")
        }
    }

    openCodeModal() {
        document.getElementById("codeModal").style.display = "block"
        document.getElementById("emailSent").textContent = `Código enviado a: ${this.userEmail}`
        document.getElementById("remainingAttempts").textContent = this.attempts
        document.getElementById("code1").focus()
    }

    setupCodeInputs() {
        const codeInputs = ["code1", "code2", "code3"]

        codeInputs.forEach((inputId, index) => {
            const input = document.getElementById(inputId)

            input.addEventListener("input", (e) => {
                const value = e.target.value.replace(/\D/g, "") // Solo números
                e.target.value = value

                // Auto-focus al siguiente input
                if (value.length === 3 && index < codeInputs.length - 1) {
                    document.getElementById(codeInputs[index + 1]).focus()
                }
            })

            input.addEventListener("keydown", (e) => {
                // Backspace para ir al input anterior
                if (e.key === "Backspace" && e.target.value === "" && index > 0) {
                    document.getElementById(codeInputs[index - 1]).focus()
                }
            })

            input.addEventListener("paste", (e) => {
                e.preventDefault()
                const pastedData = e.clipboardData.getData("text").replace(/\D/g, "")

                if (pastedData.length === 9) {
                    document.getElementById("code1").value = pastedData.substring(0, 3)
                    document.getElementById("code2").value = pastedData.substring(3, 6)
                    document.getElementById("code3").value = pastedData.substring(6, 9)
                    document.getElementById("code3").focus()
                }
            })
        })
    }

    async handleCodeSubmit() {
        const code1 = document.getElementById("code1").value
        const code2 = document.getElementById("code2").value
        const code3 = document.getElementById("code3").value

        const enteredCode = code1 + code2 + code3

        if (enteredCode.length !== 9) {
            this.showCodeError("Por favor, ingresa el código completo")
            return
        }

        try {
            const csrfToken = document.querySelector('input[name="csrf_token"]').value;
            this.showLoading("Verificando código...")

            const response = await fetch(`/verificar-codigo`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify({
                    codigo: enteredCode
                }),
            })

            const data = await response.json()

            if (data.success) {
                this.showSuccess("¡Código verificado correctamente!")
                setTimeout(() => {
                    this.closeModal("codeModal")
                    this.openNewPasswordModal()
                }, 1500)
            } else {
                this.showCodeError(data.message || "Código incorrecto")
                if (data.remaining_attempts !== undefined) {
                    document.getElementById("remainingAttempts").textContent = data.remaining_attempts
                }
                this.shakeCodeInputs()
                this.clearCodeInputs()
            }
        } catch (error) {
            console.error("Error verificando código:", error)
            this.showCodeError("Error de conexión. Intenta nuevamente.")
        } finally {
            this.hideLoading()
        }
    }

    showCodeError(message) {
        const codeInputs = ["code1", "code2", "code3"]
        codeInputs.forEach((inputId) => {
            document.getElementById(inputId).classList.add("error")
        })

        setTimeout(() => {
            codeInputs.forEach((inputId) => {
                document.getElementById(inputId).classList.remove("error")
            })
        }, 3000)

        this.showError(message)
    }

    shakeCodeInputs() {
        const container = document.querySelector(".code-input-container")
        container.classList.add("shake")
        setTimeout(() => {
            container.classList.remove("shake")
        }, 500)
    }

    clearCodeInputs() {
        document.getElementById("code1").value = ""
        document.getElementById("code2").value = ""
        document.getElementById("code3").value = ""
        document.getElementById("code1").focus()
    }

    async resendCode() {
        this.attempts = 3
        await this.sendVerificationCode()
        document.getElementById("remainingAttempts").textContent = this.attempts
        this.clearCodeInputs()
    }

    openNewPasswordModal() {
        document.getElementById("newPasswordModal").style.display = "block"
        document.getElementById("newPassword").focus()
    }

    async handleNewPasswordSubmit() {
        const newPassword = document.getElementById("newPassword").value
        const confirmPassword = document.getElementById("confirmPassword").value

        if (!newPassword || !confirmPassword) {
            this.showError("Por favor, completa todos los campos.");
            return;
        }

        if (newPassword.length < 6) {
            this.showError("La contraseña debe tener al menos 6 caracteres")
            return
        }

        if (newPassword !== confirmPassword) {
            this.showError("Las contraseñas no coinciden")
            return
        }

        try {
            const csrfToken = document.querySelector('input[name="csrf_token"]').value;
            this.showLoading("Cambiando contraseña...")

            const response = await fetch(`/cambiar-contrasena`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify({
                    nueva_contrasena: newPassword,
                    confirmar_contrasena: confirmPassword
                }),
            })

            const data = await response.json()

            if (data.success) {
                this.showSuccess("Contraseña cambiada con éxito")
                setTimeout(() => {
                    this.closeModal("newPasswordModal")
                }, 1500)
            } else {
                this.showError(data.message || "Error cambiando contraseña")
            }
        } catch (error) {
            console.error("Error cambiando contraseña:", error)
            this.showError("Error de conexión o del servidor")
        } finally {
            this.hideLoading()
        }
    }

    async handleLogin() {
        const username = document.getElementById("username").value.trim()
        const password = document.getElementById("password").value

        if (!username || !password) {
            this.showNotification("Ingresa usuario y contraseña", "error")
            return
        }

        try {
            const csrfToken = document.querySelector('input[name="csrf_token"]').value;
            this.showNotification("Iniciando sesión...", "success", 1500)

            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);

            const response = await fetch(`/login`, {
                method: "POST",
                headers: {
                    'X-CSRFToken': csrfToken
                },
                body: formData,
                credentials: "include",
            })


            if (response.redirected) {
                // Si el backend redirige, seguimos la redirección
                window.location.href = response.url;
            } else if (response.status === 200) {
                // Si no hubo redirect, probablemente falló el login
                // Podemos mostrar un mensaje de error si tienes un área para ello
                this.showNotification("Usuario o contraseña incorrectos", "error")
            } else {
                this.showNotification("Error en la autenticación", "error")
            }
        } catch (error) {
            console.error("Error en login:", error)
            this.showNotification("Error de conexión", "error")
        }
    }


    showLoading(message = "Cargando...") {
        // Implementa tu lógica para mostrar un spinner o mensaje de carga
        console.log("Loading:", message)
    }

    hideLoading() {
        // Oculta spinner o mensaje de carga
        console.log("Loading terminado")
    }

    showError(message) {
        this.showNotification(message, "error")
    }

    showSuccess(message) {
        this.showNotification(message, "success")
    }
}

const passwordRecovery = new PasswordRecovery()
