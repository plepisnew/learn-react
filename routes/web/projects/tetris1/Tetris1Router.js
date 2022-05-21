const express = require('express');
const router = express.Router();
const getProjects = require('../../../../util/projects')

router.get('/', (req, res) => {
    const projects = getProjects();
    res.render('tetris1', {
        layout: 'navbar',
        title: 'Tetris1',
        projects,
    })
})

module.exports = router;