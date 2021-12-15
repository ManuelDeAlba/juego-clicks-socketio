const express = require("express");
const app = express();

const socketIO = require("socket.io");

app.set("PORT", process.env.PORT || 3000);

app.use(express.static("public"));

const server = app.listen(app.get("PORT"), () => {
    console.log("Servidor en el puerto", app.get("PORT"));
})

const io = socketIO(server);

let tam = 30 + Math.floor(Math.random() * 20);
let cuadrado = {
    x: Math.floor(Math.random() * (500 - tam)),
    y: Math.floor(Math.random() * (500 - tam)),
    tam: tam,
    color: "red"
}

function reiniciarCuadrado(){
    tam = 30 + Math.floor(Math.random() * 20);
    cuadrado = {
        x: Math.floor(Math.random() * (500 - tam)),
        y: Math.floor(Math.random() * (500 - tam)),
        tam: tam,
        color: "red"
    }

    // Pasar el objeto cuadrado
    io.emit("dataCuadrado", cuadrado);
}

function reiniciarJuego(mensaje){
    // Mensaje de victoria
    io.emit("victoria", {mensaje});

    // Cambiar posición del cuadrado
    reiniciarCuadrado();
}

io.on("connection", socket => {
    console.log("Nueva conexión:", socket.id);

    //! Al conectarse pasar el objeto cuadrado
    io.emit("dataCuadrado", cuadrado);

    //! Cuando un jugador le da click
    socket.on("click", ({id}) => {
        console.log(`Jugador ${id} dió el click`);
        reiniciarCuadrado();
    })

    //! Cuando un jugador avisa que ya ganó
    socket.on("victoria", ({ mensaje }) => {
        reiniciarJuego(mensaje);
    })
})