IDEP - Sistema Académico (Gestión de Notas)
Este proyecto es una aplicación web para la gestión académica de un colegio. Implementa un módulo de autenticación usando Javascript, esta es una fase inicial del área de frontend.
En la segunda entrega ampliamos el sistema con un panel de administración completo que permite gestionar usuarios y notas usando manipulación del DOM, eventos y localStorage.

Funciones
Solicita al usuario el ingreso con el correo de usuario y la contraseña, lee y muestra los datos, verifica si los datos ingresados son correctos, permite el acceso cuando los datos sean válidos, indica cuando los datos son incorrectos, controla intentos de acceso y muestra un mensaje de bloqueo cuando se superen tres intentos fallidos.

Nuevas funciones (Segunda entrega)
Panel de administrador separado del dashboard de estudiante mediante un sistema SPA con clases ocultas (hidden).

Gestión de usuarios (Persona 3): crear, editar y eliminar usuarios con validación de formularios (campos obligatorios, formato de correo con Regex y contraseña mayor a 6 caracteres).

Gestión de notas (Persona 3): registrar, editar y eliminar notas vinculadas por ID de estudiante con borrado en cascada.

Los datos se guardan en localStorage a través de funciones centralizadas (getUsuarios, setUsuarios, getNotas, setNotas) para que persistan al recargar la página.

Navegación dinámica entre secciones sin recargar la página usando atributos data-section y data-admin-section.

Tabla de notas con estado Aprobado / Reprobado automático según la nota ingresada (mínimo aprobatorio de 3.0).

Estadísticas de materias, promedio y aprobadas calculadas dinámicamente con .reduce() en el dashboard del estudiante.

Instrucciones de Uso
Abre el archivo index.html en tu navegador.

Ingresa las siguientes credenciales de prueba de la lista principal:

Estudiante

Correo: usuario@idep.edu

Contraseña: 123456

Administrador

Correo: admin@idep.edu

Contraseña: admin123

Haz clic en el botón INGRESAR.

Para probar el bloqueo: ingresa datos incorrectos 3 veces seguidas y observa el mensaje de advertencia y la desactivación del botón (Texto: "BLOQUEADO").

Tecnologías usadas
HTML5

CSS3 (Flexbox, variables CSS, clases .login-bg y .hidden)

JavaScript vanilla (Módulos divididos por responsabilidades)

localStorage para persistencia de datos en formato JSON

Distribución de Archivos
index.html (Persona 1 - Maquetación y estructura)

persona2-auth-nav.js (Persona 2 - Autenticación, control de intentos y navegación)

persona3-crud.js (Persona 3 - Operaciones CRUD, estadísticas y persistencia)

Equipo
Isaac Garcia

Cristina Arbelaez

Genesis Quinonez

Proyecto integrador - Frontend 1
CESDE · 2025
Docente: Diego Giraldo Zapata