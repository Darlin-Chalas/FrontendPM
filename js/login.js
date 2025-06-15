// Variables globales para almacenar los datos ingresados
window.emailIngresado = '';
window.contraseñaIngresada = '';
// Creamos una lista para almacenar los usuarios
window.usuarios = [];
window.clientes = [];
window.clienteNombre = '';

// Espera a que el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  // Selecciona el botón de Sign in
  const btnSignIn = document.querySelector('.btn-signin');
  const btnGoIndex = document.querySelector('.btn-goindex');
  // Si el botón de ir al index existe, agrega el evento click 
  if (btnSignIn) {
    btnSignIn.addEventListener('click', function(e) {
      e.preventDefault();
      // Obtiene los valores de los campos de usuario y contraseña
      const emailInput = document.querySelector('input[name="email"]');
      const passwordInput = document.querySelector('input[name="password"]');
      if (emailInput.value.length >= 1 && passwordInput.value.length >= 1) {
        var usuarioValido = false;
        // Asigna los valores a las variables globales
        window.emailIngresado = emailInput.value;
        window.contraseñaIngresada = passwordInput.value;
        console.log('Usuario ingresado:', window.emailIngresado);
        console.log('Contraseña ingresada:', window.contraseñaIngresada);
        usuarios.forEach(usuario => {
            if (emailIngresado == usuario.correo && contraseñaIngresada == usuario.contraseña) {
                console.log('Correo y contraseña válidos.');
                usuarioValido = true;
            }
        });
        // Verifica si el usuario y la contraseña son válidos
        if (!usuarioValido) {
          console.error('Correo o contraseña incorrectos.');
          alert('Correo o contraseña incorrectos. Por favor, inténtalo de nuevo.');
        }
        else {
          console.log('Correo y contraseña válidos.');
          //alert('Inicio de sesión exitoso.');
          // Cambia las clases usando JavaScript puro
          const btnAnimate = document.querySelector('.btn-animate');
          const welcome = document.querySelector('.welcome');
          const coverPhoto = document.querySelector('.cover-photo');
          const frame = document.querySelector('.frame');
          const profilePhoto = document.querySelector('.profile-photo');
          const btnGoBack = document.querySelector('.btn-goback');
          const forgot = document.querySelector('.forgot');
          if (btnAnimate) btnAnimate.classList.toggle('btn-animate-grow');
          if (welcome) {
            fetch('http://localhost:3000/cliente_nombre?correo=' + emailIngresado)
            .then(response => response.json())
            .then(data => {
              clienteNombre = data.nombre;
              console.log('Nombre del cliente:', clienteNombre);
              welcome.textContent = `Welcome ${clienteNombre}`;
              welcome.classList.toggle('welcome-left');
              if (coverPhoto) coverPhoto.classList.toggle('cover-photo-down');
              if (frame) frame.classList.toggle('frame-short');
              if (profilePhoto) profilePhoto.classList.toggle('profile-photo-down');
              if (btnGoBack) btnGoBack.classList.toggle('btn-goback-up');
              if (forgot) forgot.classList.toggle('forgot-fade');
            })
            .catch(error => {
              console.error('Error al obtener el nombre del cliente:', error);
            });
          }
            // Busca el cliente correspondiente por correo
            const cliente = clientes.find(c => c.correo === window.emailIngresado);
            if (cliente) {
              localStorage.setItem('id_cliente', cliente.id_cliente);
              localStorage.setItem('nombre_cliente', cliente.nombre || '');
              localStorage.setItem('correo_cliente', cliente.correo);
              localStorage.setItem('telefono_cliente', cliente.telefono || '');
              localStorage.setItem('isLoggedIn', 'true'); // Marca al usuario como logueado
              if (welcome) {
                welcome.textContent = `Welcome ${cliente.nombre || cliente.correo}`;
                welcome.classList.toggle('welcome-left');
              }
            }
            // Redirige al index solo si login es exitoso
            //setTimeout(() => {
            //  window.location.href = "../Paginas_Front_end/index.html";
            //});
        }
      }
      else {
        console.error('Los campos de correo o contraseña no han sido ingresados.');
        alert('Por favor, ingresa un correo y una contraseña válidos.');
      }
    });
  }

  if (btnGoIndex && localStorage.getItem('isLoggedIn') === 'true') {
    btnGoIndex.addEventListener('click', function(e) {
      e.preventDefault();
      // Busca el usuario logueado usando el correo almacenado
      const correo = localStorage.getItem('correo_cliente') || window.emailIngresado;
      const usuario = usuarios.find(u => u.correo === correo);
      if (usuario && usuario.tipo_usuario == '0') {
        window.location.href = "/PMBackend/frontend/paginas/pagina_principal.html";
      } else {
        window.location.href = "/PMBackend/frontend/paginas/pagina_principal_admin.html";
      }
    });
  }

  // REGISTRO DE USUARIO
  const btnSignUp = document.querySelector('.btn-signup');
  if (btnSignUp) {
    btnSignUp.addEventListener('click', async function(e) {
      console.log('Click en Sign Up');
      e.preventDefault();
      // Selecciona SOLO los campos del formulario de registro
      const form = document.querySelector('.form-signup');
      const email = form.querySelector('input[name="remail"]').value;
      const password = form.querySelector('input[name="rpassword"]').value;
      const id_cliente = form.querySelector('input[name="id_cliente"]').value;

      // Validación básica
      if (!email || !password || !id_cliente) {
        alert('Por favor, completa todos los campos para registrarte.');
        return;
      }

      // Lógica de negocio: verificar si el correo corresponde al id_cliente
      let clienteValido = false;
      clientes.forEach(cliente => {
        if (cliente.id_cliente == id_cliente && cliente.correo == email) {
          clienteValido = true;
        }
      });

      if (!clienteValido) {
        alert('El correo no corresponde al cliente con ese ID.');
        return;
      }
      //Si pasa la validación, continúa con el registro
      else {
        try {
          const response = await fetch('http://localhost:3000/api/registrar_usuario', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contraseña: password,
              id_cliente: id_cliente
            })
          });

          const data = await response.json();
          if (response.ok) {
            alert('¡Usuario registrado correctamente!');
            window.location.reload(); // Recarga la página
          } else {
            alert('Error al registrar usuario');
          }
        } catch (error) {
          alert('Error de conexión con el servidor.');
          console.error(error);
        }
      }
    });
  }
});
//----------------------------------------------------------------------------------------


// Hacemos una petición GET al backend
fetch('http://localhost:3000/usuarios')
  .then(response => response.json())
  .then(data => {
    // Guardamos los usuarios en la lista
    usuarios.push(...data);
    if (usuarios.length === 0) {
      console.log('No hay usuarios disponibles.');
      return;
    }
    else {
      console.log('Usuarios obtenidos:', usuarios);
    }
    //const lista = document.getElementById('lista-usuarios');
    usuarios.forEach(usuario => {
      console.log(`Contr: ${usuario.contraseña}, Corr: ${usuario.correo}`);
      //const li = document.createElement('li');
      //li.textContent = `Contr: ${usuario.contraseña}, Nomb: ${usuario.usuario}`;
      //lista.appendChild(li);
    });
  })
  .catch(error => {
    console.error('Error al obtener usuarios:', error);
  });

//----------------------------------------------------------------------------------------

//Aqui obtenemos el id y correo para
//verificar dentro del formulario de
//registro si concuerdan el id y el correo
fetch('http://localhost:3000/clientes')
  .then(response => response.json())
    .then(data => {
      // Guardamos los clientes en la lista
      clientes.push(...data);
      if (clientes.length === 0) {
        console.log('No hay clientes disponibles.');
        return;
      }
      else {
        console.log('Clientes obtenidos:', clientes);
      }
      clientes.forEach(cliente => {
        console.log(`ID: ${cliente.id_cliente}, Correo: ${cliente.correo}`);
    });    
  })
  .catch(error => {
    console.error('Error al obtener clientes:', error);
  });
