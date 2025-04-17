const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const connection = require('./config/db');
const { Server } = require("socket.io");

const app = express(); // ✅ First: create express app
const server = http.createServer(app); // ✅ Then: pass it to http.createServer

const corsOptions = {
    origin: '*',
    credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));

// Initialize socket.io
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Your frontend URL
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Listen for messages from the client
    socket.on('send-message', (data) => {
        console.log('Message received:', data);
        // Broadcast the message to all connected clients
        io.emit('receive-message', data); // this broadcasts the message to everyone
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});


app.get('/', (req, res) => {
    res.send('Hello World!');
});

const authRoutes = require('./Routes/auth.routes');
app.use('/auth', authRoutes);

// ✅ Start the HTTP server — NOT app.listen!
server.listen(4000, () => {
    console.log('Server is running on port 4000');
});
