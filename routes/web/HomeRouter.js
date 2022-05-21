const express = require('express');
const router = express.Router();
const getProjects = require('../../util/projects');

router.get('/', (req, res) => {
    const projects = getProjects();
    res.render('home', {
        layout: 'navbar',
        title: 'Home',
        projects,
        environment: JSON.stringify(process.env),
    });
});

module.exports = router;