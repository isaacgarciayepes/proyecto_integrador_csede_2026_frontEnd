
// ─────────────────────────────────────────────────────────────
// 1. CREDENCIALES
// ─────────────────────────────────────────────────────────────
const CREDENCIALES = [
  { email: "usuario@idep.edu", password: "123456",  rol: "estudiante" },
  { email: "admin@idep.edu",   password: "admin123", rol: "admin"      }
];

// ─────────────────────────────────────────────────────────────
// 2. VARIABLES DE ESTADO
// ─────────────────────────────────────────────────────────────
let intentos      = 0;
const MAX_INTENTOS = 3;
let usuarioActivo  = null;

// ─────────────────────────────────────────────────────────────
// 3. SELECTORES DEL DOM
// ─────────────────────────────────────────────────────────────
const landingScreen   = document.getElementById('landing-screen');
const loginScreen     = document.getElementById('login-screen');
const dashboardScreen = document.getElementById('dashboard-screen');
const adminScreen     = document.getElementById('admin-screen');
const btnIngresar     = document.getElementById('btn-ingresar');
const alertBox        = document.getElementById('alert-box');
const alertText       = document.getElementById('alert-text');


// Muestra el login y oculta la landing
function mostrarLogin() {
  landingScreen.classList.add('hidden');
  loginScreen.classList.remove('hidden');
  document.body.classList.remove('landing-body');
  document.body.classList.add('login-bg');
}

// Vuelve a la landing desde el login
function volverLanding() {
  loginScreen.classList.add('hidden');
  landingScreen.classList.remove('hidden');
  document.body.classList.remove('login-bg');
  document.body.classList.add('landing-body');
  ocultarAlerta();
}

// Botones que llevan al login desde la landing
document.getElementById('btn-ir-login').addEventListener('click', mostrarLogin);
document.getElementById('btn-hero-ingresar').addEventListener('click', mostrarLogin);

// Botón para volver a la landing desde el login
document.getElementById('btn-volver-landing').addEventListener('click', volverLanding);


// ─────────────────────────────────────────────────────────────
// 5. CARGA INICIAL CON FETCH — NOVEDAD TERCERA ENTREGA

function cargarDatosIniciales() {

  // Solo carga usuarios si no existen todavía en localStorage
  if (!localStorage.getItem('idep_usuarios')) {
    fetch('data/usuarios.json')
      .then(function(respuesta) {
        // .json() convierte el texto del archivo a un arreglo JS
        return respuesta.json();
      })
      .then(function(usuarios) {
        // Guardar en localStorage para que el CRUD pueda usarlos
        localStorage.setItem('idep_usuarios', JSON.stringify(usuarios));
        console.log('Usuarios cargados desde JSON:', usuarios.length);
      })
      .catch(function(error) {
        console.error('Error cargando usuarios.json:', error);
      });
  }

  // Solo carga notas si no existen todavía en localStorage
  if (!localStorage.getItem('idep_notas')) {
    fetch('data/notas.json')
      .then(function(respuesta) {
        return respuesta.json();
      })
      .then(function(notas) {
        localStorage.setItem('idep_notas', JSON.stringify(notas));
        console.log('Notas cargadas desde JSON:', notas.length);
      })
      .catch(function(error) {
        console.error('Error cargando notas.json:', error);
      });
  }
}

// ─────────────────────────────────────────────────────────────
// 6. FUNCIONES DE ALERTA
// ─────────────────────────────────────────────────────────────
function mostrarAlerta(msg) {
  alertBox.classList.remove('hidden');
  alertText.innerHTML = msg;
}

function ocultarAlerta() {
  alertBox.classList.add('hidden');
}

// ─────────────────────────────────────────────────────────────
// 7. FUNCIÓN DE LOGIN — igual que segunda entrega
// ─────────────────────────────────────────────────────────────
function validarAcceso() {
  const emailVal = document.getElementById('email').value.trim();
  const passVal  = document.getElementById('password').value;

  console.log('--- Intento de ingreso:', emailVal);

  const user = CREDENCIALES.find(
    function(u) { return u.email === emailVal && u.password === passVal; }
  );

  if (user) {
    usuarioActivo = user;
    intentos = 0;
    ocultarAlerta();

    // Ocultar login
    loginScreen.classList.add('hidden');
    document.body.classList.remove('login-bg');

    // Mostrar pantalla según rol
    if (user.rol === 'admin') {
      adminScreen.classList.remove('hidden');
      renderAdminUsers();
    } else {
      dashboardScreen.classList.remove('hidden');
      renderNotasEstudiante();
    }

  } else {
    intentos++;
    console.warn('Intento fallido #' + intentos);

    if (intentos >= MAX_INTENTOS) {
      mostrarAlerta(
        '<strong>¡Acceso bloqueado!</strong><br>' +
        'Superaste los ' + MAX_INTENTOS + ' intentos permitidos.'
      );
      btnIngresar.disabled = true;
      btnIngresar.textContent = 'BLOQUEADO';
    } else {
      mostrarAlerta(
        'Credenciales incorrectas. ' +
        'Intentos restantes: <strong>' + (MAX_INTENTOS - intentos) + '</strong>'
      );
    }
  }
}

btnIngresar.addEventListener('click', validarAcceso);
document.getElementById('password').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') validarAcceso();
});

// ─────────────────────────────────────────────────────────────
// 8. LOGOUT — vuelve a la landing en lugar de recargar
// ─────────────────────────────────────────────────────────────
function logout() {
  usuarioActivo = null;
  intentos = 0;

  btnIngresar.disabled = false;
  btnIngresar.textContent = 'Ingresar';

  document.getElementById('email').value    = '';
  document.getElementById('password').value = '';
  ocultarAlerta();

  dashboardScreen.classList.add('hidden');
  adminScreen.classList.add('hidden');

  // Volver a la landing
  landingScreen.classList.remove('hidden');
  document.body.classList.add('landing-body');
}

document.getElementById('btn-logout').addEventListener('click', logout);
document.getElementById('btn-admin-logout').addEventListener('click', logout);

// ─────────────────────────────────────────────────────────────
// 9. NAVEGACIÓN SIDEBAR — ESTUDIANTE — igual que segunda entrega
// ─────────────────────────────────────────────────────────────
document.querySelectorAll('[data-section]').forEach(function(link) {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const target = this.dataset.section;

    document.querySelectorAll('[data-section]').forEach(function(l) {
      l.classList.remove('active');
    });
    this.classList.add('active');

    document.querySelectorAll('#dashboard-screen .content-section').forEach(function(s) {
      s.classList.add('hidden');
    });

    const seccion = document.getElementById('section-' + target);
    if (seccion) seccion.classList.remove('hidden');

    const titulos = {
      notas:      'Mis Notas',
      horario:    'Mi Horario',
      asistencia: 'Asistencia'
    };
    document.getElementById('section-heading').textContent = titulos[target] || '';
  });
});

//navegacion sidebar
document.querySelectorAll('[data-admin-section]').forEach(function(link) {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const target = this.dataset.adminSection;

    document.querySelectorAll('[data-admin-section]').forEach(function(l) {
      l.classList.remove('active');
    });
    this.classList.add('active');

    document.querySelectorAll('#admin-screen .content-section').forEach(function(s) {
      s.classList.add('hidden');
    });

    const seccion = document.getElementById('admin-section-' + target);
    if (seccion) seccion.classList.remove('hidden');

    const titulos = {
      'usuarios':    'Gestión de Usuarios',
      'notas-admin': 'Gestión de Notas'
    };
    document.getElementById('admin-heading').textContent = titulos[target] || '';

    if (target === 'usuarios')    renderAdminUsers();
    if (target === 'notas-admin') renderAdminNotas();
  });
});

//iniciar
cargarDatosIniciales();
