const Message = require('../model/Message');

const getAllMessages = async (req, res) => {
    if(req.query.user) {
        const userMessages = await Message.find({ user: req.query.user });
        return res.status(200).json(userMessages);
    }
    const messages = await Message.find();
    res.status(200).json(messages);
}

const createMessage = async (req, res) => {
    const message = req.body;
    try {
        const savedMessage = await Message.create(message);
        res.status(200).json(savedMessage);
    } catch(err) {
        res.status(400).json({
            message: err.message
        });
    }
}

module.exports = {
    getAllMessages,
    createMessage
}