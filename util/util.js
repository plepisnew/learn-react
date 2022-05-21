const moment = require('moment');
const fs = require('fs');
const path = require('path');

const infoPrefix = '[INFO]';
const errorPrefix = '[ERROR]';

// Logger for every request (print to console)
const logger = (req, res, next) => {
    console.log(`${req.protocol}://${req.hostname}${req.originalUrl} at ${moment().format()}`);
    next();
}

// Logger file stream
const logFile = fs.createWriteStream('./log/request.log', {
    flags: 'a'
})

// Attaches all routers in path 'base'
const getRouters = (app, base) => {
    fs.readdirSync(base, { withFileTypes: true }).forEach(file => {
    if(file.isDirectory()) {
        getRouters(app, path.join(base, file.name));
    } else {
        if(!file.name.endsWith('.js')) return;
        try{
            let resource =`${path.join(base.split('routes')[1])}`.replaceAll(path.sep, '/')
            if(resource.startsWith('/web')) resource = resource.split('/web')[1];
            const resourceRouter = require(path.join(base, file.name));
            app.use(resource, resourceRouter);
            console.log(`${infoPrefix} Attached Router ${file.name} to Resource ${resource == '' ? 'ROOT' : resource}`)
            
        }catch(err) {
            if(err instanceof TypeError) console.log(`${errorPrefix} Module ${path.join(base, file.name)} does not export a Router instance`) 
            else console.log(err);
        }
    }
})
}

module.exports = { logger, logFile, getRouters };