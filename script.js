//Definicion de variables 
const USUARIO_VALIDO = "usuario@Idep.edu";
const CLAVE_VALIDA = "123456";
let intentos = 0;
const MAX_INTENTOS = 3;
// Union con el html, esto es para leer lo que tenemos en html 
const btnIngresar = document.getElementById('btn-ingresar');
const loginScreen = document.getElementById('login-screen');
const dashboardScreen = document.getElementById('dashboard-screen');
const alertBox = document.getElementById('alert-box');
const alertText = document.getElementById('alert-text');
