const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('clothing', {
        layout: 'main',
        title: 'Clothing Store',
    })
})

module.exports = router;