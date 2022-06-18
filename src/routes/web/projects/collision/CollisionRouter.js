const express = require('express');
const router = express.Router();
const getProjects = require('../../../../util/projects');

router.get('/', (req, res) => {
    const projects = getProjects();
    res.render('collision', {
        layout: 'navbar',
        title: 'Collisions',
        projects,
    })
})

module.exports = router;