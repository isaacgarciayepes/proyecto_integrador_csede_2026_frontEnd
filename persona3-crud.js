// =====================================================================
//  PERSONA 3 — CRUD de Usuarios y Notas
//  Responsabilidad:
//    - Leer y mostrar notas del estudiante en el dashboard
//    - CRUD completo de usuarios (admin): crear, listar, editar, eliminar
//    - CRUD completo de notas (admin):    crear, listar, editar, eliminar
//    - Validaciones de formularios
//    - Persistencia en localStorage
//
//  DEPENDE DE (ids definidos por Persona 1 en el HTML):
//    notas-tbody, stat-materias, stat-promedio, stat-aprobadas
//    users-tbody, notas-admin-tbody
//    user-form-container, nota-form-container
//    user-form-title, nota-form-title
//    user-form-id, nota-form-id
//    user-nombre, user-email, user-password, user-rol
//    nota-usuario, nota-materia, nota-valor
//    user-form-error, nota-form-error
//    btn-add-user, btn-cancel-user, btn-save-user
//    btn-add-nota, btn-cancel-nota, btn-save-nota
//
//  SUS FUNCIONES SON LLAMADAS POR Persona 2:
//    renderNotasEstudiante() → al hacer login como estudiante
//    renderAdminUsers()      → al hacer login como admin y navegar a usuarios
//    renderAdminNotas()      → al navegar a sección notas admin
// =====================================================================


// ─────────────────────────────────────────────────────────────
// 1. FUNCIONES DE ACCESO AL LOCALSTORAGE
//    Estas funciones centralizan la lectura y escritura.
//    Así solo cambiamos un lugar si necesitamos modificar algo.
// ─────────────────────────────────────────────────────────────

// Leer el arreglo de usuarios. Si no existe, devuelve [] vacío.
function getUsuarios() {
  return JSON.parse(localStorage.getItem('idep_usuarios')) || [];
}

// Guardar el arreglo de usuarios (sobreescribe el anterior)
function setUsuarios(data) {
  localStorage.setItem('idep_usuarios', JSON.stringify(data));
}

// Leer el arreglo de notas
function getNotas() {
  return JSON.parse(localStorage.getItem('idep_notas')) || [];
}

// Guardar el arreglo de notas
function setNotas(data) {
  localStorage.setItem('idep_notas', JSON.stringify(data));
}

// Generar el próximo id automáticamente.
// Toma el id más alto del arreglo y le suma 1.
// Si el arreglo está vacío, empieza en 1.
function nextId(arr) {
  return arr.length ? Math.max(...arr.map(x => x.id)) + 1 : 1;
}


// ─────────────────────────────────────────────────────────────
// 2. DASHBOARD ESTUDIANTE — Mostrar notas
//    Llamada por Persona 2 cuando el estudiante hace login.
//    Llena la tabla y las tarjetas de estadísticas.
// ─────────────────────────────────────────────────────────────
function renderNotasEstudiante() {
  // El estudiante demo tiene id = 1
  // En una versión real, usaríamos usuarioActivo.id
  const notas = getNotas().filter(n => n.usuarioId === 1);
  const tbody = document.getElementById('notas-tbody');

  // Limpiar la tabla antes de llenarla para evitar duplicados
  tbody.innerHTML = '';

  // Si no hay notas, mostrar mensaje
  if (notas.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;color:#6B7280">Sin notas registradas</td></tr>';
    return;
  }

  // Crear una fila por cada nota
  notas.forEach(n => {
    const aprobado = n.nota >= 3.0;   // en Colombia: mínimo aprobatorio 3.0

    // createElement crea un elemento HTML nuevo (no está en el DOM todavía)
    const tr = document.createElement('tr');

    // innerHTML define el contenido HTML de la fila
    // El template literal (backticks) permite insertar variables con ${}
    tr.innerHTML = `
      <td>${n.materia}</td>
      <td><span style="font-size:1.2rem;font-weight:700">${n.nota.toFixed(1)}</span></td>
      <td>
        <span class="${aprobado ? 'badge-aprobado' : 'badge-reprobado'}">
          ${aprobado ? 'Aprobado' : 'Reprobado'}
        </span>
      </td>
    `;

    // appendChild agrega la fila al final del tbody (ya visible en pantalla)
    tbody.appendChild(tr);
  });

  // Calcular y actualizar las estadísticas
  const promedio  = notas.reduce((suma, n) => suma + n.nota, 0) / notas.length;
  const aprobadas = notas.filter(n => n.nota >= 3.0).length;

  document.getElementById('stat-materias').textContent  = notas.length;
  document.getElementById('stat-promedio').textContent  = promedio.toFixed(1);
  document.getElementById('stat-aprobadas').textContent = aprobadas;
}


// ─────────────────────────────────────────────────────────────
// 3. CRUD USUARIOS — Variables de estado
//    editandoUserId guarda el id del usuario que se está
//    editando. null significa que estamos creando uno nuevo.
// ─────────────────────────────────────────────────────────────
let editandoUserId = null;


// ─────────────────────────────────────────────────────────────
// 4. CRUD USUARIOS — Leer y mostrar (READ)
//    Llamada por Persona 2 al entrar al panel admin.
//    Limpia y vuelve a construir toda la tabla de usuarios.
// ─────────────────────────────────────────────────────────────
function renderAdminUsers() {
  const usuarios = getUsuarios();
  const tbody    = document.getElementById('users-tbody');
  tbody.innerHTML = '';   // limpiar tabla

  if (usuarios.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#6B7280">No hay usuarios registrados</td></tr>';
    return;
  }

  usuarios.forEach(u => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${u.nombre}</strong></td>
      <td>${u.email}</td>
      <td><span class="badge-rol">${u.rol}</span></td>
      <td>
        <button class="btn-edit"   data-id="${u.id}">✏ Editar</button>
        <button class="btn-delete" data-id="${u.id}">🗑 Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Importante: los botones se crean dinámicamente, así que debemos
  // agregarles los eventos DESPUÉS de crearlos (no antes).
  // data-id guarda el id del usuario en el propio botón.
  tbody.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', () => abrirFormUser(parseInt(btn.dataset.id)));
  });
  tbody.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', () => eliminarUsuario(parseInt(btn.dataset.id)));
  });
}


// ─────────────────────────────────────────────────────────────
// 5. CRUD USUARIOS — Abrir formulario (CREATE / UPDATE)
//    Si recibe un id: modo edición (llena el form con los datos)
//    Si no recibe id (null): modo creación (form vacío)
// ─────────────────────────────────────────────────────────────
function abrirFormUser(id = null) {
  editandoUserId = id;
  const formContainer = document.getElementById('user-form-container');
  formContainer.classList.remove('hidden');
  document.getElementById('user-form-error').classList.add('hidden');

  if (id) {
    // Modo edición: buscar el usuario y pre-llenar el formulario
    const u = getUsuarios().find(u => u.id === id);
    document.getElementById('user-form-title').textContent  = 'Editar Usuario';
    document.getElementById('user-form-id').value           = u.id;
    document.getElementById('user-nombre').value            = u.nombre;
    document.getElementById('user-email').value             = u.email;
    document.getElementById('user-password').value          = u.password;
    document.getElementById('user-rol').value               = u.rol;
  } else {
    // Modo creación: limpiar todos los campos
    document.getElementById('user-form-title').textContent  = 'Nuevo Usuario';
    document.getElementById('user-form-id').value           = '';
    document.getElementById('user-nombre').value            = '';
    document.getElementById('user-email').value             = '';
    document.getElementById('user-password').value          = '';
    document.getElementById('user-rol').value               = 'estudiante';
  }

  // Hacer scroll suave hasta el formulario
  formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}


// ─────────────────────────────────────────────────────────────
// 6. CRUD USUARIOS — Cerrar formulario
// ─────────────────────────────────────────────────────────────
function cerrarFormUser() {
  document.getElementById('user-form-container').classList.add('hidden');
  editandoUserId = null;
}


// ─────────────────────────────────────────────────────────────
// 7. CRUD USUARIOS — Guardar (CREATE o UPDATE)
//    Valida los datos antes de guardar.
//    Si editandoUserId tiene valor → actualiza.
//    Si es null → crea nuevo.
// ─────────────────────────────────────────────────────────────
function guardarUsuario() {
  const nombre   = document.getElementById('user-nombre').value.trim();
  const email    = document.getElementById('user-email').value.trim();
  const password = document.getElementById('user-password').value;
  const rol      = document.getElementById('user-rol').value;
  const errorEl  = document.getElementById('user-form-error');

  // ── Validaciones ──────────────────────────────────────────
  if (!nombre || !email || !password) {
    errorEl.textContent = 'Todos los campos son obligatorios.';
    errorEl.classList.remove('hidden');
    return;   // detiene la función: no guarda si hay error
  }

  // Expresión regular básica para validar formato de email
  if (!/\S+@\S+\.\S+/.test(email)) {
    errorEl.textContent = 'Ingresa un correo válido.';
    errorEl.classList.remove('hidden');
    return;
  }

  if (password.length < 6) {
    errorEl.textContent = 'La contraseña debe tener mínimo 6 caracteres.';
    errorEl.classList.remove('hidden');
    return;
  }

  // Si llegamos aquí, los datos son válidos
  errorEl.classList.add('hidden');
  const usuarios = getUsuarios();

  if (editandoUserId) {
    // ── ACTUALIZAR usuario existente ─────────────────────────
    // findIndex devuelve la posición en el arreglo (-1 si no existe)
    const idx = usuarios.findIndex(u => u.id === editandoUserId);
    if (idx !== -1) {
      // Spread operator (...) copia todas las propiedades del objeto
      // y luego sobreescribe solo las que cambiaron
      usuarios[idx] = { ...usuarios[idx], nombre, email, password, rol };
    }
  } else {
    // ── CREAR usuario nuevo ──────────────────────────────────
    // Primero verificar que el correo no esté ya registrado
    const emailExiste = usuarios.some(u => u.email === email);
    if (emailExiste) {
      errorEl.textContent = 'Ya existe un usuario con ese correo.';
      errorEl.classList.remove('hidden');
      return;
    }
    usuarios.push({
      id: nextId(usuarios),   // id automático
      nombre,
      email,
      password,
      rol
    });
  }

  // Guardar en localStorage y refrescar la tabla
  setUsuarios(usuarios);
  cerrarFormUser();
  renderAdminUsers();
  actualizarSelectEstudiantes();  // por si la lista de notas necesita actualizarse
}


// ─────────────────────────────────────────────────────────────
// 8. CRUD USUARIOS — Eliminar (DELETE)
//    Pide confirmación antes de borrar.
//    También elimina todas las notas asociadas al usuario.
// ─────────────────────────────────────────────────────────────
function eliminarUsuario(id) {
  if (!confirm('¿Eliminar este usuario? También se eliminarán sus notas.')) return;

  // filter crea un NUEVO arreglo sin el elemento que tiene ese id
  // El usuario con id=id queda fuera porque u.id !== id es false
  const nuevosUsuarios = getUsuarios().filter(u => u.id !== id);
  const nuevasNotas    = getNotas().filter(n => n.usuarioId !== id);

  setUsuarios(nuevosUsuarios);
  setNotas(nuevasNotas);
  renderAdminUsers();
}


// ─────────────────────────────────────────────────────────────
// 9. EVENTOS FORMULARIO USUARIOS
// ─────────────────────────────────────────────────────────────
document.getElementById('btn-add-user').addEventListener('click', () => abrirFormUser());
document.getElementById('btn-cancel-user').addEventListener('click', cerrarFormUser);
document.getElementById('btn-save-user').addEventListener('click', guardarUsuario);


// ─────────────────────────────────────────────────────────────
// 10. CRUD NOTAS — Variables de estado
// ─────────────────────────────────────────────────────────────
let editandoNotaId = null;


// ─────────────────────────────────────────────────────────────
// 11. CRUD NOTAS — Llenar select de estudiantes
//    El formulario de notas tiene un <select> para elegir
//    a qué estudiante pertenece la nota. Lo llenamos
//    dinámicamente con los usuarios de rol "estudiante".
// ─────────────────────────────────────────────────────────────
function actualizarSelectEstudiantes() {
  const select      = document.getElementById('nota-usuario');
  const estudiantes = getUsuarios().filter(u => u.rol === 'estudiante');

  select.innerHTML = '';   // limpiar opciones anteriores

  if (estudiantes.length === 0) {
    select.innerHTML = '<option value="">Sin estudiantes disponibles</option>';
    return;
  }

  estudiantes.forEach(u => {
    const opt       = document.createElement('option');
    opt.value       = u.id;         // el value es el id del estudiante
    opt.textContent = u.nombre;     // el texto visible es su nombre
    select.appendChild(opt);
  });
}


// ─────────────────────────────────────────────────────────────
// 12. CRUD NOTAS — Leer y mostrar (READ)
//    Llamada por Persona 2 al navegar a la sección de notas admin.
//    Cruza el arreglo de notas con el de usuarios para mostrar
//    el nombre del estudiante en lugar de su id.
// ─────────────────────────────────────────────────────────────
function renderAdminNotas() {
  actualizarSelectEstudiantes();  // actualizar el select del formulario

  const notas    = getNotas();
  const usuarios = getUsuarios();
  const tbody    = document.getElementById('notas-admin-tbody');
  tbody.innerHTML = '';

  if (notas.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#6B7280">No hay notas registradas</td></tr>';
    return;
  }

  notas.forEach(n => {
    // Buscar el usuario al que pertenece esta nota
    const usr    = usuarios.find(u => u.id === n.usuarioId);
    const nombre = usr ? usr.nombre : 'Usuario eliminado';
    const aprobado = n.nota >= 3.0;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${nombre}</td>
      <td>${n.materia}</td>
      <td><span style="font-size:1.2rem;font-weight:700">${n.nota.toFixed(1)}</span></td>
      <td>
        <span class="${aprobado ? 'badge-aprobado' : 'badge-reprobado'}">
          ${aprobado ? 'Aprobado' : 'Reprobado'}
        </span>
      </td>
      <td>
        <button class="btn-edit"   data-id="${n.id}">✏ Editar</button>
        <button class="btn-delete" data-id="${n.id}">🗑 Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', () => abrirFormNota(parseInt(btn.dataset.id)));
  });
  tbody.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', () => eliminarNota(parseInt(btn.dataset.id)));
  });
}


// ─────────────────────────────────────────────────────────────
// 13. CRUD NOTAS — Abrir formulario (CREATE / UPDATE)
// ─────────────────────────────────────────────────────────────
function abrirFormNota(id = null) {
  editandoNotaId = id;
  actualizarSelectEstudiantes();  // siempre actualizar el select primero

  const formContainer = document.getElementById('nota-form-container');
  formContainer.classList.remove('hidden');
  document.getElementById('nota-form-error').classList.add('hidden');

  if (id) {
    // Modo edición
    const n = getNotas().find(n => n.id === id);
    document.getElementById('nota-form-title').textContent = 'Editar Nota';
    document.getElementById('nota-form-id').value          = n.id;
    document.getElementById('nota-usuario').value          = n.usuarioId;
    document.getElementById('nota-materia').value          = n.materia;
    document.getElementById('nota-valor').value            = n.nota;
  } else {
    // Modo creación
    document.getElementById('nota-form-title').textContent = 'Nueva Nota';
    document.getElementById('nota-form-id').value          = '';
    document.getElementById('nota-materia').value          = '';
    document.getElementById('nota-valor').value            = '';
  }

  formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}


// ─────────────────────────────────────────────────────────────
// 14. CRUD NOTAS — Cerrar formulario
// ─────────────────────────────────────────────────────────────
function cerrarFormNota() {
  document.getElementById('nota-form-container').classList.add('hidden');
  editandoNotaId = null;
}


// ─────────────────────────────────────────────────────────────
// 15. CRUD NOTAS — Guardar (CREATE o UPDATE)
// ─────────────────────────────────────────────────────────────
function guardarNota() {
  const usuarioId = parseInt(document.getElementById('nota-usuario').value);
  const materia   = document.getElementById('nota-materia').value.trim();
  const valor     = parseFloat(document.getElementById('nota-valor').value);
  const errorEl   = document.getElementById('nota-form-error');

  // ── Validaciones ──────────────────────────────────────────
  if (!materia) {
    errorEl.textContent = 'Ingresa el nombre de la materia.';
    errorEl.classList.remove('hidden');
    return;
  }

  // isNaN("abc") = true, isNaN(4.5) = false
  if (isNaN(valor) || valor < 0 || valor > 5) {
    errorEl.textContent = 'La nota debe ser un valor entre 0.0 y 5.0.';
    errorEl.classList.remove('hidden');
    return;
  }

  if (!usuarioId) {
    errorEl.textContent = 'Selecciona un estudiante.';
    errorEl.classList.remove('hidden');
    return;
  }

  errorEl.classList.add('hidden');
  const notas = getNotas();

  if (editandoNotaId) {
    // ── ACTUALIZAR ────────────────────────────────────────────
    const idx = notas.findIndex(n => n.id === editandoNotaId);
    if (idx !== -1) {
      notas[idx] = { ...notas[idx], usuarioId, materia, nota: valor };
    }
  } else {
    // ── CREAR ─────────────────────────────────────────────────
    notas.push({
      id: nextId(notas),
      usuarioId,
      materia,
      nota: valor
    });
  }

  setNotas(notas);
  cerrarFormNota();
  renderAdminNotas();
}


// ─────────────────────────────────────────────────────────────
// 16. CRUD NOTAS — Eliminar (DELETE)
// ─────────────────────────────────────────────────────────────
function eliminarNota(id) {
  if (!confirm('¿Eliminar esta nota?')) return;
  setNotas(getNotas().filter(n => n.id !== id));
  renderAdminNotas();
}


// ─────────────────────────────────────────────────────────────
// 17. EVENTOS FORMULARIO NOTAS
// ─────────────────────────────────────────────────────────────
document.getElementById('btn-add-nota').addEventListener('click', () => {
  actualizarSelectEstudiantes();
  abrirFormNota();
});
document.getElementById('btn-cancel-nota').addEventListener('click', cerrarFormNota);
document.getElementById('btn-save-nota').addEventListener('click', guardarNota);
