const path = require('path');
const fs = require('fs');

const base = process.env.NODE_ENV == 'production' ? process.env.HOST : `http://localhost:${process.env.DEVPORT}`;
const projects = base + '/projects';


// Returns all items that appear in the navigation bar (name, desc, logo, view, url)
const getProjects = () => {
    return [
            {
                name: 'Home',
                description: 'Home page of my personal website',
                logo: '/images/home.png',
                view: 'home.handlebars',
                url: base,
            },
            {
                name: 'Tetris1',
                description: 'Very poor version of Tetris',
                logo: '/images/tetris1.png',
                view: 'tetris1.handlebars',
                url: projects + '/tetris1',
            },
            {
                name: 'Tetris',
                description: 'Improved version of Tetris',
                logo: '/images/tetris.png',
                view: 'tetris.handlebars',
                url: projects + '/tetris'
            },
            {
                name: 'Collision',
                description: 'Simple ellastic collision simulator',
                logo: '/images/collision.png',
                view: 'collision.handlebars',
                url: projects + '/collision',
            },
            {
                name: 'Pogulum',
                description: 'Twitch Clip Scraper: Accenture Project',
                logo: '/images/pogulum.png',
                view: 'pogulum.handlebars',
                url: projects + '/pogulum',
            },
            {
                name: 'Rubiks Cube Solver',
                description: 'Rubiks Cube simulator and automatic solver',
                logo: '/images/rubiks.png',
                view: 'rubiks.handlebars',
                url: projects + '/rubiks',
            },
            {
                name: 'Clothing Store',
                description: 'Clothing Store demo for my sister :>',
                logo: '/images/clothing.png',
                url: projects + '/clothing',
            },
            {
                name: 'Doodle Jumper',
                description: 'Doodle Jump replica',
                logo: '/images/doodle.png',
                url: projects + '/doodle',
            }
        ]
    
}

module.exports = getProjects;