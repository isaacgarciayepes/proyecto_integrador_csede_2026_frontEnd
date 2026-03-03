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
/*
Aqui logica, creamos una funcion y bucles
*/
function validarAcceso() {L
    const emailValue = document.getElementById('email').value;
    const passValue = document.getElementById('password').value;
// con el value tomamos la informacion que ingrese el usuario
    console.log("--- Intento de Ingreso ---");
    console.log("Usuario: " + emailValue);
    console.log("Password: " + passValue);

    if (emailValue === USUARIO_VALIDO && passValue === CLAVE_VALIDA) {
        console.log("Acceso exitoso.");
        loginScreen.classList.add('hidden');
        dashboardScreen.classList.remove('hidden');
    } else {
        intentos++;
        console.warn("Intento fallido #" + intentos);

        if (intentos >= MAX_INTENTOS) {
            alertBox.classList.remove('hidden');
            alertText.innerHTML = "<strong>¡Atención!</strong><br>Demasiados intentos de acceso.<br>Por favor, espere unos minutos e intente de nuevo.";
            
            btnIngresar.disabled = true;
            btnIngresar.style.opacity = "0.5";
            btnIngresar.innerText = "BLOQUEADO";
        } else {
            alert("Credenciales incorrectas. Intentos restantes: " + (MAX_INTENTOS - intentos));
        }
    }
}
// aqui iniciamos, al uso de bton ingresar
btnIngresar.onclick = validarAcceso;
