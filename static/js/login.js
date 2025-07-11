class PasswordRecovery {
  constructor() {
    this.attempts = 3;
    this.userEmail = "";
    this.apiBaseUrl = "http://127.0.0.1:5000";
    this.csrfToken = this.getCookie("csrf_token"); // Si usas cookie para CSRF
    this.init();
  }

  init() {
    this.bindEvents();
    console.log("🚀 Sistema Valle Reque iniciado");
    console.log("🌐 Conectando a:", this.apiBaseUrl);
    this.createNotificationContainer();
  }

  // Crear contenedor para notificaciones
  createNotificationContainer() {
    if (!document.getElementById("notification-container")) {
      const container = document.createElement("div");
      container.id = "notification-container";
      container.style.position = "fixed";
      container.style.top = "20px";
      container.style.right = "20px";
      container.style.zIndex = "9999";
      container.style.width = "300px";
      document.body.appendChild(container);
    }
  }

  // Mostrar notificación (tipo: 'success' | 'error')
  showNotification(message, type = "success", duration = 3000) {
    const container = document.getElementById("notification-container");
    const notification = document.createElement("div");
    notification.textContent = message;
    notification.style.padding = "12px 20px";
    notification.style.marginTop = "10px";
    notification.style.borderRadius = "5px";
    notification.style.color = "#fff";
    notification.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
    notification.style.fontWeight = "bold";
    notification.style.opacity = "0";
    notification.style.transition = "opacity 0.3s ease";

    if (type === "success") {
      notification.style.backgroundColor = "#4CAF50";
    } else if (type === "error") {
      notification.style.backgroundColor = "#F44336";
    } else {
      notification.style.backgroundColor = "#333";
    }

    container.appendChild(notification);

    // Forzar reflow para animación
    void notification.offsetWidth;
    notification.style.opacity = "1";

    setTimeout(() => {
      notification.style.opacity = "0";
      notification.addEventListener("transitionend", () => {
        notification.remove();
      });
    }, duration);
  }

  // Obtener valor de cookie por nombre
  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  }

  abrirModalPorId(modalId) {
    const modalElement = document.getElementById(modalId);
    if (!modalElement)
      return console.warn(`No se encontró el modal con id: ${modalId}`);

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }

  cerrarModalPorId(modalId) {
    const modalElement = document.getElementById(modalId);
    if (!modalElement)
      return console.warn(`No se encontró el modal con id: ${modalId}`);

    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    const modal = modalInstance || new bootstrap.Modal(modalElement);

    modal.hide();
  }

  bindEvents() {
    document.querySelectorAll(".toggle-password").forEach((button) => {
      button.addEventListener("click", () => {
        const input = button.previousElementSibling;
        const icon = button.querySelector("i");

        const isPassword = input.type === "password";
        input.type = isPassword ? "text" : "password";

        icon.classList.toggle("fa-eye");
        icon.classList.toggle("fa-eye-slash");
      });
    });

    // Formulario de email
    document.getElementById("emailForm").addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleEmailSubmit();
    });

    // Formulario de código
    document.getElementById("codeForm").addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleCodeSubmit();
    });

    // Reenviar código
    document.getElementById("resendCode").addEventListener("click", () => {
      this.resendCode();
    });

    // Formulario de nueva contraseña
    document
      .getElementById("newPasswordForm")
      .addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleNewPasswordSubmit();
      });

    // Auto-focus en inputs de código
    this.setupCodeInputs();

    // Formulario de login principal
    document.getElementById("loginForm").addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleLogin();
    });
    document
      .getElementById("formCambiarPassword")
      .addEventListener("submit", (e) => {
        e.preventDefault();
        this.handlePasswordUpdate();
      });
  }

  validateEmail(email) {
    // Solo acepta correos @gmail.com o @hotmail.com
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail|hotmail)\.com$/i;
    return emailRegex.test(email);
  }

  async handleEmailSubmit() {
    const emailInput = document.getElementById("recoveryEmail");
    const email = emailInput.value.trim();

    if (!this.validateEmail(email)) {
      this.showNotification(
        "Por favor, ingresa un correo electrónico válido",
        "error"
      );
      return;
    }

    this.userEmail = email;
    await this.sendVerificationCode();
  }

  async sendVerificationCode() {
    try {
      // Extraer el token CSRF desde el DOM
      const csrfToken = document.querySelector(
        'input[name="csrf_token"]'
      ).value;
      this.showNotification("Enviando código a tu correo...", "success", 1500);

      const response = await fetch(`/verificar-correo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({
          correo: this.userEmail,
        }),
        credentials: "include", // si el backend usa cookies para CSRF
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Error del servidor: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();

      if (data.success) {
        this.showNotification(
          "¡Código enviado! Revisa tu correo electrónico",
          "success"
        );
        setTimeout(() => {
          this.cerrarModalPorId("emailModal");
          this.notificateSentEmail();
          this.abrirModalPorId("codeModal");
        }, 1500);
      } else {
        this.showNotification(
          data.message || "Error al enviar el código",
          "error"
        );
      }
    } catch (error) {
      console.error("Error enviando código:", error);
      this.showNotification(
        "El correo ingresado no forma parte de la base de datos de la empresa",
        "error"
      );
    }
  }

  notificateSentEmail() {
    document.getElementById(
      "emailSent"
    ).textContent = `Código enviado a: ${this.userEmail}`;

    this.attempts = 3; // Reiniciar intentos
    document.getElementById("remainingAttempts").textContent = this.attempts;

    this.clearCodeInputs();
    document.getElementById("code1").focus();
  }

  setupCodeInputs() {
    const codeInputs = ["code1", "code2", "code3"];

    codeInputs.forEach((inputId, index) => {
      const input = document.getElementById(inputId);

      input.addEventListener("input", (e) => {
        const value = e.target.value.replace(/\D/g, ""); // Solo números
        e.target.value = value;

        // Auto-focus al siguiente input
        if (value.length === 3 && index < codeInputs.length - 1) {
          document.getElementById(codeInputs[index + 1]).focus();
        }
      });

      input.addEventListener("keydown", (e) => {
        // Backspace para ir al input anterior
        if (e.key === "Backspace" && e.target.value === "" && index > 0) {
          document.getElementById(codeInputs[index - 1]).focus();
        }
      });

      input.addEventListener("paste", (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");

        if (pastedData.length === 9) {
          document.getElementById("code1").value = pastedData.substring(0, 3);
          document.getElementById("code2").value = pastedData.substring(3, 6);
          document.getElementById("code3").value = pastedData.substring(6, 9);
          document.getElementById("code3").focus();
        }
      });
    });
  }

  async handleCodeSubmit() {
    const code1 = document.getElementById("code1").value;
    const code2 = document.getElementById("code2").value;
    const code3 = document.getElementById("code3").value;

    // Validación individual
    if (code1.length !== 3 || code2.length !== 3 || code3.length !== 3) {
      this.showCodeError("Cada campo debe tener 3 dígitos");
      return;
    }

    const enteredCode = code1 + code2 + code3;

    if (enteredCode.length !== 9) {
      this.showCodeError("Por favor, ingresa el código completo");
      return;
    }

    try {
      const csrfToken = document.querySelector(
        'input[name="csrf_token"]'
      ).value;
      this.showLoading("Verificando código...");

      const response = await fetch(`/verificar-codigo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({
          codigo: enteredCode,
        }),
      });

      const data = await response.json();

      if (data.success) {
        this.showSuccess("¡Código verificado correctamente!");
        setTimeout(() => {
          this.cerrarModalPorId("codeModal");
          this.abrirModalPorId("newPasswordModal");
        }, 1500);
      } else {
        this.attempts--; // ↓ Restamos intento
        this.showCodeError(data.message || "Código incorrecto");

        if (this.attempts <= 0) {
          this.showError("Has alcanzado el número máximo de intentos.");
          setTimeout(() => {
            this.cerrarModalPorId("codeModal");
          }, 1000);
        }

        document.getElementById("remainingAttempts").textContent =
          this.attempts;
        this.shakeCodeInputs();
        this.clearCodeInputs();
      }
    } catch (error) {
      console.error("Error verificando código:", error);
      this.showCodeError("Error de conexión. Intenta nuevamente.");
    } finally {
      this.hideLoading();
    }
  }

  showCodeError(message) {
    const codeInputs = ["code1", "code2", "code3"];
    codeInputs.forEach((inputId) => {
      document.getElementById(inputId).classList.add("error");
    });

    setTimeout(() => {
      codeInputs.forEach((inputId) => {
        document.getElementById(inputId).classList.remove("error");
      });
    }, 3000);

    this.showError(message);
  }

  shakeCodeInputs() {
    const container = document.querySelector(".code-input-container");
    container.classList.add("shake");
    setTimeout(() => {
      container.classList.remove("shake");
    }, 500);
  }

  clearCodeInputs() {
    document.getElementById("code1").value = "";
    document.getElementById("code2").value = "";
    document.getElementById("code3").value = "";
    document.getElementById("code1").focus();
  }

  async resendCode() {
    this.attempts = 3;
    await this.sendVerificationCode();
    document.getElementById("remainingAttempts").textContent = this.attempts;
    this.clearCodeInputs();
  }

  async handleNewPasswordSubmit() {
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!newPassword || !confirmPassword) {
      this.showError("Por favor, completa todos los campos.");
      return;
    }

    // Validar requisitos de contraseña
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};:'",.<>/?\\|`~]).{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      this.showError(
        "La contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un carácter especial."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      this.showError("Las contraseñas no coinciden");
      return;
    }

    try {
      const csrfToken = document.querySelector(
        'input[name="csrf_token"]'
      ).value;
      this.showLoading("Cambiando contraseña...");

      const response = await fetch(`/cambiar-contrasena`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({
          nueva_contrasena: newPassword,
          confirmar_contrasena: confirmPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        this.showSuccess("Contraseña cambiada con éxito");
        setTimeout(() => {
          this.cerrarModalPorId("newPasswordModal");
        }, 1500);
      } else {
        this.showError(data.message || "Error cambiando contraseña");
      }
    } catch (error) {
      console.error("Error cambiando contraseña:", error);
      this.showError("Error de conexión o del servidor");
    } finally {
      this.hideLoading();
    }
  }

  async handleLogin() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    if (!username || !password) {
      this.showNotification("Ingresa usuario y contraseña", "error");
      return;
    }
    try {
      const csrfToken = document.querySelector(
        'input[name="csrf_token"]'
      ).value;
      this.showNotification("Iniciando sesión...", "info", 1500);
      const remember = document.getElementById("remember").checked;

      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);
      formData.append("remember", remember);
      if (remember) {
        localStorage.setItem("rememberedUsername", username);
      } else {
        localStorage.removeItem("rememberedUsername");
      }

      const response = await fetch(`/login`, {
        method: "POST",
        headers: {
          "X-CSRFToken": csrfToken,
          "X-Requested-With": "XMLHttpRequest",
        },
        body: formData,
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        this.showSuccess("Inicio de sesión exitoso");

        if (data.cambiar_password) {
          setTimeout(() => {
            this.abrirModalPorId("modalCambiarPassword");
          }, 500);
        } else if (data.redirect_url) {
          window.location.href = data.redirect_url;
        }
      } else {
        this.showError(data.message || "Usuario o contraseña incorrectos");
      }
    } catch (error) {
      console.error("Error en login:", error);
      this.showNotification("Error de conexión", "error");
    }
  }

  async handlePasswordUpdate() {
    const actual = document.getElementById("passwordActual").value;
    const nueva = document.getElementById("passwordNueva").value;
    const confirmar = document.getElementById("passwordConfirmar").value;

    if (!actual || !nueva || !confirmar) {
      this.showError("Completa todos los campos");
      return;
    }

    if (nueva !== confirmar) {
      this.showError("Las contraseñas no coinciden");
      return;
    }

    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!regex.test(nueva)) {
      this.showError(
        "La nueva contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un símbolo"
      );
      return;
    }

    try {
      const csrfToken = document.querySelector(
        'input[name="csrf_token"]'
      ).value;

      const response = await fetch("/actualizar_contrasena_inicial", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({
          password_actual: actual,
          password_nueva: nueva,
          password_confirmar: confirmar,
        }),
      });

      const data = await response.json();

      if (data.success) {
        this.showSuccess("Contraseña actualizada correctamente");
        setTimeout(() => {
          this.cerrarModalPorId("modalCambiarPassword");
          window.location.href = "/sidebar";
        }, 1500);
      } else {
        this.showError(data.message || "Error al actualizar contraseña");
      }
    } catch (error) {
      console.error("Error al actualizar contraseña:", error);
      this.showNotification("Error del servidor", "error");
    }
  }

  showLoading(message = "Cargando...") {
    // Implementa tu lógica para mostrar un spinner o mensaje de carga
    console.log("Loading:", message);
  }

  hideLoading() {
    // Oculta spinner o mensaje de carga
    console.log("Loading terminado");
  }

  showError(message) {
    this.showNotification(message, "error");
  }

  showSuccess(message) {
    this.showNotification(message, "success");
  }
}

const passwordRecovery = new PasswordRecovery();

document.addEventListener("DOMContentLoaded", () => {
  const savedUsername = localStorage.getItem("rememberedUsername");
  if (savedUsername) {
    document.getElementById("username").value = savedUsername;
    document.getElementById("remember").checked = true;
  }
});
