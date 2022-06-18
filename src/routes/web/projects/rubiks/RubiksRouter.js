const express = require('express');
const router = express.Router();
const getProjects = require('../../../../util/projects');

router.get('/', (req, res) => {
    const projects = getProjects();
    res.render('rubiks', {
        layout: 'navbar',
        title: 'Rubiks Cube Solver',
        projects,
    })
});

module.exports = router;