const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const modalNombre = document.getElementById("modalNombre");
const formularioNombre = document.getElementById("formularioNombre");
const inputNombre = document.getElementById("inpNombre");
const btnPantallaCompleta = document.getElementById("btnPantallaCompleta");

const modalAlerta = document.getElementById("modalAlerta");
const pAlerta = document.querySelector(".modalAlerta__texto");
const btnAlerta = document.getElementById("btnAlerta");

const socket = io();

let cuadrado;
let nombre;

let puntos = 0;
let puntosVictoria = 20;
let cuadradoContado = false;

//! FUNCIONES
function dibujar(){
    if(cuadrado){
        ctx.fillStyle = cuadrado.color;
        ctx.fillRect(cuadrado.x, cuadrado.y, cuadrado.tam, cuadrado.tam);
    }

    ctx.fillStyle = "#000";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`Puntos: ${puntos}`, canvas.width/2,30);
}

function comprobarClick(e){
    let x = e.clientX - canvas.getBoundingClientRect().left;
    let y = e.clientY - canvas.getBoundingClientRect().top;

    if(x < cuadrado.x + cuadrado.tam && x > cuadrado.x && y < cuadrado.y + cuadrado.tam && y > cuadrado.y && !cuadradoContado){
        cuadradoContado = true;
        
        puntos++;

        socket.emit("click", {id: socket.id});
        
        if(puntos >= puntosVictoria){
            socket.emit("victoria", { mensaje: `Ganador: ${nombre}` })
        }
    }
}

function actualizarCuadrado(data){
    cuadrado = data;

    // Razon para convertir las coordenadas del cuadrado proporcionalmente
    // Hacer proporcional el juego en todas las pantallas
    let razonX = canvas.width / 500;
    let razonY = canvas.height / 500;

    cuadrado.x = cuadrado.x * razonX;
    cuadrado.y = cuadrado.y * razonY;

    cuadradoContado = false;
}

function pantallaCompleta(){
    if(canvas.requestFullscreen) canvas.requestFullscreen();
    else alert("Tu navegador no soporta pantalla completa");
}

function reiniciarJuego(mensaje){
    if(document.fullscreen) document.exitFullscreen();
    abrirAlerta(mensaje);

    puntos = 0;
}

function abrirAlerta(mensaje){
    pAlerta.textContent = mensaje;
    modalAlerta.classList.remove("cerrado");
}

function loop(){
    canvas.width = canvas.width;

    dibujar();

    requestAnimationFrame(loop);
}

//! EVENTOS
canvas.addEventListener('click', e => comprobarClick(e));

formularioNombre.addEventListener('submit', (e) => {
    e.preventDefault();
    nombre = inputNombre.value.trim();

    if(nombre) modalNombre.classList.add("cerrado");
})

btnPantallaCompleta.addEventListener('click', pantallaCompleta);

btnAlerta.addEventListener('click', () => { modalAlerta.classList.add("cerrado"); })

window.addEventListener('load', () => {
    canvas.width = document.body.clientWidth;
    canvas.height = window.innerHeight;

    inputNombre.focus();
    loop();
})

window.addEventListener('resize', () => {
    canvas.width = document.body.clientWidth;
    canvas.height = window.innerHeight;
})

//! EVENTOS SOCKET.IO
socket.on("dataCuadrado", data => actualizarCuadrado(data));

socket.on("victoria", ({mensaje}) => reiniciarJuego(mensaje));