Here's the modified code based on the feedback:

```javascript
// Load environment variables
require('dotenv').config();

// Import required libraries
const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const connection = require('./config/db');
const { Server } = require("socket.io");

// Initialize Express and HTTP servers
const app = express();
const server = http.createServer(app);

// Configure CORS
const corsOptions = {
    origin: '*',
    credentials: true,
};

// Middleware
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
const loggedInUsers = new Set(); // Set to store unique email addresses of logged-in users

io.on('connection', (socket) => {
    connectedUsers++;
    // Set default username to 'user'
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

    socket.on('send-message', (messageData) => {
        const { msg, recipient } = messageData;

        if (recipient === 'All') {
            io.emit('receive-message', messageData); // Group chat
        } else {
            // Private chat: send to recipient and sender only

            // Helper: find socket.id by username
            const getSocketIdByUsername = (username) => {
                return Object.keys(userNames).find(
                    (id) => userNames[id] === username
                );
            };

            const recipientSocketId = getSocketIdByUsername(recipient);

            if (recipientSocketId) {
                io.to(recipientSocketId).emit('receive-message', messageData);
            }

            // Send the message to the sender only if the recipient is not the sender
            const senderSocketId = getSocketIdByUsername(messageData.sender);
            if (senderSocketId && senderSocketId !== recipientSocketId) {
                io.to(senderSocketId).emit('receive-message', messageData);
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

module.exports = server;
```