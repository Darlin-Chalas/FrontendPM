window.vehiculos = [];

document.addEventListener('DOMContentLoaded', function() {
    const id_cliente = localStorage.getItem('id_cliente');
    if (!id_cliente) {
        alert('No se encontró el id del cliente en localStorage.');
        return;
    }

    fetch(`https://backendpm-any7.onrender.com/vehiculos?id_cliente=${id_cliente}`)
        .then(response => response.json())
        .then(data => {
            window.vehiculos = data;
            console.log('Vehículos del cliente:', window.vehiculos);

            const grid = document.querySelector('.vehiculos-grid');
            grid.innerHTML = '';

            function colorEspToEng(colorEsp) {
                const colores = {
                    'Blanco': 'white',
                    'Negro': 'black',
                    'Gris': 'gray',
                    'Plata': 'silver',
                    'Rojo': 'red',
                    'Azul': 'blue',
                    'Verde': 'green',
                    'Amarillo': 'yellow',
                    'Naranja': 'orange',
                    'Marrón': 'brown',
                    'Beige': 'beige',
                    'Vino': 'maroon',
                    'Dorado': 'gold',
                    'Morado': 'purple'
                };
                return colores[colorEsp] || '#f0f0f0';
            }

            window.vehiculos.forEach(vehiculo => {
                const card = document.createElement('div');
                card.className = 'vehiculo-card';

                // Muestra el color como un campo visual, no como fondo
                const colorEsp = vehiculo.color || '';
                const colorEng = colorEspToEng(colorEsp);

                card.innerHTML = `
                    <div class="vehiculo-info" style="border-radius: 10px; padding: 10px; background-color: rgb(225, 225, 225);">
                        <span><strong>Marca:</strong> ${vehiculo.marca || ''}</span>
                        <span><strong>Modelo:</strong> ${vehiculo.modelo || ''}</span>
                        <span><strong>Placa:</strong> ${vehiculo.placa || ''}</span>
                        <span>
                            <strong>Color:</strong> ${colorEsp}
                            <span style="display:inline-block;width:18px;height:18px;border-radius:4px;margin-left:8px;vertical-align:middle;background:${colorEng};border:1px solid #ccc;"></span>
                        </span>
                        <span><strong>Fecha:</strong></span>
                        <input type="date" class="form-control" value="${vehiculo.fecha_registro || ''}">
                    </div>
                    <button class="btn btn-primary">Modificar</button>
                `;

                // Evento para el botón
                card.querySelector('button').addEventListener('click', function() {
                    const nuevaFecha = card.querySelector('input[type="date"]').value;
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

                grid.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error al obtener los vehículos:', error);
        });

    document.getElementById('btn-volver').addEventListener('click', function() {
        window.location.href = './pagina_principal.html';
    });
});