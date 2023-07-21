"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
const PORT = process.env.PORT || 3000;
const SECRET = process.env.SECRET || "secret";
io.of("/ws").on("connection", (socket) => {
    socket.emit('ack', `A user connected to /ws with id ${socket.id}`);
    socket.on("joystick", (data) => {
        const ackData = `Received joystick data from ${socket.id}: ${data}`;
        socket.emit("ack", ackData);
    });
    socket.on("disconnect", () => {
        socket.emit("ack", `A user disconnected from /ws with id ${socket.id}`);
    });
});
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
