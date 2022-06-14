const express = require('express');
const router  = express.Router();
const getProjects = require('../../../../util/projects');

router.get('/', (req, res) => {
    const projects = getProjects();
    res.render('doodle', {
        layout: 'navbar',
        title: 'Doodle Jumper',
        projects,
    });
});

module.exports = router;