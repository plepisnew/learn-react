const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env')});

class App {

    constructor(options) {

        this.failurePrefix = options.failurePrefix || process.env.FAILURE_PREFIX;
        this.successPrefix = options.successPrefix || process.env.SUCCESS_PREFIX;
        this.port = options.port || process.env.VITE_PORT;
        this.dbUri = options.dbUri || process.env.MONGODB_URI;
        this.routesDir = 'routes';

        this.serverLogStream = fs.createWriteStream(path.join(__dirname, 'log', 'server.log'), { flags: 'a' });
        this.requestLogStream = fs.createWriteStream(path.join(__dirname, 'log', 'request.log'), { flags: 'a' });
        this.mongoose = require('mongoose');
        this.express = require('express');
        this.cors = require('cors');
        this.app = this.express();
        // this.exphbs = require('express-handlebars');
    }

    start() {
        this.setupMiddleware();
        this.setupRoutes(path.join(__dirname, this.routesDir));
        this.connectDatabase();
        this.startServer();
    }

    console(type, content) {
        let loggable = `${type.toUpperCase() === 'SUCCESS' ? this.successPrefix : this.failurePrefix} ${content}`;
        console.log(loggable);
        this.log(this.serverLogStream, loggable);
    }

    setupMiddleware() {
        this.app.use(this.express.json());
        this.app.set('json spaces', 2);
        this.app.use(this.cors({
            origin: ['https://plepis.me', 'http://localhost:3000'],
        }));
        this.app.use(this.express.static(path.join(__dirname, '..', 'frontend', 'dist')))
        this.app.use((req, res, next) => {
            this.log(this.requestLogStream, `${req.method} ${req.protocol}://${req.baseUrl}${req.hostname}${req.url}`);
            next();
        })

        // Load React Router on every request (for accessing react router routes)
        // this.app.get('*', (req, res) => {
        //     res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
        // })

        // Redirection to HTTPS
        if(process.env.NODE_ENV === 'production') {
            this.app.use((req, res, next) => {
                if (req.header('x-forwarded-proto') !== 'https') {
                    res.redirect(`https://${req.header('host')}${req.url}`)
                } else {
                    next();
                }
            });
        }

        // Handlebars setup
        // this.app.engine('handlebars', this.exphbs.engine({ defaultLayout: 'main' }));
        // this.app.set('view engine', 'handlebars');

    }

    setupRoutes(url) {
        fs.readdirSync(url, { withFileTypes: true }).forEach(item => {
            if(item.isDirectory()) {
                this.setupRoutes(path.join(url, item.name));
            } else {
                let itemUrl = path.join(url, item.name);

                if(!item.name.endsWith('.js')) return this.console('error', `Non-JS file found in route folder: ${itemUrl}`);

                let prefixCut = itemUrl.split('routes')[1]; // \dir\js_file.js
                let resource = prefixCut.split(`${path.sep}${item.name}`)[0]; // \dir
                let routerPath = path.join('.', this.routesDir, prefixCut); // routes\dir\js_file.js
                const router = require(`.${path.sep}${routerPath}`); // .\routes\dir\js_file.js
                try {
                    this.app.use(resource.replaceAll(path.sep, '/'), router); // /dir
                    this.console('success', `Attached Router ${item.name} to Resource ${resource}`);
                } catch(err) {
                    this.console('error', `Module ${itemUrl} does not export a Router instance`);
                }
                
            }
        })
    }

    connectDatabase() {
        this.mongoose.connect(this.dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => this.console('success', `Successfully connected to Database`))
            .catch(e => this.console('failure', e.message));
    }

    startServer() {
        this.app.listen(this.port, () => this.console('success', `Server started on port ${this.port}`));
    }

    log(stream, content) {
        stream.write(`${new Date().toISOString()} ${content}\n`);
    }
}

new App({
    failurePrefix: '[ :< ]',
    successPrefix: '[ :> ]',
    port: process.env.PORT,
    dbUri: process.env.MONGODB_URI,
}).start();