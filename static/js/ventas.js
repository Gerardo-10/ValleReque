// Sistema integrado para manejo de ventas inmobiliarias
// Réplica EXACTA de los documentos PDF de Valle Reque

// ==================== SISTEMA DE NOTIFICACIONES ====================
function showNotification(message, type = "success", duration = 3000) {
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
  void notification.offsetWidth
  notification.style.opacity = "1"

  setTimeout(() => {
    notification.style.opacity = "0"
    notification.addEventListener("transitionend", () => {
      notification.remove()
    })
  }, duration)
}

function createNotificationContainer() {
  if (!document.getElementById("notification-container")) {
    const container = document.createElement("div")
    container.id = "notification-container"
    container.style.position = "fixed"
    container.style.top = "20px"
    container.style.right = "20px"
    container.style.zIndex = "9999"
    container.style.width = "300px"
    container.style.maxHeight = "500px"
    container.style.overflowY = "auto"
    document.body.appendChild(container)
  }
}

// ==================== GENERADOR DE PDF EXACTO ====================
function cargarLibreriasPDF(callback) {
  let jsPDFCargado = false
  let html2canvasCargado = false

  function verificarCarga() {
    if (jsPDFCargado && html2canvasCargado && callback) {
      callback()
    }
  }

  if (!window.jspdf) {
    const scriptJsPDF = document.createElement("script")
    scriptJsPDF.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
    scriptJsPDF.onload = () => {
      jsPDFCargado = true
      verificarCarga()
    }
    document.head.appendChild(scriptJsPDF)
  } else {
    jsPDFCargado = true
  }

  if (!window.html2canvas) {
    const scriptHtml2Canvas = document.createElement("script")
    scriptHtml2Canvas.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"
    scriptHtml2Canvas.onload = () => {
      html2canvasCargado = true
      verificarCarga()
    }
    document.head.appendChild(scriptHtml2Canvas)
  } else {
    html2canvasCargado = true
  }

  verificarCarga()
}

function obtenerDatosFormulario() {
  return {
    fecha: "26/05/2025",
    fechaCompleta: "Chiclayo 26 de Mayo del 2025",
    asesor: document.querySelector(".metadatos-info span:last-child")?.textContent || "diazo la",
    dni: document.getElementById("documento-identidad")?.value || "45656893",
    nombres: document.getElementById("nombres-comprador")?.value || "VALLADARES POZO TANIA LILIANA",
    apellidos: document.getElementById("apellidos-comprador")?.value || "",
    estadoEvaluacion: document.getElementById("estado-evaluacion")?.value || "",
    ingresoMensual: document.getElementById("ingreso-mensual")?.value || "1,600.00",
    telefono: document.getElementById("telefono-contacto")?.value || "948433593",
    ocupacion: document.getElementById("ocupacion-laboral")?.value || "SERENAZGO",
    cargaFamiliar: document.getElementById("dependientes-familiares")?.value || "",
    proyecto:
      document.getElementById("proyecto-inmobiliario")?.selectedOptions[0]?.textContent || "Valle Reque - Etapa 2",
    codigoUnidad: document.getElementById("codigo-unidad-habitacional")?.value || "10",
    etapa: document.getElementById("etapa-construccion")?.value || "Etapa 2",
    disponibilidad: document.getElementById("disponibilidad-terreno")?.value || "",
    precio: document.getElementById("precio-propiedad")?.value || "82,545.00",
    tipoUbicacion: document.getElementById("tipo-ubicacion")?.value || "",
    area: document.getElementById("area-terreno")?.value || "60",
    financiamiento: document.getElementById("plan-financiamiento")?.selectedOptions[0]?.textContent || "",
    montoSubsidio: document.getElementById("monto-subsidio")?.value || "44,545.00",
    tasaInteres: document.getElementById("tasa-interes")?.value || "",
    numeroCuotas: document.getElementById("numero-cuotas")?.value || "1",
    fechaPagos: document.getElementById("fecha-vencimiento-cuotas")?.value || "",
    pagoInicial: document.getElementById("pago-inicial")?.value || "30,000.00",
  }
}

function generarHTMLConvenioVentaExacto(datos) {
  return `
    <div class="pdf-content" style="width: 210mm; min-height: 297mm; padding: 15mm 12mm; font-family: Arial, sans-serif; color: #000; background-color: white; margin: 0 auto; font-size: 10px; line-height: 1.2;">
      
      <!-- Header exacto con logo y título -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
        <div style="width: 100px;">
          <!-- Logo Valle Reque-->
          <div style="position: relative; width: 120px; height: 120px;">
              <div style="width: 120px; height: 120px; border-radius: 50%; overflow: hidden; position: relative;">
                <img src="static/img/valle-reque.png" alt="Logo Valle Reque" style="width: 100%; height: 100%; object-fit: cover;">
              </div>
          </div>
        </div>
        <div style="text-align: center; flex: 1; margin-top: 5px;">
          <h1 style="font-size: 20px; font-weight: bold; margin: 0; color: #333; letter-spacing: 1px;">CONVENIO DE VENTA</h1>
          <p style="margin: 5px 0 0 0; font-size: 12px; color: #666; font-weight: normal;">Fecha de Venta : ${datos.fecha}</p>
        </div>
        <div style="width: 100px;"></div>
      </div>

      <!-- Forma de Pago -->
      <div style="border: 2px solid #000; margin-bottom: 2px;">
        <div style="background-color: #f5f5f5; padding: 4px 8px; border-bottom: 1px solid #000; font-size: 9px;">
          Forma de Pago: Voucher depósito en cta
        </div>
      </div>

      <!-- Tabla de información del cliente EXACTA -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 2px; font-size: 9px; border: 2px solid #000;">
        <tr>
          <td style="border-right: 1px solid #000; border-bottom: 1px solid #000; padding: 4px 6px; width: 12%; font-weight: bold; background-color: #f9f9f9;">Cliente</td>
          <td style="border-right: 1px solid #000; border-bottom: 1px solid #000; padding: 4px 6px; width: 48%;">${datos.nombres}</td>
          <td style="border-right: 1px solid #000; border-bottom: 1px solid #000; padding: 4px 6px; width: 12%; font-weight: bold; background-color: #f9f9f9;">DNI</td>
          <td style="border-bottom: 1px solid #000; padding: 4px 6px; width: 28%;">${datos.dni}</td>
        </tr>
        <tr>
          <td style="border-right: 1px solid #000; border-bottom: 1px solid #000; padding: 4px 6px; font-weight: bold; background-color: #f9f9f9;">Dirección</td>
          <td style="border-right: 1px solid #000; border-bottom: 1px solid #000; padding: 4px 6px;">ASE. H VICTOR RAUL HAYA DE LA TORRE MZ.B LT. 2- LAMBAYEQUE</td>
          <td style="border-right: 1px solid #000; border-bottom: 1px solid #000; padding: 4px 6px; font-weight: bold; background-color: #f9f9f9;">Fec. Nac.</td>
          <td style="border-bottom: 1px solid #000; padding: 4px 6px;">1998-06-09</td>
        </tr>
        <tr>
          <td style="border-right: 1px solid #000; border-bottom: 1px solid #000; padding: 4px 6px; font-weight: bold; background-color: #f9f9f9;">Email</td>
          <td style="border-right: 1px solid #000; border-bottom: 1px solid #000; padding: 4px 6px;">valladarespozo_tania@hotmail.com</td>
          <td style="border-right: 1px solid #000; border-bottom: 1px solid #000; padding: 4px 6px; font-weight: bold; background-color: #f9f9f9;">Celular</td>
          <td style="border-bottom: 1px solid #000; padding: 4px 6px;">${datos.telefono}</td>
        </tr>
        <tr>
          <td style="border-right: 1px solid #000; padding: 4px 6px; font-weight: bold; background-color: #f9f9f9;">Ocupación</td>
          <td style="border-right: 1px solid #000; padding: 4px 6px;">${datos.ocupacion}</td>
          <td style="border-right: 1px solid #000; padding: 4px 6px; font-weight: bold; background-color: #f9f9f9;">Ingreso Neto</td>
          <td style="padding: 4px 6px;">S/ ${datos.ingresoMensual}</td>
        </tr>
      </table>

      <!-- Importe de la venta -->
      <div style="border: 2px solid #000; border-top: none; margin-bottom: 2px; padding: 4px 8px; background-color: #f9f9f9; font-size: 9px;">
        <span style="font-weight: normal;">Importe de la venta : S/ ${datos.precio}</span>
      </div>

      <!-- Por concepto de venta -->
      <div style="border: 2px solid #000; border-top: none; margin-bottom: 12px; padding: 4px 8px; background-color: #f9f9f9; font-size: 9px;">
        <span style="font-weight: normal;">Por concepto de venta de la siguiente unidad de vivienda:</span>
      </div>

      <!-- Tabla del proyecto EXACTA -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 9px; border: 2px solid #000;">
        <tr>
          <td style="border-right: 1px solid #000; border-bottom: 1px solid #000; padding: 4px 6px; font-weight: bold; background-color: #f9f9f9; width: 15%;">Proyecto</td>
          <td style="border-right: 1px solid #000; border-bottom: 1px solid #000; padding: 4px 6px; width: 35%;">${datos.proyecto}</td>
          <td style="border-right: 1px solid #000; border-bottom: 1px solid #000; padding: 4px 6px; font-weight: bold; background-color: #f9f9f9; width: 15%;">N° Cuotas</td>
          <td style="border-bottom: 1px solid #000; padding: 4px 6px; width: 35%;">${datos.numeroCuotas}</td>
        </tr>
        <tr>
          <td style="border-right: 1px solid #000; border-bottom: 1px solid #000; padding: 4px 6px; font-weight: bold; background-color: #f9f9f9;">Manzana</td>
          <td style="border-right: 1px solid #000; border-bottom: 1px solid #000; padding: 4px 6px;">E - 1</td>
          <td style="border-right: 1px solid #000; border-bottom: 1px solid #000; padding: 4px 6px; font-weight: bold; background-color: #f9f9f9;">Cuotas</td>
          <td style="border-bottom: 1px solid #000; padding: 4px 6px;">S/ 6,000.00</td>
        </tr>
        <tr>
          <td style="border-right: 1px solid #000; border-bottom: 1px solid #000; padding: 4px 6px; font-weight: bold; background-color: #f9f9f9;">Unidad</td>
          <td style="border-right: 1px solid #000; border-bottom: 1px solid #000; padding: 4px 6px;">${datos.codigoUnidad}</td>
          <td style="border-right: 1px solid #000; border-bottom: 1px solid #000; padding: 4px 6px; font-weight: bold; background-color: #f9f9f9;">Inicial</td>
          <td style="border-bottom: 1px solid #000; padding: 4px 6px;">S/ ${datos.pagoInicial}</td>
        </tr>
        <tr>
          <td style="border-right: 1px solid #000; padding: 4px 6px; font-weight: bold; background-color: #f9f9f9;">Área Lote m2</td>
          <td style="border-right: 1px solid #000; padding: 4px 6px;">${datos.area}</td>
          <td style="border-right: 1px solid #000; padding: 4px 6px; font-weight: bold; background-color: #f9f9f9;">Área Construida m2</td>
          <td style="padding: 4px 6px;">36</td>
        </tr>
      </table>

      <!-- Condiciones EXACTAS -->
      <div style="display: flex; gap: 12px; margin-bottom: 15px;">
        <div style="flex: 1;">
          <h3 style="text-align: center; font-size: 9px; font-weight: bold; margin: 0 0 3px 0; text-transform: uppercase;">CONDICIONES GENERALES DE CUMPLIMIENTO</h3>
          <h4 style="text-align: center; font-size: 8px; font-weight: bold; margin: 0 0 8px 0; text-transform: uppercase;">OBLIGATORIO</h4>
          <div style="font-size: 6px; line-height: 1.3; text-align: justify;">
            <p style="margin: 0 0 4px 0;"><strong>1.</strong> Este documento debe ser presentado junto al certificado de Bono Familiar Habitacional, al momento de hacerse la firma del contrato compra-venta, el cliente indica que tiene conocimiento del cumplimiento de los requisitos del FMV.</p>
            <p style="margin: 0 0 4px 0;"><strong>2.</strong> Si el cliente incumpliera las fechas pactadas en el cronograma o desista automáticamente de la compra, Constructora Valle Reque que corresponde a la empresa, se reserva el derecho de contratar con la adjudicación del inmueble objeto del presente documento, refaccionando el mismo sin acuerdo adicional alguna.</p>
            <p style="margin: 0 0 4px 0;"><strong>3.</strong> Este documento es válido únicamente para la adquisición de una única unidad de vivienda, identificada plenamente, como consta en la parte superior del presente documento.</p>
            <p style="margin: 0 0 4px 0;"><strong>4.</strong> Todos los trámites relacionados a este documento y al contrato que se derive de él, serán de responsabilidad y costo del cliente.</p>
            <p style="margin: 0 0 4px 0;"><strong>5.</strong> Para la validez de este documento, el mismo se debe encontrar debidamente firmado por el cliente y asesor inmobiliario.</p>
            <p style="margin: 0 0 4px 0;"><strong>6.</strong> El cliente deberá haber cumplido con aportar el riesgo del modelo afectado y el aporte del cliente, conforme al cronograma pactado por el FMV.</p>
          </div>
        </div>
        <div style="flex: 1;">
          <h3 style="text-align: center; font-size: 9px; font-weight: bold; margin: 0 0 8px 0; text-transform: uppercase;">CONDICIONES DE CONTRATACIÓN</h3>
          <div style="font-size: 6px; line-height: 1.3; text-align: justify;">
            <p style="margin: 0 0 4px 0;"><strong>I.</strong> El cliente manifiesta su intención de suscribir con la empresa un Compromiso-Contrato de Compraventa, respecto de la unidad de vivienda individualizada en el primer documento.</p>
            <p style="margin: 0 0 4px 0;"><strong>II.</strong> Con la finalidad de asegurar la suscripción del Compromiso-Contrato de Compraventa, el cliente ha entregado a la empresa la suma acordada en este documento.</p>
            <p style="margin: 0 0 4px 0;"><strong>III.</strong> Si el cliente manifiesta su intención de suscribir el Compromiso-Contrato de Compraventa dentro del plazo establecido, previamente en el cronograma.</p>
            <p style="margin: 0 0 4px 0;"><strong>IV.</strong> Si el cliente resuelve el Compromiso-Contrato de Compraventa dentro del plazo establecido previamente, se descontará el 100% del monto.</p>
            <p style="margin: 0 0 4px 0;"><strong>V.</strong> Vivienda deberá devolver al cliente las arras que le fueron entregadas. El cliente autoriza al vendedor el llenado de la letra de cambio firmada.</p>
            <p style="margin: 0 0 4px 0;"><strong>VI.</strong> La empresa puede cancelar las condiciones del vigente convenio de separación de acuerdo con las condiciones del mercado.</p>
            <p style="margin: 0 0 4px 0;"><strong>VII.</strong> La empresa puede cancelar las condiciones del vigente Contrato de Compraventa, considerando un plazo de 24 meses contados a partir del desembolso del cliente por parte del FMV.</p>
            <p style="margin: 0 0 4px 0;"><strong>VIII.</strong> En caso de resolver el Compromiso-Contrato de Compraventa dentro del plazo establecido previamente la devolución tendrá como plazo de 6 meses.</p>
          </div>
        </div>
      </div>

      <!-- ESTRUCTURA DE PAGOS -->
      <div style="text-align: center; margin: 15px 0 10px 0;">
        <h2 style="font-size: 11px; font-weight: bold; margin: 0; text-transform: uppercase; border-top: 2px solid #000; border-bottom: 2px solid #000; padding: 5px 0;">ESTRUCTURA DE PAGOS</h2>
      </div>

      <!-- Tabla estructura de pagos EXACTA -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 9px; border: 2px solid #000;">
        <tr>
          <td style="border-right: 1px solid #000; border-bottom: 1px solid #000; padding: 6px 8px; font-weight: bold; background-color: #f9f9f9; width: 50%;">Precio de la vivienda</td>
          <td style="border-bottom: 1px solid #000; padding: 6px 8px; width: 50%;">S/ ${datos.precio}</td>
        </tr>
        <tr>
          <td style="border-right: 1px solid #000; border-bottom: 1px solid #000; padding: 6px 8px; font-weight: bold; background-color: #f9f9f9;">Descuento</td>
          <td style="border-bottom: 1px solid #000; padding: 6px 8px;">S/ 0.00</td>
        </tr>
        <tr>
          <td style="border-right: 1px solid #000; border-bottom: 1px solid #000; padding: 6px 8px; font-weight: bold; background-color: #f9f9f9;">BFH-2025</td>
          <td style="border-bottom: 1px solid #000; padding: 6px 8px;">S/ ${datos.montoSubsidio}</td>
        </tr>
        <tr>
          <td style="border-right: 1px solid #000; padding: 6px 8px; font-weight: bold; background-color: #f9f9f9;">Saldo Precio Total</td>
          <td style="padding: 6px 8px;">S/ 38,000.00</td>
        </tr>
      </table>

      <!-- Fecha EXACTA -->
      <div style="margin-bottom: 25px;">
        <p style="font-size: 9px; margin: 0; font-weight: normal;">Fecha: ${datos.fechaCompleta}</p>
      </div>

      <!-- Sección de firmas EXACTA -->
      <div style="display: flex; justify-content: space-between; margin-bottom: 20px; align-items: flex-end;">
        
        <!-- Asesor -->
        <div style="text-align: center; width: 30%; position: relative;">
          <div style="border-bottom: 2px solid #000; height: 40px; margin-bottom: 5px; position: relative; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 3px;">
            <span style="font-style: italic; font-size: 12px; font-weight: bold; color: #000;"></span>
          </div>
          <p style="font-size: 8px; margin: 0; font-weight: normal;">Asesor</p>
        </div>

        <!-- Cliente con huella -->
        <div style="text-align: center; width: 30%; position: relative;">
          <div style="border-bottom: 2px solid #000; height: 40px; margin-bottom: 5px; position: relative; display: flex; align-items: center; justify-content: space-between; padding: 0 8px;">
            <!-- Firma  -->
            
            <!-- Huella dactilar -->
            
          </div>
          <p style="font-size: 8px; margin: 0; font-weight: normal;">Cliente</p>
        </div>

        <!-- V°B° D. Lazo con sello -->
        <div style="text-align: center; width: 30%; position: relative;">
          <div style="border-bottom: 2px solid #000; height: 40px; margin-bottom: 5px; position: relative; display: flex; align-items: flex-start; justify-content: flex-end; padding: 3px;">
            
          </div>
          <p style="font-size: 8px; margin: 0; font-weight: normal;">V°B° D. Lazo</p>
        </div>
      </div>

      <!-- Número de cuenta EXACTO -->
      <div style="margin-top: 20px;">
        <p style="font-size: 8px; font-weight: bold; margin: 0 0 5px 0;">Número de cuenta</p>
        <table style="width: 100%; border-collapse: collapse; font-size: 7px; border: 2px solid #000;">
          <tr>
            <td style="border-bottom: 1px solid #000; padding: 5px; text-align: center; font-weight: normal;">BCP Soles N° 305-25604566-0-98 CCI: 002-305-002560456098-14</td>
          </tr>
          <tr>
            <td style="padding: 5px; text-align: center; font-weight: normal;">BBVA Soles N° 0011-0348-0100017264 CCI: 011-348-000100017264-01</td>
          </tr>
        </table>
      </div>
    </div>
  `
}

// Eliminar esta función completamente
function generarHTMLConvenioVentaPagina2(datos) {
  // ELIMINAR TODO EL CONTENIDO DE ESTA FUNCIÓN
}

function generarHTMLCronogramaPagosExacto(datos) {
  return `
    <div class="pdf-content" style="width: 210mm; min-height: 297mm; padding: 20mm 15mm; font-family: Arial, sans-serif; color: #000; background-color: white; margin: 0 auto; font-size: 11px; line-height: 1.3;">
      
      <!-- Header exacto con logo y título -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px;">
        <div style="width: 140px;">
          <!-- Logo Valle Reque exacto -->
          <div style="position: relative; width: 90px; height: 90px;">
              <div style="width: 120px; height: 120px; border-radius: 50%; overflow: hidden; position: relative;">
                <img src="static/img/valle-reque.png" alt="Logo Valle Reque" style="width: 100%; height: 100%; object-fit: cover;">
              </div>
            </div>
        </div>
        <div style="text-align: right; margin-top: 10px;">
          <h1 style="font-size: 18px; font-weight: bold; margin: 0; color: #333; letter-spacing: 1px;">CRONOGRAMA DE PAGOS</h1>
          <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">N° 2032</p>
          <p style="margin: 2px 0 0 0; font-size: 12px; color: #666;">2025-05-26</p>
        </div>
      </div>

      <!-- DATOS DEL CLIENTE EXACTO -->
      <div style="margin-bottom: 25px;">
        <h2 style="font-size: 12px; color: #2196F3; margin: 0 0 8px 0; font-weight: bold; text-transform: uppercase;">DATOS DEL CLIENTE</h2>
        <div style="border-bottom: 2px dotted #2196F3; margin-bottom: 12px;"></div>
        <div style="display: flex; gap: 30px;">
          <div style="flex: 1;">
            <div style="margin-bottom: 6px; font-size: 10px;">
              <span style="font-weight: bold;">NOMBRE:</span>
              <span style="margin-left: 40px;">${datos.nombres}</span>
            </div>
            <div style="margin-bottom: 6px; font-size: 10px;">
              <span style="font-weight: bold;">DIRECCIÓN:</span>
              <span style="margin-left: 20px;">ASE. H VICTOR RAUL HAYA DE LA TORRE MZ.B LT. 2-</span>
            </div>
            <div style="margin-bottom: 6px; font-size: 10px;">
              <span style="font-weight: bold;">LAMBAYEQUE</span>
            </div>
            <div style="margin-bottom: 6px; font-size: 10px;">
              <span style="font-weight: bold;">EMAIL:</span>
              <span style="margin-left: 50px;">valladarespozo_tania@hotmail.com</span>
            </div>
          </div>
          <div style="flex: 1;">
            <div style="margin-bottom: 6px; font-size: 10px;">
              <span style="font-weight: bold;">DNI:</span>
              <span style="margin-left: 80px;">${datos.dni}</span>
            </div>
            <div style="margin-bottom: 6px; font-size: 10px;">
              <span style="font-weight: bold;">TELÉFONO:</span>
              <span style="margin-left: 40px;">${datos.telefono}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- DATOS DE LA VIVIENDA EXACTO -->
      <div style="margin-bottom: 25px;">
        <h2 style="font-size: 12px; color: #2196F3; margin: 0 0 8px 0; font-weight: bold; text-transform: uppercase;">DATOS DE LA VIVIENDA</h2>
        <div style="border-bottom: 2px dotted #2196F3; margin-bottom: 12px;"></div>
        <div style="display: flex; gap: 30px;">
          <div style="flex: 1;">
            <div style="margin-bottom: 6px; font-size: 10px;">
              <span style="font-weight: bold;">PROYECTO:</span>
              <span style="margin-left: 30px;">Valle Reque</span>
            </div>
            <div style="margin-bottom: 6px; font-size: 10px;">
              <span style="font-weight: bold;">BLOQUE:</span>
              <span style="margin-left: 50px;">E</span>
            </div>
            <div style="margin-bottom: 6px; font-size: 10px;">
              <span style="font-weight: bold;">NÚMERO:</span>
              <span style="margin-left: 40px;">Valle Reque / Etapa 2 / E 10 1</span>
            </div>
          </div>
          <div style="flex: 1;">
            <div style="margin-bottom: 6px; font-size: 10px;">
              <span style="font-weight: bold;">ETAPA:</span>
              <span style="margin-left: 60px;">Etapa 2</span>
            </div>
            <div style="margin-bottom: 6px; font-size: 10px;">
              <span style="font-weight: bold;">MANZANA:</span>
              <span style="margin-left: 30px;">1</span>
            </div>
            <div style="margin-bottom: 6px; font-size: 10px;">
              <span style="font-weight: bold;">PRECIO:</span>
              <span style="margin-left: 50px;">${datos.precio}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- DATOS DEL ASESOR EXACTO -->
      <div style="margin-bottom: 25px;">
        <h2 style="font-size: 12px; color: #2196F3; margin: 0 0 8px 0; font-weight: bold; text-transform: uppercase;">DATOS DEL ASESOR</h2>
        <div style="border-bottom: 2px dotted #2196F3; margin-bottom: 12px;"></div>
        <div style="display: flex; gap: 30px;">
          <div style="flex: 1;">
            <div style="margin-bottom: 6px; font-size: 10px;">
              <span style="font-weight: bold;">NOMBRE:</span>
              <span style="margin-left: 40px;">diazo la</span>
            </div>
          </div>
          <div style="flex: 1;">
            <div style="margin-bottom: 6px; font-size: 10px;">
              <span style="font-weight: bold;">TELÉFONO:</span>
              <span style="margin-left: 40px;">76778888</span>
            </div>
          </div>
        </div>
      </div>

      <!-- CRONOGRAMA DE PAGOS DE CUOTAS EXACTO -->
      <div style="margin-bottom: 25px;">
        <h2 style="font-size: 12px; color: #2196F3; margin: 0 0 8px 0; font-weight: bold; text-transform: uppercase;">CRONOGRAMA DE PAGOS DE CUOTAS</h2>
        <div style="border-bottom: 2px dotted #2196F3; margin-bottom: 12px;"></div>
        <div style="margin-bottom: 10px; font-size: 10px;">
          <span style="font-weight: bold;">MONTO AMORTIZADO</span>
          <span style="margin-left: 200px; font-weight: bold;">NÚMERO DE CUOTAS: ${datos.numeroCuotas}</span>
        </div>
        
        <!-- Tabla cronograma EXACTA -->
        <table style="width: 100%; border-collapse: collapse; font-size: 9px; margin-bottom: 15px; border: 2px solid #000;">
          <thead>
            <tr style="background-color: #f0f0f0;">
              <th style="border: 1px solid #000; padding: 6px; text-align: center; font-weight: bold; width: 8%;">N°</th>
              <th style="border: 1px solid #000; padding: 6px; text-align: center; font-weight: bold; width: 18%;">SALDO</th>
              <th style="border: 1px solid #000; padding: 6px; text-align: center; font-weight: bold; width: 18%;">AMORTIZACIÓN</th>
              <th style="border: 1px solid #000; padding: 6px; text-align: center; font-weight: bold; width: 12%;">INTERÉS</th>
              <th style="border: 1px solid #000; padding: 6px; text-align: center; font-weight: bold; width: 18%;">CUOTA DEL MES</th>
              <th style="border: 1px solid #000; padding: 6px; text-align: center; font-weight: bold; width: 16%;">FECHA VEN.</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: 1px solid #000; padding: 6px; text-align: center;">0</td>
              <td style="border: 1px solid #000; padding: 6px; text-align: right;">30,000.00</td>
              <td style="border: 1px solid #000; padding: 6px; text-align: right;">0.00</td>
              <td style="border: 1px solid #000; padding: 6px; text-align: center;">0</td>
              <td style="border: 1px solid #000; padding: 6px; text-align: center;">0</td>
              <td style="border: 1px solid #000; padding: 6px; text-align: center;">2025-05-26</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; padding: 6px; text-align: center;">0</td>
              <td style="border: 1px solid #000; padding: 6px; text-align: right;">27,000.00</td>
              <td style="border: 1px solid #000; padding: 6px; text-align: right;">3,000.00</td>
              <td style="border: 1px solid #000; padding: 6px; text-align: center;">0</td>
              <td style="border: 1px solid #000; padding: 6px; text-align: center;">0</td>
              <td style="border: 1px solid #000; padding: 6px; text-align: center;">2025-05-26</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; padding: 6px; text-align: center;">0</td>
              <td style="border: 1px solid #000; padding: 6px; text-align: right;">0.00</td>
              <td style="border: 1px solid #000; padding: 6px; text-align: right;">27,000.00</td>
              <td style="border: 1px solid #000; padding: 6px; text-align: center;">0</td>
              <td style="border: 1px solid #000; padding: 6px; text-align: center;">0</td>
              <td style="border: 1px solid #000; padding: 6px; text-align: center;">2025-05-26</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; padding: 6px; text-align: center;">1</td>
              <td style="border: 1px solid #000; padding: 6px; text-align: right;">0.00</td>
              <td style="border: 1px solid #000; padding: 6px; text-align: right;">6,000.00</td>
              <td style="border: 1px solid #000; padding: 6px; text-align: right;">0.00</td>
              <td style="border: 1px solid #000; padding: 6px; text-align: right;">6,000.00</td>
              <td style="border: 1px solid #000; padding: 6px; text-align: center;">2025-06-26</td>
            </tr>
            <tr style="background-color: #f0f0f0; font-weight: bold;">
              <td style="border: 1px solid #000; padding: 6px; text-align: center;">TOTAL</td>
              <td style="border: 1px solid #000; padding: 6px; text-align: right;"></td>
              <td style="border: 1px solid #000; padding: 6px; text-align: right;">36,000.00</td>
              <td style="border: 1px solid #000; padding: 6px; text-align: right;">0.00</td>
              <td style="border: 1px solid #000; padding: 6px; text-align: right;">6,000.00</td>
              <td style="border: 1px solid #000; padding: 6px; text-align: center;"></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- NÚMERO DE CUENTA EXACTO -->
      <div style="margin-bottom: 25px;">
        <h2 style="font-size: 12px; color: #2196F3; margin: 0 0 8px 0; font-weight: bold; text-transform: uppercase;">NÚMERO DE CUENTA</h2>
        <div style="border-bottom: 2px dotted #2196F3; margin-bottom: 12px;"></div>
        <table style="width: 100%; border-collapse: collapse; font-size: 9px; border: 2px solid #000;">
          <tr>
            <td style="border-bottom: 1px solid #000; padding: 8px; text-align: center;">BCP Soles N° 305-25604566-0-98 CCI: 002-305-002560456098-14</td>
          </tr>
          <tr>
            <td style="padding: 8px; text-align: center;">BBVA Soles N° 0011-0348-0100017264 CCI: 011-348-000100017264-01</td>
          </tr>
        </table>
      </div>

      <!-- Pie de página EXACTO -->
      <div style="margin-top: 40px; font-size: 8px; color: #666;">
        <p style="margin: 0;">Detalles del Financiamiento: * Tasa Efectiva Anual (TEA) 0.00% - * Total Costo Efectivo Anual 0.00%</p>
      </div>
    </div>
  `
}

function crearModalVistaPreviaPDF() {
  if (document.getElementById("modal-vista-previa-cotizacion")) {
    return
  }

  const modal = document.createElement("div")
  modal.id = "modal-vista-previa-cotizacion"
  modal.style.display = "none"
  modal.style.position = "fixed"
  modal.style.zIndex = "10000"
  modal.style.left = "0"
  modal.style.top = "0"
  modal.style.width = "100%"
  modal.style.height = "100%"
  modal.style.backgroundColor = "rgba(0,0,0,0.7)"

  modal.innerHTML = `
      <div style="background-color: #fff; margin: 10px auto; border-radius: 8px; width: 95%; max-width: 1000px; max-height: 95vh; overflow: hidden; box-shadow: 0 5px 15px rgba(0,0,0,0.3);">
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; background: linear-gradient(90deg, #4CAF50 0%, #2196F3 100%); color: white;">
              <h3 style="margin: 0; font-size: 18px; font-weight: 600;">Vista Previa - Documentos Valle Reque</h3>
              <button id="cerrar-vista-previa-cotizacion" style="background: rgba(255,255,255,0.2); border: none; width: 30px; height: 30px; border-radius: 50%; color: white; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center;">&times;</button>
          </div>
          <div style="padding: 0; max-height: calc(95vh - 130px); overflow-y: auto;">
              <div id="contenido-vista-previa-cotizacion" style="padding: 0;"></div>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; border-top: 1px solid #eee;">
              <div style="display: flex; gap: 10px;">
                  <button id="tab-convenio" onclick="mostrarConvenio()" style="padding: 8px 16px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">Convenio de Venta</button>
                  <button id="tab-cronograma" onclick="mostrarCronograma()" style="padding: 8px 16px; background: #ccc; color: #333; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">Cronograma de Pagos</button>
              </div>
              <button id="descargar-pdf-cotizacion" style="background: linear-gradient(90deg, #4CAF50 0%, #2196F3 100%); color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-weight: 500; display: flex; align-items: center; gap: 8px;">
                  <i class="fas fa-download"></i> Descargar PDF Completo
              </button>
          </div>
      </div>
  `

  document.body.appendChild(modal)

  // Eventos del modal
  document.getElementById("cerrar-vista-previa-cotizacion").addEventListener("click", () => {
    document.getElementById("modal-vista-previa-cotizacion").style.display = "none"
  })

  document.getElementById("descargar-pdf-cotizacion").addEventListener("click", () => {
    generarYDescargarPDFCotizacion()
  })

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none"
    }
  })
}

function mostrarVistaPreviaPDFCotizacion() {
  const datos = obtenerDatosFormulario()

  const modal = document.getElementById("modal-vista-previa-cotizacion")
  if (!modal) return

  const contenidoVistaPrevia = document.getElementById("contenido-vista-previa-cotizacion")
  if (!contenidoVistaPrevia) return

  // Mostrar primera página por defecto
  contenidoVistaPrevia.innerHTML = generarHTMLConvenioVentaExacto(datos)

  // Funciones globales para cambiar pestañas
  window.mostrarConvenio = () => {
    contenidoVistaPrevia.innerHTML = generarHTMLConvenioVentaExacto(datos)
    document.getElementById("tab-convenio").style.background = "#2196F3"
    document.getElementById("tab-convenio").style.color = "white"
    document.getElementById("tab-cronograma").style.background = "#ccc"
    document.getElementById("tab-cronograma").style.color = "#333"
  }

  window.mostrarCronograma = () => {
    contenidoVistaPrevia.innerHTML = generarHTMLCronogramaPagosExacto(datos)
    document.getElementById("tab-cronograma").style.background = "#2196F3"
    document.getElementById("tab-cronograma").style.color = "white"
    document.getElementById("tab-convenio").style.background = "#ccc"
    document.getElementById("tab-convenio").style.color = "#333"
  }

  modal.style.display = "flex"
}

function generarYDescargarPDFCotizacion() {
  if (typeof window.jspdf === "undefined" || typeof window.html2canvas === "undefined") {
    showNotification("Las librerías PDF no están cargadas. Intentando cargar...", "error")
    cargarLibreriasPDF(() => {
      generarYDescargarPDFCotizacion()
    })
    return
  }

  const datos = obtenerDatosFormulario()
  const { jsPDF } = window.jspdf

  // Crear contenedor temporal
  const tempContainer = document.createElement("div")
  tempContainer.style.position = "absolute"
  tempContainer.style.left = "-9999px"
  tempContainer.style.top = "-9999px"
  document.body.appendChild(tempContainer)

  // Generar Convenio de Venta (página completa)
  tempContainer.innerHTML = generarHTMLConvenioVentaExacto(datos)

  window
    .html2canvas(tempContainer.querySelector(".pdf-content"), {
      scale: 2,
      useCORS: true,
      letterRendering: true,
    })
    .then((canvas1) => {
      // Generar Cronograma
      tempContainer.innerHTML = generarHTMLCronogramaPagosExacto(datos)

      return window
        .html2canvas(tempContainer.querySelector(".pdf-content"), {
          scale: 2,
          useCORS: true,
          letterRendering: true,
        })
        .then((canvas2) => {
          // Crear PDF con los 2 documentos
          const pdf = new jsPDF("p", "mm", "a4")

          // Página 1: Convenio de Venta completo
          const imgData1 = canvas1.toDataURL("image/png")
          const imgWidth = 210
          const imgHeight1 = (canvas1.height * imgWidth) / canvas1.width
          pdf.addImage(imgData1, "PNG", 0, 0, imgWidth, imgHeight1)

          // Página 2: Cronograma de Pagos
          pdf.addPage()
          const imgData2 = canvas2.toDataURL("image/png")
          const imgHeight2 = (canvas2.height * imgWidth) / canvas2.width
          pdf.addImage(imgData2, "PNG", 0, 0, imgWidth, imgHeight2)

          // Guardar PDF
          pdf.save(
            `Valle_Reque_Documentos_${datos.nombres.replace(/\s+/g, "_")}_${datos.fecha.replace(/\//g, "-")}.pdf`,
          )

          // Limpiar
          document.body.removeChild(tempContainer)
          showNotification("PDF generado correctamente con ambos documentos", "success")
        })
    })
    .catch((error) => {
      console.error("Error al generar el PDF:", error)
      showNotification("Error al generar el PDF: " + error.message, "error")
      if (document.body.contains(tempContainer)) {
        document.body.removeChild(tempContainer)
      }
    })
}

// ==================== SISTEMA PRINCIPAL DE VENTAS ====================
function initVentasModals() {
  createNotificationContainer()
  crearModalVistaPreviaPDF()

  // Elementos del DOM
  const btnSubirConstancia = document.getElementById("btn-subir-constancia")
  const archivoConstanciaPdf = document.getElementById("archivo-constancia-pdf")
  const contenedorSubidaConstancia = document.getElementById("contenedor-subida-constancia")
  const contenedorVistaConstancia = document.getElementById("contenedor-vista-constancia")
  const btnVerConstancia = document.getElementById("btn-ver-constancia")
  const btnVerConstanciaTabla = document.getElementById("btn-ver-constancia-tabla")
  const btnCambiarConstancia = document.getElementById("btn-cambiar-constancia")
  const btnContinuarCotizacion = document.getElementById("btn-continuar-cotizacion")
  const seccionResumenCotizacion = document.getElementById("seccion-resumen-cotizacion")
  const modalVisualizarPdf = document.getElementById("modal-visualizar-pdf")
  const visorPdf = document.getElementById("visor-pdf")
  const cerrarModalPdf = document.getElementById("cerrar-modal-pdf")

  // Variables globales
  let archivoConstanciaActual = null
  const fechaCalendarioActual = new Date()
  let diaSeleccionado = null
  let mesSeleccionado = null

  const nombresMeses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

  // ==================== MANEJO DE ARCHIVOS PDF ====================
  if (btnSubirConstancia && archivoConstanciaPdf) {
    btnSubirConstancia.addEventListener("click", () => {
      archivoConstanciaPdf.click()
    })

    archivoConstanciaPdf.addEventListener("change", (e) => {
      const archivo = e.target.files[0]
      if (archivo && archivo.type === "application/pdf") {
        archivoConstanciaActual = archivo
        mostrarVistaConstancia()
        showNotification("Archivo PDF cargado correctamente", "success")
      } else {
        showNotification("Por favor seleccione un archivo PDF válido", "error")
      }
    })
  }

  function mostrarVistaConstancia() {
    if (contenedorSubidaConstancia && contenedorVistaConstancia) {
      contenedorSubidaConstancia.style.display = "none"
      contenedorVistaConstancia.style.display = "flex"
    }
  }

  function mostrarSubidaConstancia() {
    if (contenedorSubidaConstancia && contenedorVistaConstancia) {
      contenedorSubidaConstancia.style.display = "flex"
      contenedorVistaConstancia.style.display = "none"
      archivoConstanciaActual = null
      if (archivoConstanciaPdf) archivoConstanciaPdf.value = ""
    }
  }

  // Eventos para ver PDF
  if (btnVerConstancia) {
    btnVerConstancia.addEventListener("click", () => {
      if (archivoConstanciaActual) {
        if (visorPdf && modalVisualizarPdf) {
          visorPdf.src = URL.createObjectURL(archivoConstanciaActual)
          modalVisualizarPdf.style.display = "flex"
        }
      } else {
        showNotification("No hay archivo PDF cargado", "error")
      }
    })
  }

  if (btnVerConstanciaTabla) {
    btnVerConstanciaTabla.addEventListener("click", () => {
      // Mostrar vista previa de documentos Valle Reque
      mostrarVistaPreviaPDFCotizacion()
    })
  }

  if (btnCambiarConstancia) {
    btnCambiarConstancia.addEventListener("click", () => {
      mostrarSubidaConstancia()
    })
  }

  // Cerrar modal de PDF
  if (cerrarModalPdf && modalVisualizarPdf && visorPdf) {
    cerrarModalPdf.addEventListener("click", () => {
      modalVisualizarPdf.style.display = "none"
      visorPdf.src = ""
    })

    modalVisualizarPdf.addEventListener("click", (e) => {
      if (e.target === modalVisualizarPdf) {
        modalVisualizarPdf.style.display = "none"
        visorPdf.src = ""
      }
    })
  }

  // Botón continuar
  if (btnContinuarCotizacion && seccionResumenCotizacion) {
    btnContinuarCotizacion.addEventListener("click", () => {
      if (!archivoConstanciaActual) {
        showNotification("Por favor suba la constancia de pago antes de continuar", "error")
        return
      }

      seccionResumenCotizacion.style.display = "block"
      seccionResumenCotizacion.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
      showNotification("Resumen de cotización generado", "success")
    })
  }

  // ==================== CALENDARIO ====================
  const fechaVencimientoCuotas = document.getElementById("fecha-vencimiento-cuotas")
  const btnAbrirCalendario = document.getElementById("btn-abrir-calendario")
  const calendarioFechas = document.getElementById("calendario-fechas")
  const mesActual = document.getElementById("mes-actual")
  const btnMesAnterior = document.getElementById("btn-mes-anterior")
  const btnMesSiguiente = document.getElementById("btn-mes-siguiente")
  const diasCalendario = document.getElementById("dias-calendario")

  if (btnAbrirCalendario && calendarioFechas) {
    btnAbrirCalendario.addEventListener("click", (e) => {
      e.preventDefault()
      e.stopPropagation()

      if (calendarioFechas.style.display === "block") {
        calendarioFechas.style.display = "none"
      } else {
        calendarioFechas.style.display = "block"
        generarCalendario()
      }
    })

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".contenedor-fecha-calendario")) {
        calendarioFechas.style.display = "none"
      }
    })

    calendarioFechas.addEventListener("click", (e) => {
      e.stopPropagation()
    })
  }

  if (btnMesAnterior && btnMesSiguiente) {
    btnMesAnterior.addEventListener("click", (e) => {
      e.preventDefault()
      e.stopPropagation()
      fechaCalendarioActual.setMonth(fechaCalendarioActual.getMonth() - 1)
      generarCalendario()
    })

    btnMesSiguiente.addEventListener("click", (e) => {
      e.preventDefault()
      e.stopPropagation()
      fechaCalendarioActual.setMonth(fechaCalendarioActual.getMonth() + 1)
      generarCalendario()
    })
  }

  function generarCalendario() {
    if (!diasCalendario || !mesActual) return

    const ano = fechaCalendarioActual.getFullYear()
    const mes = fechaCalendarioActual.getMonth()

    mesActual.textContent = `${nombresMeses[mes]} ${ano}`
    diasCalendario.innerHTML = ""

    const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
    diasSemana.forEach((dia) => {
      const encabezadoDia = document.createElement("div")
      encabezadoDia.className = "encabezado-dia-semana"
      encabezadoDia.textContent = dia
      diasCalendario.appendChild(encabezadoDia)
    })

    const primerDia = new Date(ano, mes, 1).getDay()
    const diasEnMes = new Date(ano, mes + 1, 0).getDate()

    for (let i = 0; i < primerDia; i++) {
      const diaVacio = document.createElement("div")
      diaVacio.className = "dia-calendario deshabilitado"
      diasCalendario.appendChild(diaVacio)
    }

    for (let dia = 1; dia <= diasEnMes; dia++) {
      const elementoDia = document.createElement("div")
      elementoDia.className = "dia-calendario"
      elementoDia.textContent = dia

      if (diaSeleccionado === dia && mesSeleccionado === mes) {
        elementoDia.classList.add("seleccionado")
      }

      elementoDia.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation()

        document.querySelectorAll(".dia-calendario.seleccionado").forEach((el) => {
          el.classList.remove("seleccionado")
        })

        elementoDia.classList.add("seleccionado")
        diaSeleccionado = dia
        mesSeleccionado = mes

        const diaFormateado = dia.toString().padStart(2, "0")
        const mesFormateado = (mes + 1).toString().padStart(2, "0")
        if (fechaVencimientoCuotas) {
          fechaVencimientoCuotas.value = `${diaFormateado}/${mesFormateado}`
        }

        calendarioFechas.style.display = "none"
      })

      diasCalendario.appendChild(elementoDia)
    }
  }

  // ==================== BÚSQUEDA DE CLIENTES ====================
  const documentoIdentidad = document.getElementById("documento-identidad")
  if (documentoIdentidad) {
    documentoIdentidad.addEventListener("input", function () {
      const dni = this.value
      const dniNumerico = dni.replace(/[^0-9]/g, "")

      if (dniNumerico.length > 8) {
        this.value = dniNumerico.substring(0, 8)
      } else {
        this.value = dniNumerico
      }

      if (this.value.length === 8) {
        fetch(`/buscar_cliente?dni=${this.value}`)
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              const cliente = data.cliente
              const campos = {
                "nombres-comprador": cliente.nombre,
                "apellidos-comprador": cliente.apellido,
                "estado-evaluacion": cliente.estado
                  .replace("NoDisponible", "No Disponible")
                  .replace("SinEvaluar", "Sin Evaluar"),
                "ingreso-mensual": cliente.ingreso_neto,
                "telefono-contacto": cliente.telefono,
                "ocupacion-laboral": cliente.ocupacion,
                "dependientes-familiares": cliente.carga_familiar,
              }

              Object.entries(campos).forEach(([id, valor]) => {
                const elemento = document.getElementById(id)
                if (elemento) elemento.value = valor || ""
              })

              showNotification("Cliente encontrado", "success")
            } else {
              showNotification("Cliente no encontrado", "error")
              const camposLimpiar = [
                "nombres-comprador",
                "apellidos-comprador",
                "estado-evaluacion",
                "ingreso-mensual",
                "telefono-contacto",
                "ocupacion-laboral",
                "dependientes-familiares",
              ]
              camposLimpiar.forEach((id) => {
                const elemento = document.getElementById(id)
                if (elemento) elemento.value = ""
              })
            }
          })
          .catch((error) => {
            console.error("Error:", error)
            showNotification("Error al buscar el cliente", "error")
          })
      }
    })
  }

  // ==================== BÚSQUEDA DE TERRENOS ====================
  const selectProyecto = document.getElementById("proyecto-inmobiliario")
  const inputCodigoUnidad = document.getElementById("codigo-unidad-habitacional")
  const inputEtapaConstruccion = document.getElementById("etapa-construccion")
  const inputDisponibilidadTerreno = document.getElementById("disponibilidad-terreno")
  const inputPrecioPropiedad = document.getElementById("precio-propiedad")
  const inputTipoUbicacion = document.getElementById("tipo-ubicacion")
  const inputAreaTerreno = document.getElementById("area-terreno")

  function clearTerrenoInputs() {
    if (inputDisponibilidadTerreno) inputDisponibilidadTerreno.value = ""
    if (inputPrecioPropiedad) inputPrecioPropiedad.value = ""
    if (inputTipoUbicacion) inputTipoUbicacion.value = ""
    if (inputAreaTerreno) inputAreaTerreno.value = ""
  }

  function buscarTerreno() {
    if (!selectProyecto || !inputCodigoUnidad || !inputEtapaConstruccion) return

    const proyectoId = selectProyecto.value
    const codigoUnidad = inputCodigoUnidad.value.trim()
    const etapa = inputEtapaConstruccion.value.trim()

    if (!proyectoId || !codigoUnidad || !etapa) {
      clearTerrenoInputs()
      return
    }

    fetch(`/buscar_terreno?proyecto_id=${proyectoId}&codigo_unidad=${codigoUnidad}&etapa=${etapa}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          const terreno = data.terreno
          if (terreno.estado_terreno === "Disponible") {
            if (inputDisponibilidadTerreno) inputDisponibilidadTerreno.value = "Sí"
            if (inputPrecioPropiedad) inputPrecioPropiedad.value = Number.parseFloat(terreno.precio).toFixed(2)
            if (inputTipoUbicacion) inputTipoUbicacion.value = terreno.tipo_ubicacion
            if (inputAreaTerreno) inputAreaTerreno.value = `${terreno.area_terreno} m2`
            showNotification("Terreno Disponible", "success")
          } else {
            showNotification(`Terreno NO Disponible: ${terreno.estado_terreno}`, "error")
            clearTerrenoInputs()
          }
        } else {
          showNotification(data.message, "error")
          clearTerrenoInputs()
        }
      })
      .catch((error) => {
        console.error("Error al buscar el terreno:", error)
        showNotification("Error al buscar el terreno", "error")
        clearTerrenoInputs()
      })
  }

  if (selectProyecto) selectProyecto.addEventListener("change", buscarTerreno)
  if (inputCodigoUnidad) inputCodigoUnidad.addEventListener("input", buscarTerreno)
  if (inputEtapaConstruccion) inputEtapaConstruccion.addEventListener("input", buscarTerreno)

  // Inicializar calendario
  if (calendarioFechas && diasCalendario) {
    generarCalendario()
  }

  // Cargar librerías PDF al inicializar
  cargarLibreriasPDF(() => {
    console.log("Librerías PDF cargadas correctamente")
  })
}

// ==================== INICIALIZACIÓN ====================
document.addEventListener("DOMContentLoaded", () => {
  console.log("Inicializando sistema de ventas Valle Reque...")
  initVentasModals()
})

// Función global para compatibilidad con el HTML existente
window.mostrarVistaPreviaPDF = mostrarVistaPreviaPDFCotizacion
