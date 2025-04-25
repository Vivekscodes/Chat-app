const express = require("express");
const router = express.Router();
const User = require("../models/user.models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require('validator');
const dotenv = require('dotenv');
const Message = require("../models/Message.models");
const loggedInUsers = new Map();

router.post("/send-message", async (req, res) => {
    console.log("working fine");
    try {
        const { sender, recipient, message } = req.body;

        if (!sender || !recipient || !message) {
            return res.status(400).json({ error: "All fields are required" });
        }
        if (!loggedInUsers.has(recipient)) {
            // Store message for offline recipient
            await Message.create({ sender, recipient, message });
            return res.status(200).json({ message: "Recipient is offline. Message stored." });
        }
        res.status(200).json({ message: "Message sent successfully" });
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ error: "Server error while sending message" });
    }

});
// Check if recipient is online
// if (loggedInUsers.has(recipient)) {
//     // Send message to online recipient (e.g., using WebSocket or similar)

// User registration
router.post('/signup', async (req, res) => {
    // console.log("working fine")
    try {
        const { name, email, password } = req.body;
        // Do not log req.body or sensitive data

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User with this email already exists" });
        }


        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user (note: fixed 'user' to 'User')
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // Create JWT token
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET environment variable must be set');
        }
        const token = jwt.sign(
            { userId: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Server error during registration" });
    }
    // localStorage.setItem('token', token);
});
// Store logged-in emails
// User login/
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        // Find user
        const user = await User.findOne({ email });

        // Check user existence and password in one block
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        if (loggedInUsers.has(email)) {
            return res.status(400).json({ error: 'This account is already logged in' });
        }
        loggedInUsers.add(email);

        const offlineMessages = await Message.find({ recipient: email, delivered: false });
        await Message.updateMany({ recipient: email, delivered: false }, { delivered: true });
        // Create JWT token
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET environment variable must be set');
        }
        const timeoutId = setTimeout(() => {
            loggedInUsers.delete(email);
        }, 300); // 1 hour timeout
        loggedInUsers.set(email, timeoutId);
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            offlineMessages
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Server error during login" });
    }
});

module.exports = router;