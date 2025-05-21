```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true // Name is required
    },
    email: {
        type: String,
        required: true, // Email is required
        unique: true // Email must be unique
    },
    password: {
        type: String,
        required: true // Password is required
    },
}, { timestamps: true }); // Enable timestamps for createdAt and updatedAt

// Create and export the User model
module.exports = mongoose.model('User', userSchema);
```