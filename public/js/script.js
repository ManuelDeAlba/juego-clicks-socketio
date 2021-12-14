const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const modalNombre = document.getElementById("modalNombre");
const formularioNombre = document.getElementById("formularioNombre");
const inputNombre = document.getElementById("inpNombre");
const btnPantallaCompleta = document.getElementById("btnPantallaCompleta");

const socket = io();

let cuadrado;
let nombre;

let puntos = 0;
let puntosVictoria = 20;

function dibujar(){
    ctx.font = "20px Arial";
    ctx.fillText(`Puntos: ${puntos}`, 10,30);

    if(cuadrado){
        let {x, y, tam, color} = cuadrado;

        // Razon para dibujar el cuadrado en toda la pantalla aunque la coordenada tenga un máximo de 500
        // Hacer proporcional el juego en todas las pantallas
        let razonX = canvas.width / 500;
        let razonY = canvas.height / 500;

        ctx.fillStyle = color;
        ctx.fillRect(x * razonX, y * razonY, tam, tam);
    }
}

function loop(){
    canvas.width = canvas.width;

    dibujar();

    requestAnimationFrame(loop);
}

function pantallaCompleta(){
    if(canvas.requestFullscreen) canvas.requestFullscreen();
    else alert("Tu navegador no soporta pantalla completa");
}

//! EVENTOS
canvas.addEventListener('click', e => {
    // Convertir las coordenadas reales a un máximo de 500 para hacer el juego responsive
    let x = ((e.clientX - canvas.getBoundingClientRect().left) / canvas.width) * 500;
    let y = ((e.clientY - canvas.getBoundingClientRect().top) / canvas.height) * 500;

    if(x < cuadrado.x + cuadrado.tam && x > cuadrado.x && y < cuadrado.y + cuadrado.tam && y > cuadrado.y){
        puntos++;

        socket.emit("click", {id: socket.id});
        
        if(puntos >= puntosVictoria){
            socket.emit("victoria", { mensaje: `Ganador: ${nombre}` })
        }
    }
})

formularioNombre.addEventListener('submit', (e) => {
    e.preventDefault();

    nombre = inputNombre.value;

    modalNombre.classList.add("cerrado");
})

btnPantallaCompleta.addEventListener('click', pantallaCompleta);

window.addEventListener('load', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    inputNombre.focus();
    loop();
})

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})

//! EVENTOS SOCKET.IO
socket.on("dataCuadrado", data => {
    cuadrado = data;
})

socket.on("victoria", ({mensaje}) => {
    alert(mensaje);

    puntos = 0;
})