IDEP - Sistema Académico (Gestión de Notas)
Este proyecto es una aplicación web para la gestión académica de un colegio. Implementa un módulo de autenticación usando Javascript, esta es una fase inicial del área de frontend.
En la segunda entrega ampliamos el sistema con un panel de administración completo que permite gestionar usuarios y notas usando manipulación del DOM, eventos y localStorage.

Funciones
Solicita al usuario el ingreso con el correo de usuario y la contraseña, lee y muestra los datos, verifica si los datos ingresados son correctos, permite el acceso cuando los datos sean válidos, indica cuando los datos son incorrectos, controla intentos de acceso y muestra un mensaje de bloqueo cuando se superen tres intentos fallidos.
Nuevas funciones (Segunda entrega)

Panel de administrador separado del dashboard de estudiante
Gestión de usuarios: crear, editar y eliminar usuarios con validación de formularios
Gestión de notas: registrar, editar y eliminar notas por estudiante
Los datos se guardan en localStorage para que persistan al recargar la página
Navegación dinámica entre secciones sin recargar la página
Tabla de notas con estado Aprobado / Reprobado según la nota ingresada
Estadísticas de materias, promedio y aprobadas en el dashboard del estudiante


Instrucciones de Uso
Abre el archivo index.html en tu navegador.
Ingresa las siguientes credenciales de prueba:
Estudiante

Correo: usuario@Idep.edu
Contraseña: 123456

Administrador

Correo: admin@idep.edu
Contraseña: admin123

Haz clic en el botón INGRESAR.
Para probar el bloqueo: ingresa datos incorrectos 3 veces seguidas y observa el mensaje de advertencia y la desactivación del botón.


Tecnologías usadas

HTML5
CSS3 (Flexbox, variables CSS)
JavaScript vanilla (sin frameworks)
localStorage para persistencia de datos




Equipo

Isaac Garcia
Cristina Arbelaez
Genesis Quinonez
Proyecto integrador - Frontend 1
CESDE · 2025
Docente: Diego Giraldo Zapata