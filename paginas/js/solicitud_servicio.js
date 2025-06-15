window.arrayObs = Array(10).fill("0"); // Cadena para manejar las observaciones
window.arrayInv = Array(12).fill("0"); // Cadena para manejar el inventario

document.addEventListener('DOMContentLoaded', function() {
    // Verifica si el usuario está autenticado
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = '/PMBackend/frontend/index.html'; // Redirige al login si no está autenticado
    } else {
        // Si está autenticado, muestra el nombre del cliente
        const nombreCliente = localStorage.getItem('nombre_cliente');
        const welcomeMessage = document.querySelector('.welcome-message');
        if (welcomeMessage) {
        welcomeMessage.textContent = `Bienvenido, ${nombreCliente}`;
        }
        const labelNombre = document.querySelector('.client-name');
        if (labelNombre) {
        labelNombre.textContent = `Bienvenido de nuevo ${nombreCliente}!`;
        }
    }
    Autocompletar();
    
});

// Autocompletar datos del cliente en el formulario
function Autocompletar() {
    const nombre = localStorage.getItem('nombre_cliente');
    const correo = localStorage.getItem('correo_cliente');
    const telefono = localStorage.getItem('telefono_cliente');

    const nombreInput = document.querySelector('input[name="nombre"]');
    if (nombre && nombreInput) {
        nombreInput.value = nombre;
        nombreInput.readOnly = true;
    }

    const emailInput = document.querySelector('input[name="email"]');
    if (correo && emailInput) {
        emailInput.value = correo;
        emailInput.readOnly = true;
    }

    const telefonoInput = document.querySelector('input[name="telefono"]');
    if (telefono && telefonoInput) {
        telefonoInput.value = telefono;
        telefonoInput.readOnly = true;
    } else if (!telefono) {
        console.log("No se encontró el número de teléfono en localStorage.");
    }
}

// Funciones para crear cadenas de observaciones e inventario
function CrearCadenaDeObservaciones() {
    const cadena = window.arrayObs.join('');
    console.log("Cadena de observaciones creada: " + cadena);
    return cadena;
}

function CrearCadenaDeInventario() {
    const cadena = window.arrayInv.join('');
    console.log("Cadena de inventario creada:", cadena);
    return cadena;
}

// Manejo visual y funcional de imágenes de observaciones
function inicializarObservaciones() {
    const observacionImgs = Array.from(document.querySelectorAll('.list-inline-item img'));
    const imgButtons = [
        '.img-button-one', '.img-button-two', '.img-button-three', '.img-button-four', '.img-button-five',
        '.img-button-six', '.img-button-seven', '.img-button-eight', '.img-button-nine', '.img-button-ten'
    ];
    const imgActives = Array(10).fill(false);

    // Alternar clase visual al hacer click
    observacionImgs.forEach((img, idx) => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            img.classList.toggle('img-activa');
        });
    });

    // Manejo funcional del array de observaciones
    imgButtons.forEach((selector, idx) => {
        const img = document.querySelector(selector);
        if (img) {
            img.addEventListener('click', function () {
                imgActives[idx] = !imgActives[idx];
                window.arrayObs[idx] = imgActives[idx] ? "1" : "0";
                console.log("Cadena de observaciones: " + window.arrayObs);
            });
        }
    });

    // Métodos globales para manipular imágenes de observaciones
    window.imagenesObservaciones = {
        activar: idx => observacionImgs[idx]?.classList.add('img-activa'),
        desactivar: idx => observacionImgs[idx]?.classList.remove('img-activa'),
        desactivarTodas: () => observacionImgs.forEach(img => img.classList.remove('img-activa')),
        getActivas: () => observacionImgs
            .map((img, idx) => img.classList.contains('img-activa') ? idx : null)
            .filter(idx => idx !== null)
    };
}

// Manejo de checkboxes de inventario
function inicializarInventario() {
    for (let i = 1; i <= 12; i++) {
        const checkbox = document.querySelector(`.inv-checkbox-${i}`);
        if (checkbox) {
            checkbox.addEventListener('change', function () {
                window.arrayInv[i - 1] = checkbox.checked ? "1" : "0";
                console.log("Cadena de inventario:", window.arrayInv);
            });
        }
    }
}

// Manejo de autenticación y bienvenida
document.addEventListener('DOMContentLoaded', function () {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = '/PMBackend/frontend/index.html';
        return;
    }

    const nombreCliente = localStorage.getItem('nombre_cliente');
    const welcomeMessage = document.querySelector('.welcome-message');
    if (welcomeMessage) {
        welcomeMessage.textContent = `Bienvenido, ${nombreCliente}`;
    }
    const labelNombre = document.querySelector('.client-name');
    if (labelNombre) {
        labelNombre.textContent = `Bienvenido de nuevo ${nombreCliente}!`;
    }

    Autocompletar();
    inicializarObservaciones();
    inicializarInventario();
});

// Envío del formulario
document.querySelector('form').addEventListener('submit', async function (e) {
    e.preventDefault();

    alert('Enviando solicitud, por favor espere...');
    
    // Obtener datos del formulario
    const form = e.target;
    const formData = new FormData(form);

    // Validación de campos obligatorios
    const requiredFields = ['Marca', 'Modelo', 'Color', 'Kilometraje', 'Placas', 'NumeroDeSerie'];
    for (const field of requiredFields) {
        if (!formData.get(field) || formData.get(field).trim() === '') {
            alert('Por favor, complete todos los campos obligatorios antes de enviar la solicitud.');
            return;
        }
    }

    const data = Object.fromEntries(formData.entries());
    const id_cliente = localStorage.getItem('id_cliente');
    if (!id_cliente) {
        alert('No se encontró el ID del cliente.');
        return;
    }
    data.id_cliente = id_cliente;
    data.fecha_registro = new Date().toISOString();
    data.inventario = CrearCadenaDeInventario();
    data.observaciones = CrearCadenaDeObservaciones();

    setTimeout(() => {
        fetch('http://localhost:3000/vehiculo_id')
            .then(response => response.json())
            .then(data => {
                if (data && data.id_vehiculo) {
                    const idVehiculoNum = Number(data.id_vehiculo) + 1;
                    localStorage.setItem('id_vehiculo', idVehiculoNum.toString());
                    // window.location.href = '/PMBackend/frontend/paginas/solicitud_servicio.html';
                } else {
                    console.error('No se pudo obtener el ID del vehículo.');
                    alert('Error al obtener el ID del vehículo. Por favor, inténtelo de nuevo más tarde.');
                }
            })
            .catch(error => {
                console.error('Error al hacer la petición al backend:', error);
                alert('Ocurrió un error al procesar su solicitud. Por favor, inténtelo de nuevo más tarde.');
            });
    }, 5000);  

    // Enviar datos del formulario principal después de 10 segundos
    setTimeout(async () => {
        try {
            const response = await fetch(form.action, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                alert('¡Solicitud enviada correctamente!, le estaremos contactando pronto!.');
                form.reset();
                window.imagenesObservaciones.desactivarTodas();
            } else {
                alert('Ocurrió un error al enviar la solicitud. Por favor, inténtelo de nuevo.');
            }
        } catch (error) {
            console.error('Error al enviar la solicitud:', error);
            alert('Ocurrió un error al enviar la solicitud. Por favor, inténtelo de nuevo.');
            return;
        }
    }, 10000);

    // Obtener id_vehiculo después de 10 segundos
});