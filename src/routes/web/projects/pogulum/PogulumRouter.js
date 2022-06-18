const express = require('express');
const router = express.Router();
const getProjects = require('../../../../util/projects')

router.get('/', (req, res) => {
    const projects = getProjects();
    res.render('pogulum', {
        layout: 'main',
        title: 'Pogulum',
        projects,
    })
})

module.exports = router;