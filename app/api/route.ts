import { Server } from "socket.io";
import { createServer } from "http";
import { NextResponse } from 'next/server';


const mensajes = ["Bienvenido a Tiger-ChatApp - recuerda que el eslogan de esta app es tu privacidad primero..."] || null;
const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Usuario conectado: " + socket.id);

  socket.on("mensaje", (mensaje) => {
    mensajes.push(mensaje);
    io.emit("mensaje", mensaje); // Envía el mensaje a todos los clientes conectados
  });

  socket.on("disconnect", () => {
    console.log("Usuario desconectado: " + socket.id);
  });
});

httpServer.listen(4000, () => {
  console.log("Servidor de WebSocket en el puerto 4000");
});

export async function GET(request: Request) {
  return NextResponse.json(mensajes);
}

export async function POST(request: Request) {
  const mensaje = await request.json();

  mensajes.push(mensaje);

  // Envía el mensaje a todos los clientes conectados a través de WebSocket
  io.emit("mensaje", mensaje);

  return NextResponse.json(mensajes);
}
