// require packages
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose')
require('dotenv').config()

// const configs
const port = process.env.PORT || 5555
const site_port = process.env.BASEURL + port

// app configs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(require('express-status-monitor')());
//app.use(require('connect-flash'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// import routes
const writersRoutes = require('./routes/writer')
app.use('/writers', writersRoutes)
const articleRoutes = require('./routes/article')
app.use('/article', articleRoutes)

//////////////////////////////////////////////////////////////////////
//
// general app links
//
//////////////////////////////////////////////////////////////////////
app.get('/', function (req, res, next) {
    console.log('/')
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

//////////////////////////////////////////////////////////////////////
//
// company link
//
//////////////////////////////////////////////////////////////////////
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

console.log(`running on port ${port} -- ${site_port}`)

// mongoose
mongoose.connect(
    process.env.DB_HOST,
    {   useNewUrlParser: true,
        useUnifiedTopology: true  },
    () => console.log('connected to DB')
)

// start a server
app.listen(port)