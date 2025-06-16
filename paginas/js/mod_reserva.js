window.vehiculos = [];

document.addEventListener('DOMContentLoaded', function() {
    const id_cliente = localStorage.getItem('id_cliente');
    if (!id_cliente) {
        alert('No se encontró el id del cliente en localStorage.');
        return;
    }
    console.log("un gato");

    fetch(`https://backendpm-any7.onrender.com/vehiculos?id_cliente=${id_cliente}`)
        .then(response => response.json())
        .then(data => {
            window.vehiculos = data;
            console.log('Vehículos del cliente:', window.vehiculos);

            // Selecciona la lista y la limpia
            const lista = document.querySelector('.list-group');
            lista.innerHTML = '';

            // Por cada vehículo, crea un elemento de la lista
            window.vehiculos.forEach(vehiculo => {
                const li = document.createElement('li');
                li.className = 'list-group-item d-flex align-items-center';

                // Puedes mostrar la placa, modelo, etc.
                li.innerHTML = `
                    <span class="me-2">Vehículo: ${vehiculo.placa || vehiculo.modelo || 'Sin datos'} | Fecha:</span>
                    <input type="date" class="form-control me-2" style="max-width: 200px;">
                    <button class="btn btn-primary">Modificar</button>
                `;
                lista.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error al obtener los vehículos:', error);
        });
});