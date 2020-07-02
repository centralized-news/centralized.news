// require packages
const express = require('express');
const app = express();
const path = require('path');
const flash = require('connect-flash');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

// const configs
const port = process.env.PORT || 5555
const site_port = process.env.BASEURL + port
// app configs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('express-status-monitor')());
app.use(flash());

// app routes
app.get('/', function (req, res, next) {
    const about = {
        title: 'Home - ' + process.env.NAME,
        templateName: 'public/index',
        devTest: 'dev_index',
        name: process.env.NAME
    };
    return res.render('base', about);
});

app.get('/search', function (req, res, next) {
    const terms = req.query.q
    const about = {
        title: 'Search - ' + process.env.NAME,
        templateName: 'public/search',
        devTest: 'dev_search',
        name: process.env.NAME
    };
    return res.render('base', about);
});

app.get('/donate', function (req, res, next) {
    const terms = req.query.q
    const about = {
        title: 'Donate - ' + process.env.NAME,
        templateName: 'public/donate',
        devTest: 'dev_search',
        name: process.env.NAME
    };
    const logData = ({path: about.templateName})
    console.log(logData)
    return res.render('base', about);
});

app.get('/writers/new', function (req, res, next) {
    const title = req.query.title
    const body = req.query.body

    const about = {
        title: 'Donate - ' + process.env.NAME,
        templateName: 'writers/editor',
        devTest: 'dev_search',
        name: process.env.NAME,
        body: body,
        title: title
    };
    return res.render('base', about);
});

app.get('/writers/publish', function (req, res, next) {
    const title = req.query.title
    const body = req.query.body
    const about = {
        title: 'Donate - ' + process.env.NAME,
        templateName: 'writers/publisher',
        devTest: 'dev_search',
        name: process.env.NAME
    };
    return res.render('base', about);
});

console.log(`running on port ${port} -- ${site_port}`)

// mongodb
const mongoUrl = "mongodb://localhost:27017/centralized-news-dev-1";

MongoClient.connect(mongoUrl, function(err, db) {
    console.log("Database created!");
    //db.close();
});

// start a server
app.listen(port)