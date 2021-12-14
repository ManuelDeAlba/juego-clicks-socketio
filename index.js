const express = require("express");
const app = express();

const socketIO = require("socket.io");

app.set("PORT", process.env.PORT || 3000);

app.use(express.static("public"));

const server = app.listen(app.get("PORT"), () => {
    console.log("Servidor en el puerto", app.get("PORT"));
})

const io = socketIO(server);

let tam = 20 + Math.random() * 30;
let cuadrado = {
    x: Math.random() * (500 - tam),
    y: Math.random() * (500 - tam),
    tam: tam,
    color: "red"
}

function reiniciarCuadrado(){
    cuadrado = {
        x: Math.random() * (500 - tam),
        y: Math.random() * (500 - tam),
        tam: tam,
        color: "red"
    }

    // Pasar el objeto cuadrado
    io.emit("dataCuadrado", cuadrado);
}

io.on("connection", socket => {
    console.log("Nueva conexión:", socket.id);

    // Pasar el objeto cuadrado
    io.emit("dataCuadrado", cuadrado);

    socket.on("click", ({id}) => {
        console.log(`Jugador ${id} dió el click`);
        reiniciarCuadrado();
    })
})