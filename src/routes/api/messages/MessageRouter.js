const express = require('express');
const router = express.Router();
const Message = require('../../../model/Message');

router.get('/', async (req, res) => {
    const messages = await Message.find({});
    res.json(messages);
});

router.get('/:id', async (req, res) => {
    try{
        const message = await Message.findById(req.params.id);
        res.status(200).json(message == null ? [] : message);
    } catch(err) {
        res.status(400).json({ message: err.message});
    }
})

router.post('/', async (req, res) => {
    try{
        const message = await Message.create(req.body);
        res.status(200).json(message);
    } catch(err) {
        res.status(400).json({ message: err.message});
    }
});

// router.put('/:id', async (req, res) => {
//     try {
//         const message = await Message.findByIdAndUpdate(req.params.id, req.body);
//         res.status(200).json(message);
//     } catch (err) {
//         res.status(400).json()
//     }
// });

// router.put('/', (req, res) => {
//     res.status(400).json({ message: 'Cannot PUT /messages : Specify _id parameter in URL'});
// });

router.delete('/', (req, res) => {
    res.status(400).json({ message: 'Cannot DELETE /messages : Specify _id parameter in URL'});
})

router.delete('/:id', async (req, res) => {
    try {
        const message = await Message.findByIdAndDelete(req.params.id);
        res.status(204).json(message);
    } catch(err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
