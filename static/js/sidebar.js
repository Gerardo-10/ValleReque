document.addEventListener('DOMContentLoaded', function () {
    function cargarVista(endpoint, initFunction) {
        fetch(endpoint)
            .then(response => {
                if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
                return response.text();
            })
            .then(html => {
                document.getElementById("dynamic-content").innerHTML = html;
                setTimeout(() => {
                    if (typeof initFunction === "function") {
                        initFunction();
                    } else {
                        console.error(`La función ${initFunction.name} no está disponible.`);
                    }
                }, 50);
            })
            .catch(error => {
                console.error(`Error cargando contenido de ${endpoint}:`, error);
            });
    }

    const seguridadLink = document.getElementById("seguridad-link");
    const clientesLink = document.getElementById("clientes-link");
    const perfilLink = document.getElementById("perfil-link");

    seguridadLink?.addEventListener("click", e => {
        e.preventDefault();
        cargarVista("/seguridad", initSecurityModals);
    });

    clientesLink?.addEventListener("click", e => {
        e.preventDefault();
        cargarVista("/clientes", initClientesModals);
    });

    perfilLink?.addEventListener("click", e => {
        e.preventDefault();
        cargarVista("/perfil");
    });

    document.addEventListener("click", function (e) {
        const boton = e.target.closest(".btn-detalles");
        if (boton) {
            const id = boton.dataset.id;
            const tipo = boton.dataset.tipo;

            if (tipo === "cliente") {
                cargarVista(`/detalle_clientes/${id}`, () => {
                    console.log("Vista de detalle de cliente cargada");
                    initDetalleCliente();
                });
            } else if (tipo === "empleado") {
                cargarVista(`/detalle_empleados/${id}`, () => {
                    console.log("Vista de detalle de empleado cargada");
                    // initDetalleEmpleado(); // si tienes una función específica
                });
            }
        }

        const botonVolver = e.target.closest(".back-button");
        if (botonVolver) {
            e.preventDefault();
            cargarVista("/clientes", initClientesModals);
        }
    });

    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const menuToggle = document.getElementById('menuToggle');
    const menuToggleMobile = document.getElementById('menuToggleMobile');
    const userProfile = document.getElementById('userProfile');
    const userDropdown = document.getElementById('userDropdown');
    const navItems = document.querySelectorAll('.nav-item');


    const sidebarOverlay = document.createElement('div');
    sidebarOverlay.className = 'sidebar-overlay';
    document.body.appendChild(sidebarOverlay);


    let isMobile = window.innerWidth < 992;
    let sidebarActive = !isMobile;


    function initApp() {

        if (isMobile) {
            sidebar.classList.remove('active');
            mainContent.style.marginLeft = '0';
        } else {
            sidebar.classList.add('active');
            mainContent.style.marginLeft = 'var(--sidebar-width)';
        }

        initActiveSubmenus();
    }

    function initActiveSubmenus() {
        const activeNavItems = document.querySelectorAll('.nav-item.active');

        activeNavItems.forEach(item => {
            const submenu = item.nextElementSibling;
            if (submenu && submenu.classList.contains('nav-submenu')) {
                submenu.style.maxHeight = submenu.scrollHeight + "px";
            }
        });
    }


    // ======== FUNCIONES DE MANEJO DEL SIDEBAR ========
    function toggleSidebar() {
        sidebarActive = !sidebarActive;

        if (sidebarActive) {
            sidebar.classList.add('active');
            if (isMobile) {
                sidebarOverlay.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevenir scroll
            } else {
                mainContent.style.marginLeft = 'var(--sidebar-width)';
            }
        } else {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Restaurar scroll
            mainContent.style.marginLeft = '0';
        }
    }

    function closeSidebarOnMobile() {
        if (isMobile && sidebarActive) {
            sidebarActive = false;
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Restaurar scroll
            mainContent.style.marginLeft = '0';
        }
    }

    // MANEJO DEL DROPDOWN DE USUARIO
    function toggleUserDropdown(event) {
        event.stopPropagation();
        userProfile.classList.toggle('active');

        // Cerrar sidebar en móvil cuando se abre el dropdown
        if (isMobile && userProfile.classList.contains('active')) {
            closeSidebarOnMobile();
        }
    }

    function closeUserDropdown() {
        userProfile.classList.remove('active');
    }

    // FUNCIONES DE MANEJO DE NAVEGACIÓN
    function handleNavItemClick(event) {
        const submenu = this.nextElementSibling;

        if (submenu && submenu.classList.contains('nav-submenu')) {
            event.preventDefault();

            // Toggle active class
            this.classList.toggle('active');

            // Toggle submenu visibility with animation
            if (submenu.style.maxHeight) {
                submenu.style.maxHeight = null;
            } else {
                submenu.style.maxHeight = submenu.scrollHeight + "px";
            }
        } else if (isMobile) {
            // Sí es un enlace sin submenú en móvil, cerrar sidebar
            setTimeout(() => {
                closeSidebarOnMobile();
            }, 300); // Pequeño retraso para mejor UX
        }
    }

    // FUNCIONES RESPONSIVE
    function handleResize() {
        const wasMobile = isMobile;
        isMobile = window.innerWidth < 992;


        if (wasMobile !== isMobile) {
            if (isMobile) {
                // Cambio a móvil
                sidebarActive = false;
                sidebar.classList.remove('active');
                sidebarOverlay.classList.remove('active');
                document.body.style.overflow = '';
                mainContent.style.marginLeft = '0';
            } else {
                // Cambio a escritorio
                sidebarActive = true;
                sidebar.classList.add('active');
                mainContent.style.marginLeft = 'var(--sidebar-width)';
            }

            dashboardCards.forEach(card => {
                card.style.transform = '';
                card.style.boxShadow = '';
            });
        }
    }

    // Sidebar toggle
    menuToggle.addEventListener('click', toggleSidebar);
    menuToggleMobile.addEventListener('click', toggleSidebar);

    // Overlay para cerrar sidebar en móvil
    sidebarOverlay.addEventListener('click', closeSidebarOnMobile);

    // User dropdown
    userProfile.addEventListener('click', toggleUserDropdown);
    document.addEventListener('click', closeUserDropdown);
    userDropdown.addEventListener('click', function (e) {
        e.stopPropagation(); // Prevenir cierre al hacer clic dentro
    });

    // Navegación
    navItems.forEach(item => {
        item.addEventListener('click', handleNavItemClick);
    });

    // Eventos de teclado
    document.addEventListener('keydown', function (e) {
        // Cerrar dropdown con ESC
        if (e.key === 'Escape' && userProfile.classList.contains('active')) {
            closeUserDropdown();
        }

        // Cerrar sidebar en móvil con ESC
        if (e.key === 'Escape' && isMobile && sidebarActive) {
            closeSidebarOnMobile();
        }
    });

    // Eventos de ventana
    window.addEventListener('resize', handleResize);

    // Eventos táctiles para dispositivos móviles
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});

    document.addEventListener('touchend', function (e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, {passive: true});

    function handleSwipe() {
        if (!isMobile) return;

        const swipeDistance = touchEndX - touchStartX;
        const threshold = 100; // Distancia mínima para considerar un swipe

        // abrir sidebar
        if (swipeDistance > threshold && !sidebarActive) {
            toggleSidebar();
        }

        // cerrar sidebar
        if (swipeDistance < -threshold && sidebarActive) {
            closeSidebarOnMobile();
        }
    }

    // ======== INICIALIZACIÓN ========
    initApp();
});