const express = require('express');
const exphbs = require('express-handlebars')
const mongoose = require('mongoose');

const path = require('path');
const fs = require('fs');
const morgan = require('morgan');
const { logger, logFile, getRouters } = require('./util/util');
require('dotenv').config();

const MONGODB_URI = process.env.ATLAS_URI || process.env.DEV_ATLAS_URI;
const PORT = process.env.PORT || process.env.DEVPORT;
const app = express();

app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.set('json spaces', 2);

// Middleware (JSON parse, static folder, logger)
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('combined', { stream: logFile }));
app.use(cors({
  origin: "https://plepis.me",
}))

app.use('/build/', express.static(path.join(__dirname, 'node_modules/three/build')));
app.use('/jsm/', express.static(path.join(__dirname, 'node_modules/three/examples/jsm')));

// Middleware for redirecting to https
if(process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https')
      res.redirect(`https://${req.header('host')}${req.url}`)
    else
      next()
  })
}

// Setup Routes
getRouters(app, path.join(__dirname, 'routes'));

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }).
    then(() => console.log(`[INFO] Successfully connected to MongoDB Database`));

// Server initialization
app.listen(PORT, () => {
    console.log(`[INFO] Server running on port ${PORT}`);
})