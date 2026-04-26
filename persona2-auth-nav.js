
// ─────────────────────────────────────────────────────────────
const CREDENCIALES = [
  { email: "usuario@idep.edu", password: "123456",  rol: "estudiante" },
  { email: "admin@idep.edu",   password: "admin123", rol: "admin"      }
];

let intentos     = 0;       // contador de intentos fallidos
const MAX_INTENTOS = 3;     // máximo antes de bloquear
let usuarioActivo = null;   // objeto del usuario logueado
const loginScreen     = document.getElementById('login-screen');
const dashboardScreen = document.getElementById('dashboard-screen');
const adminScreen     = document.getElementById('admin-screen');
const btnIngresar     = document.getElementById('btn-ingresar');
const alertBox        = document.getElementById('alert-box');
const alertText       = document.getElementById('alert-text');


function initStorage() {
  // Solo carga usuarios si no existen todavía
  if (!localStorage.getItem('idep_usuarios')) {
    const defaultUsers = [
      { id: 1, nombre: "Juan Pérez",   email: "jperez@idep.edu", password: "pass123", rol: "estudiante" },
      { id: 2, nombre: "Ana Gómez",    email: "agomez@idep.edu", password: "pass123", rol: "estudiante" },
      { id: 3, nombre: "Carlos López", email: "clopez@idep.edu", password: "pass123", rol: "docente"    }
    ];
    localStorage.setItem('idep_usuarios', JSON.stringify(defaultUsers));
  }

  // Solo carga notas si no existen todavía
  if (!localStorage.getItem('idep_notas')) {
    const defaultNotas = [
      { id: 1, usuarioId: 1, materia: "Backend I",                              nota: 4.7 },
      { id: 2, usuarioId: 1, materia: "Frontend I",                             nota: 3.9 },
      { id: 3, usuarioId: 1, materia: "Metodologías ágiles para la programación", nota: 4.5 },
      { id: 4, usuarioId: 2, materia: "Backend I",                              nota: 3.2 },
      { id: 5, usuarioId: 2, materia: "Frontend I",                             nota: 4.0 }
    ];
    localStorage.setItem('idep_notas', JSON.stringify(defaultNotas));
  }
}
// ─────────────────────────────────────────────────────────────
// 5. FUNCIONES DE ALERTA
//    Muestran u ocultan el cuadro de mensaje de error en el login.
// ─────────────────────────────────────────────────────────────

// Muestra el mensaje de error con el texto indicado
function mostrarAlerta(msg) {
  alertBox.classList.remove('hidden');
  alertText.innerHTML = msg;   // innerHTML permite HTML (negritas, etc.)
}

function ocultarAlerta() {
  alertBox.classList.add('hidden');
}
function validarAcceso() {
  
  const emailVal = document.getElementById('email').value.trim();
  const passVal  = document.getElementById('password').value;

  console.log("--- Intento de ingreso:", emailVal);


  const user = CREDENCIALES.find(
    u => u.email === emailVal && u.password === passVal
  );

 
  if (user) {
    usuarioActivo = user;   // guardamos quién está logueado
    intentos = 0;           // reiniciamos el contador
    ocultarAlerta();

  
    loginScreen.classList.add('hidden');
    document.body.classList.remove('login-bg');

  
    if (user.rol === 'admin') {
      adminScreen.classList.remove('hidden');
     
      renderAdminUsers();
    } else {
      dashboardScreen.classList.remove('hidden');
    
      renderNotasEstudiante();
    }


  } else {
    intentos++;
    console.warn("Intento fallido #" + intentos);

    if (intentos >= MAX_INTENTOS) {
      mostrarAlerta(
        "<strong>¡Acceso bloqueado!</strong><br>" +
        "Superaste los " + MAX_INTENTOS + " intentos permitidos."
      );
      btnIngresar.disabled = true;
      btnIngresar.textContent = "BLOQUEADO";
    } else {
      mostrarAlerta(
        "Credenciales incorrectas. " +
        "Intentos restantes: <strong>" + (MAX_INTENTOS - intentos) + "</strong>"
      );
    }
  }
}

btnIngresar.addEventListener('click', validarAcceso);


document.getElementById('password').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') validarAcceso();
});


function logout() {
      // Resetear estado
  usuarioActivo = null;
  intentos = 0;


  btnIngresar.disabled = false;
  btnIngresar.textContent = "Ingresar";

    // Limpiar el formulario de login
  document.getElementById('email').value = '';
  document.getElementById('password').value = '';
  ocultarAlerta();

  // Ocultar todas las pantallas y mostrar login
  dashboardScreen.classList.add('hidden');
  adminScreen.classList.add('hidden');
  loginScreen.classList.remove('hidden');
  document.body.classList.add('login-bg');
}

// Registrar logout en ambos botones (estudiante y admin)
document.getElementById('btn-logout').addEventListener('click', logout);
document.getElementById('btn-admin-logout').addEventListener('click', logout);



document.querySelectorAll('[data-section]').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault(); // Evitar que el <a> recargue la página

    const target = this.dataset.section; // ej: "notas", "horario"

   
    document.querySelectorAll('[data-section]').forEach(l => {
      l.classList.remove('active');
    });
 
    this.classList.add('active');

    
    document.querySelectorAll('#dashboard-screen .content-section').forEach(s => {
      s.classList.add('hidden');
    });
// Mostrar solo la sección objetivo
    const seccion = document.getElementById('section-' + target);
    if (seccion) seccion.classList.remove('hidden');

    // Actualizar el título en el topbar
    const titulos = {
      notas:      'Mis Notas',
      horario:    'Mi Horario',
      asistencia: 'Asistencia'
    };
    document.getElementById('section-heading').textContent = titulos[target] || '';
  });
});


document.querySelectorAll('[data-admin-section]').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();

    const target = this.dataset.adminSection; // ej: "usuarios", "notas-admin"

   
    document.querySelectorAll('[data-admin-section]').forEach(l => {
      l.classList.remove('active');
    });
    this.classList.add('active');

    // Ocultar todas las secciones del admin
    document.querySelectorAll('#admin-screen .content-section').forEach(s => {
      s.classList.add('hidden');
    });
    // Mostrar la sección correcta
    const seccion = document.getElementById('admin-section-' + target);
    if (seccion) seccion.classList.remove('hidden');

    // Actualizar el título del topbar
    const titulos = {
      'usuarios':    'Gestión de Usuarios',
      'notas-admin': 'Gestión de Notas'
    };
    document.getElementById('admin-heading').textContent = titulos[target] || '';

    // Llamar a Persona 3 para renderizar los datos de la sección
    if (target === 'usuarios')    renderAdminUsers();
    if (target === 'notas-admin') renderAdminNotas();
  });
});

initStorage();
