const express = require('express');
const router = express.Router();
const getProjects = require('../../../util/projects');

router.get('/', (req, res) => {
    const projects = getProjects();
    res.render('test', {
        layout: 'navbar',
        title: 'Test Page',
        projects,
    })
})

module.exports = router;