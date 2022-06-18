const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    user: {
        type: String,
        required: true,
    },
}, { timestamps: true })

module.exports = mongoose.model('Message', messageSchema);