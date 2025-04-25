const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
    sender: { type: String, required: true },
    recipient: { type: String, required: true },
    message: { type: String, required: true },
    time: { type: Date, default: Date.now },
    delivered: { type: Boolean, default: false }
});
module.exports = mongoose.model('Message', messageSchema);