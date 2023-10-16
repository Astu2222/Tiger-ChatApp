'use client'
import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { Card, Input, Button } from "@nextui-org/react";

const socket = io("http://localhost:4000");

export default function Home() {
  const [mensaje, setMensaje] = useState("");
  const [datos, setDatos] = useState([]);
  const mensajesContainerRef = useRef(null); // Referencia al contenedor de mensajes

  useEffect(() => {
    socket.on("mensaje", (mensaje) => {
      setDatos((prevDatos) => [...prevDatos, mensaje]);
      
      // Asegúrate de que el último mensaje sea siempre visible
      if (mensajesContainerRef.current) {
        mensajesContainerRef.current.scrollTop = mensajesContainerRef.current.scrollHeight;
      }
    });

    fetch("http://localhost:3000/api")
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error en la solicitud");
        }
      })
      .then((data) => {
        setDatos(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    return () => {
      socket.off("mensaje");
    };
  }, []);

  const handleChange = (e) => {
    setMensaje(e.target.value);
  };

  const handleEnviar = () => {
    socket.emit("mensaje", mensaje);
    setMensaje("");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-white">
      <Card style={{ width: "90vw", height: "85vh", margin: "20px" }}>
        <div className="text-center" style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <img src="/logo.png" style={{ width: "250px" }}></img>
        </div>
        <div className="mensajes" style={{ maxHeight: "100vh", minHeight: "75vh", width: "100%", overflowY: "auto", backgroundColor: "#FFFFFF" }} >
          {datos.map((dato, index) => (
            <Card ref={mensajesContainerRef} style={{ margin: "15px 20px 10px 20px", padding: "10px", display: "block", justifyContent: "center", alignItems: "center", minHeight: "auto", WebkitBoxOrient: "vertical" }} key={index}>
              <p>{dato}</p>
            </Card>
          ))}
        </div>
      </Card>
      <div className="" style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "90vw" }}>
        <Input className="w-screen" size="lg" type="text" placeholder="Escribe el mensaje aquí..." value={mensaje} onChange={handleChange} />
        <Button onClick={handleEnviar} color="primary" style={{ margin: "10px" }}>Enviar</Button>
      </div>
    </main>
  );
}
