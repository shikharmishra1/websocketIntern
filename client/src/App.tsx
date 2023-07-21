import  { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { Joystick } from "react-joystick-component";

const WS_URL = "http://localhost:3000/ws";

function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const token ='';
  const [data, setData] = useState("");
  const [feedback, setFeedback] = useState("not connected yet");

  function connectSocket() {
    const newSocket = io(WS_URL, {
      query: {
        token,
      },
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      console.log("Connected to WebSocket API");
    });

    newSocket.on("ack", (data) => {
      setFeedback(data);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from WebSocket API");
    });

    setSocket(newSocket);
  }

  useEffect(() => {
    try {
      connectSocket();
    } catch (error) {
      console.error(error);
    }
  }, []);

  function handleMove(event: any) {
    const x = event.x;
    const y = event.y;
    const data = JSON.stringify({ x, y });
    setData(data);

    if (socket) {
      socket.emit("joystick", data);
    }
  }

  return (
    <div>
      <h1>React Joystick Component</h1>
      <div style={{ display: "flex" }}>
        <Joystick move={handleMove} />
      </div>
      <p>Data: {data}</p>
      <p>Feedback: {feedback}</p>
    </div>
  );
}

export default App;
