"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import required modules
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Create an Express app
const app = (0, express_1.default)();
// Enable CORS
app.use((0, cors_1.default)({ origin: "*" }));
// Create an HTTP server
const server = http_1.default.createServer(app);
// Create a Socket.IO server
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
    }
});
// Define constants
const PORT = process.env.PORT || 3000;
const SECRET = process.env.SECRET || "secret";
// Define middleware function to verify JWT tokens
const verifyToken = (socket, next) => {
    // Get the token from the query parameter
    const token = socket.handshake.query.token;
    // Check if the token is defined and is a string
    if (typeof token === 'string') {
        // Verify the token using jwt module
        jsonwebtoken_1.default.verify(token, SECRET, (err, decoded) => {
            // If there is an error, disconnect the socket
            if (err) {
                socket.disconnect();
            }
            else {
                // If there is no error, attach the decoded payload to the socket object
                socket.user = decoded;
                // Call next function to proceed
                next();
            }
        });
    }
    else {
        // Handle the case when the token is undefined or not a string
        socket.disconnect();
    }
};
// Define event listener for connection event on /ws endpoint
io.of("/ws").on("connection", (socket) => {
    // Log connection details
    console.log(`A user connected to /ws with id ${socket.id}`);
    // Define event listener for joystick event on /ws/joystick endpoint
    socket.on("joystick", (data) => {
        // Log data details
        console.log(`Received joystick data from ${socket.id}: ${data}`);
        // Process data as needed
        // For example, save data to a database, or broadcast data to other sockets
        // Emit an acknowledgement to the sender
        socket.emit("ack", "Data received");
    });
    // Define event listener for disconnect event
    socket.on("disconnect", () => {
        // Log disconnection details
        console.log(`A user disconnected from /ws with id ${socket.id}`);
    });
});
// Start the server
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
