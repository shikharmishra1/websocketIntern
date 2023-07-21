import express from "express";
import http from "http";
import {Server, Socket} from "socket.io";
import cors from "cors";
import jwt from "jsonwebtoken";

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

const server = http.createServer(app);

const io =  new Server(server);

const PORT = process.env.PORT || 3000;
const SECRET = process.env.SECRET || "secret";

interface CustomSocket extends Socket {
  user?: any;
}


io.of("/ws").on("connection", (socket: CustomSocket) => {
  socket.emit('ack', `A user connected to /ws with id ${socket.id}`);

  socket.on("joystick", (data: string) => {
    const ackData =`Received joystick data from ${socket.id}: ${data}`;
    socket.emit("ack", ackData);
  });

  socket.on("disconnect", () => {
    socket.emit("ack", `A user disconnected from /ws with id ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
