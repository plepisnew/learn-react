const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('test3d', {
        layout: 'main',
        title: 'Testing THREE js',
    });
});

module.exports = router;