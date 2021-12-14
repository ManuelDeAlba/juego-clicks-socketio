const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const modalNombre = document.getElementById("modalNombre");
const formularioNombre = document.getElementById("formularioNombre");
const inputNombre = document.getElementById("inpNombre");

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
        ctx.fillStyle = color;
        ctx.fillRect(x, y, tam, tam);
    }
}

function loop(){
    canvas.width = canvas.width;

    dibujar();

    requestAnimationFrame(loop);
}

canvas.addEventListener('click', e => {
    let x = e.clientX - canvas.getBoundingClientRect().left;
    let y = e.clientY - canvas.getBoundingClientRect().top;

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

window.addEventListener('load', () => {
    inputNombre.focus();
    loop();
})

//! EVENTOS SOCKET.IO
socket.on("dataCuadrado", data => {
    cuadrado = data;
})

socket.on("victoria", ({mensaje}) => {
    alert(mensaje);

    puntos = 0;
})