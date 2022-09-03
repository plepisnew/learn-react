const express = require('express');
const router = express.Router();
const {
    getAllMessages,
    createMessage
} = require('../../../controllers/MessageController');

router.get('/', getAllMessages);

router.post('/', createMessage);

module.exports = router;