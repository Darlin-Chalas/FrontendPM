document.addEventListener('DOMContentLoaded', function() {
  // Verifica si el usuario está autenticado
  if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'https://darlin-chalas.github.io/FrontendPM/'; // Redirige al login si no está autenticado
  } else {
    // Si está autenticado, muestra el nombre del cliente
    const nombreCliente = localStorage.getItem('nombre_cliente');
    const welcomeMessage = document.querySelector('.client-name');
    if (welcomeMessage) {
      welcomeMessage.textContent = `Bienvenido, ${nombreCliente}`;
    }
  }
  const btnLogout = document.querySelector('.btn-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', function(e) {
    e.preventDefault();
    console.log('SE EJECUTO ESA MIELDA');
    // Limpia el almacenamiento local y redirige al login
    localStorage.removeItem('id_cliente');
    localStorage.removeItem('nombre_cliente');
    localStorage.removeItem('correo_cliente');
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'https://darlin-chalas.github.io/FrontendPM/'; // Redirige al login
  });
}
});
// Al cargar la página principal
//if (localStorage.getItem('isLoggedIn') !== 'true') {
//  window.location.href = '/PMBackend/frontend/index.html'; // Redirige al login si no está autenticado
//}

// Manejo del evento para cerrar sesión
