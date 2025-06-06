function initVentasModals() {
    // Elementos del DOM para gestión de cotización inmobiliaria
    const btnSubirConstancia = document.getElementById('btn-subir-constancia');
    const archivoConstanciaPdf = document.getElementById('archivo-constancia-pdf');
    const contenedorSubidaConstancia = document.getElementById('contenedor-subida-constancia');
    const contenedorVistaConstancia = document.getElementById('contenedor-vista-constancia');
    const btnVerConstancia = document.getElementById('btn-ver-constancia');
    const btnVerConstanciaTabla = document.getElementById('btn-ver-constancia-tabla');
    const btnCambiarConstancia = document.getElementById('btn-cambiar-constancia');
    const btnContinuarCotizacion = document.getElementById('btn-continuar-cotizacion');
    const seccionResumenCotizacion = document.getElementById('seccion-resumen-cotizacion');
    const modalVisualizarPdf = document.getElementById('modal-visualizar-pdf');
    const visorPdf = document.getElementById('visor-pdf');
    const cerrarModalPdf = document.getElementById('cerrar-modal-pdf');

    // Elementos para el calendario personalizado
    const fechaVencimientoCuotas = document.getElementById('fecha-vencimiento-cuotas');
    const btnAbrirCalendario = document.getElementById('btn-abrir-calendario');
    const calendarioFechas = document.getElementById('calendario-fechas');
    const mesActual = document.getElementById('mes-actual');
    const btnMesAnterior = document.getElementById('btn-mes-anterior');
    const btnMesSiguiente = document.getElementById('btn-mes-siguiente');
    const diasCalendario = document.getElementById('dias-calendario');

    let archivoConstanciaActual = null;
    let fechaCalendarioActual = new Date();
    let diaSeleccionado = null;
    let mesSeleccionado = null;

    // Nombres de los meses
    const nombresMeses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    // Funcionalidad para subir constancia PDF
    btnSubirConstancia.addEventListener('click', function () {
        archivoConstanciaPdf.click();
    });

    archivoConstanciaPdf.addEventListener('change', function (e) {
        const archivo = e.target.files[0];
        if (archivo && archivo.type === 'application/pdf') {
            archivoConstanciaActual = archivo;
            mostrarVistaConstancia();
        } else {
            alert('Por favor seleccione un archivo PDF válido');
        }
    });

    function mostrarVistaConstancia() {
        contenedorSubidaConstancia.style.display = 'none';
        contenedorVistaConstancia.style.display = 'flex';
    }

    function mostrarSubidaConstancia() {
        contenedorSubidaConstancia.style.display = 'flex';
        contenedorVistaConstancia.style.display = 'none';
        archivoConstanciaActual = null;
        archivoConstanciaPdf.value = '';
    }

    // Funcionalidad para ver constancia PDF
    btnVerConstancia.addEventListener('click', function () {
        if (archivoConstanciaActual) {
            visorPdf.src = URL.createObjectURL(archivoConstanciaActual);
            modalVisualizarPdf.style.display = 'flex';
        }
    });

    btnVerConstanciaTabla.addEventListener('click', function () {
        if (archivoConstanciaActual) {
            visorPdf.src = URL.createObjectURL(archivoConstanciaActual);
            modalVisualizarPdf.style.display = 'flex';
        }
    });

    // Funcionalidad para cambiar constancia
    btnCambiarConstancia.addEventListener('click', function () {
        mostrarSubidaConstancia();
    });

    // Cerrar modal de PDF
    cerrarModalPdf.addEventListener('click', function () {
        modalVisualizarPdf.style.display = 'none';
        visorPdf.src = '';
    });

    // Cerrar modal al hacer clic fuera
    modalVisualizarPdf.addEventListener('click', function (e) {
        if (e.target === modalVisualizarPdf) {
            modalVisualizarPdf.style.display = 'none';
            visorPdf.src = '';
        }
    });

    // Funcionalidad del botón continuar
    btnContinuarCotizacion.addEventListener('click', function () {
        if (!archivoConstanciaActual) {
            alert('Por favor suba la constancia de pago antes de continuar');
            return;
        }

        // Mostrar la sección de resumen de cotización
        seccionResumenCotizacion.style.display = 'block';

        // Scroll suave hacia la sección
        seccionResumenCotizacion.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });

    // Funcionalidad del calendario personalizado
    btnAbrirCalendario.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        console.log('Botón calendario clickeado'); // Debug

        if (calendarioFechas.style.display === 'block') {
            calendarioFechas.style.display = 'none';
        } else {
            calendarioFechas.style.display = 'block';
            generarCalendario();
        }
    });

    // Cerrar calendario al hacer clic fuera
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.contenedor-fecha-calendario')) {
            calendarioFechas.style.display = 'none';
        }
    });

    // Prevenir que el calendario se cierre al hacer clic dentro
    calendarioFechas.addEventListener('click', function (e) {
        e.stopPropagation();
    });

    // Navegación del calendario
    btnMesAnterior.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        fechaCalendarioActual.setMonth(fechaCalendarioActual.getMonth() - 1);
        generarCalendario();
    });

    btnMesSiguiente.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        fechaCalendarioActual.setMonth(fechaCalendarioActual.getMonth() + 1);
        generarCalendario();
    });

    function generarCalendario() {
        console.log('Generando calendario'); // Debug

        const ano = fechaCalendarioActual.getFullYear();
        const mes = fechaCalendarioActual.getMonth();

        // Actualizar encabezado del mes
        mesActual.textContent = `${nombresMeses[mes]} ${ano}`;

        // Limpiar días anteriores
        diasCalendario.innerHTML = '';

        // Agregar encabezados de días de la semana
        const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        diasSemana.forEach(dia => {
            const encabezadoDia = document.createElement('div');
            encabezadoDia.className = 'encabezado-dia-semana';
            encabezadoDia.textContent = dia;
            diasCalendario.appendChild(encabezadoDia);
        });

        // Obtener primer día del mes y número de días
        const primerDia = new Date(ano, mes, 1).getDay();
        const diasEnMes = new Date(ano, mes + 1, 0).getDate();

        // Agregar días vacíos al inicio
        for (let i = 0; i < primerDia; i++) {
            const diaVacio = document.createElement('div');
            diaVacio.className = 'dia-calendario deshabilitado';
            diasCalendario.appendChild(diaVacio);
        }

        // Agregar días del mes
        for (let dia = 1; dia <= diasEnMes; dia++) {
            const elementoDia = document.createElement('div');
            elementoDia.className = 'dia-calendario';
            elementoDia.textContent = dia;

            // Verificar si es el día seleccionado
            if (diaSeleccionado === dia && mesSeleccionado === mes) {
                elementoDia.classList.add('seleccionado');
            }

            elementoDia.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                // Remover selección anterior
                document.querySelectorAll('.dia-calendario.seleccionado').forEach(el => {
                    el.classList.remove('seleccionado');
                });

                // Agregar selección actual
                elementoDia.classList.add('seleccionado');
                diaSeleccionado = dia;
                mesSeleccionado = mes;

                // Formatear y actualizar el input
                const diaFormateado = dia.toString().padStart(2, '0');
                const mesFormateado = (mes + 1).toString().padStart(2, '0');
                fechaVencimientoCuotas.value = `${diaFormateado}/${mesFormateado}`;

                // Cerrar calendario
                calendarioFechas.style.display = 'none';
            });

            diasCalendario.appendChild(elementoDia);
        }
    }

    // Inicializar calendario
    console.log('Inicializando calendario'); // Debug
    if (calendarioFechas && diasCalendario) {
        generarCalendario();
    } else {
        console.error('Elementos del calendario no encontrados');
    }
}