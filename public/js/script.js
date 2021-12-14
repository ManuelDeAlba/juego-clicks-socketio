const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const socket = io();

let cuadrado;
let puntos = 0;

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

window.addEventListener('load', () => {
    loop();
})

canvas.addEventListener('click', e => {
    let x = e.clientX - canvas.getBoundingClientRect().left;
    let y = e.clientY - canvas.getBoundingClientRect().top;

    if(x < cuadrado.x + cuadrado.tam && x > cuadrado.x && y < cuadrado.y + cuadrado.tam && y > cuadrado.y){
        puntos++;

        socket.emit("click", {id: socket.id});
    }
})

socket.on("dataCuadrado", data => {
    cuadrado = data;
})