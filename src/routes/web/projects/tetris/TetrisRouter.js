const express = require('express');
const router = express.Router();
const getProjects = require('../../../../util/projects');

router.get('/', (req, res) => {
    const projects = getProjects();
    res.render('tetris', {
        layout: 'navbar',
        title: 'Tetris',
        projects,
    });
});

module.exports = router;