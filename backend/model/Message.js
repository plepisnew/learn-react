const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    content: { type: String, required: true },
    user: { type: String, required: true },
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
