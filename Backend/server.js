require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const connection = require('./config/db');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

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
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

// Track connected users and their names
let connectedUsers = 0;
const userNames = {}; // { socket.id: username }

io.on('connection', (socket) => {
    connectedUsers++;
    // Set default username to 'user
    console.log('User connected:', socket.id, 'Total:', connectedUsers);

    // Broadcast the updated user list (with default name)
    io.emit('user-list', Object.values(userNames));
    io.emit('online-users-data', {
        users: Object.values(userNames),
        count: Object.values(userNames).length
    });
    io.emit('online-users', Object.values(userNames));

    // Listen for the user-joined event
    socket.on('user-joined', (username) => {
        userNames[socket.id] = username;
        io.emit('online-users', Object.values(userNames));
    });
    socket.on("login", (email) => {
        loggedInUsers.add(email);
        socket.email = email;
    })



    // Listen for the client to send their username
    socket.on('join', (username) => {
        userNames[socket.id] = username;
        console.log(`User ${username} joined with socket ID ${socket.id}`);
        // Broadcast the updated user list
        io.emit('user-list', Object.values(userNames));
    });

    socket.on('send-message', (msg) => {
        if (msg.recipient === 'All') {
            io.emit('receive-message', msg); // Group chat
        } else {
            // Private chat: send to recipient and sender only

            // Helper: find socket.id by username
            const getSocketIdByUsername = (username) => {
                return Object.keys(userNames).find(
                    (id) => userNames[id] === username
                );
            };

            const recipientSocketId = getSocketIdByUsername(msg.recipient);
            const senderSocketId = getSocketIdByUsername(msg.sender);

            if (recipientSocketId) {
                io.to(recipientSocketId).emit('receive-message', msg);
            }
            if (senderSocketId && senderSocketId !== recipientSocketId) {
                io.to(senderSocketId).emit('receive-message', msg);
            }
        }
    });

    socket.on('disconnect', () => {
        connectedUsers = Math.max(connectedUsers - 1, 0);
        const username = userNames[socket.id];
        console.log('User disconnected:', socket.id, 'Username:', username, 'Total:', connectedUsers);
        delete userNames[socket.id];
        // Broadcast the updated user list
        io.emit('user-list', Object.values(userNames));
    });
});

// Endpoint to get the number of connected users
app.get('/connected-users', (req, res) => {
    res.json({ connectedUsers });
});

// Endpoint to get the names of connected users
app.get('/connected-usernames', (req, res) => {
    res.json({ usernames: Object.values(userNames) });
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const authRoutes = require('./Routes/auth.routes');
app.use('/auth', authRoutes);

server.listen(4000, () => {
    console.log('Server is running on port 4000');
});
