document.addEventListener("DOMContentLoaded", () => {
    initTerrenosModals();
});

function initTerrenosModals() {
    const btnEliminarTerreno = document.querySelectorAll('.btn-eliminar-terreno');
    btnEliminarTerreno.forEach(button => {
        button.addEventListener("click", function (e) {
            const terrenoId = this.getAttribute('data-id');
            Swal.fire({
                title: '¿Estás seguro?',
                text: "¡Esta acción no se puede deshacer!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Eliminar',
                cancelButtonText: 'Cancelar',
                reverseButtons: true,
                customClass: {
                    confirmButton: 'btn-confirmar-eliminar',
                    cancelButton: 'btn-cancelar-eliminar'
                }
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute("content");
                    try {
                        const response = await fetch("/eliminar_terreno", {
                            method: "POST",
                            body: JSON.stringify({id_terreno: terrenoId}),
                            headers: {
                                "Content-Type": "application/json",
                                "X-Requested-With": "XMLHttpRequest",
                                "X-CSRFToken": csrfToken
                            }
                        });
                        const result = await response.json();
                        if (result.success) {
                            const fila = document.querySelector(`tr[data-id="${terrenoId}"]`);
                            fila?.remove();
                            Swal.fire(
                                'Eliminado!',
                                'El terreno ha sido eliminado.',
                                'success'
                            );
                        } else {
                            Swal.fire(
                                'Error!',
                                'Hubo un problema al eliminar el terreno: ' + (result.message || 'desconocido'),
                                'error'
                            );
                        }
                    } catch (error) {
                        Swal.fire(
                            'Error!',
                            'Hubo un problema con la conexión: ' + error.message,
                            'error'
                        );
                    }
                } else {
                    Swal.fire(
                        'Cancelado',
                        'El terreno no fue eliminado',
                        'info'
                    );
                }
            });
        });
    });

    const btnAgregarTerreno = document.getElementById('btnAgregarTerreno');
    const modalAgregar = document.getElementById('modalAgregarNuevoTerreno');
    const btnCancelarNuevoTerreno = document.getElementById('btnCancelarNuevoTerreno');
    const btnCancelarAgregarTerreno = document.getElementById('btnCancelarAgregarTerreno');
    const overlay = document.getElementById('modalOverlay');
    const inputLote = document.getElementById('inputLote');
    const inputArea = document.getElementById('inputArea');
    const inputPrecio = document.getElementById('inputPrecio');


    // Mostrar el modal de agregar terreno cuando se haga clic en "Agregar"
    btnAgregarTerreno.addEventListener('click', () => {
        modalAgregar.classList.add('active');  // Mostrar modal
        overlay.classList.add('active');      // Mostrar overlay
    });

    // Cerrar el modal cuando se haga clic en el botón de cancelar
    const closeModal = () => {
        modalAgregar.classList.remove('active');  // Ocultar modal
        overlay.classList.remove('active');       // Ocultar overlay
    };

    btnCancelarNuevoTerreno.addEventListener('click', closeModal);
    btnCancelarAgregarTerreno.addEventListener('click', closeModal);

    // Limitar la cantidad de dígitos en el input de "Lote"
    inputLote.addEventListener('input', function(e) {
        let value = e.target.value;

        // Limitar a 5 dígitos
        if (value.length > 5) {
            value = value.slice(0, 5);  // Si tiene más de 5 dígitos, recortamos
        }

        // Asignamos el valor al input
        e.target.value = value;
    });

    // Limitar la cantidad de dígitos en el input de "Área" (máximo 6 dígitos)
    inputArea.addEventListener('input', function (e) {
        let value = e.target.value;

        // Limitar a 6 dígitos
        if (value.length > 6) {
            value = value.slice(0, 6);  // Si tiene más de 6 dígitos, recortamos
        }

        // Asignamos el valor al input
        e.target.value = value;
    });

// Limitar la cantidad de dígitos en el input de "Precio" (máximo 6 dígitos y 2 decimales)
    inputPrecio.addEventListener('input', function (e) {
        let value = e.target.value;

        // Limitar a 6 dígitos en total (con decimales)
        if (value.includes('.') && value.split('.')[1].length > 2) {
            value = value.slice(0, value.indexOf('.') + 3); // Limita a 2 decimales
        }

        // Limitar a 6 dígitos (en total, incluyendo la parte entera y decimal)
        if (value.length > 9) {
            value = value.slice(0, 9); // Max 6 dígitos enteros, 2 decimales
        }

        // Asignamos el valor al input
        e.target.value = value;
    });
    // Cerrar el modal si se hace clic fuera de él (en el overlay)
    overlay.addEventListener('click', closeModal);
}

