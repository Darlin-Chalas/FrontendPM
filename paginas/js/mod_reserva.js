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

            const lista = document.querySelector('.list-group');
            lista.innerHTML = '';

            window.vehiculos.forEach(vehiculo => {
                const li = document.createElement('li');
                li.className = 'list-group-item d-flex align-items-center';

                li.innerHTML = `
                    <span class="me-2">Vehículo: ${vehiculo.marca} | ${vehiculo.modelo} || | Fecha:</span>
                    <input type="date" class="form-control me-2" style="max-width: 200px;" value="${vehiculo.fecha_registro || ''}">
                    <button class="btn btn-primary">Modificar</button>
                `;

                // Agrega el evento al botón
                li.querySelector('button').addEventListener('click', function() {
                    const nuevaFecha = li.querySelector('input[type="date"]').value;
                    if (!nuevaFecha) {
                        alert('Por favor selecciona una fecha.');
                        return;
                    }
                    fetch('https://backendpm-any7.onrender.com/actualizar_fecha', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            id_vehiculo: vehiculo.id_vehiculo,
                            nueva_fecha: nuevaFecha
                        })
                    })
                    .then(res => res.json())
                    .then(res => {
                        alert(res.message || 'Fecha actualizada');
                    })
                    .catch(err => {
                        alert('Error al actualizar la fecha');
                        console.error(err);
                    });
                });

                lista.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error al obtener los vehículos:', error);
        });
});