const express = require('express');
const router = express.Router()

router.get('/', function (req, res, next) {
    //console.log('/')
    const about = {
        title: 'Home - ' + process.env.NAME,
        templateName: 'public/index',
        devTest: 'dev_index',
        name: process.env.NAME
    };
    return res.render('base', about);
});

router.get('/search', function (req, res, next) {
    const terms = req.query.q
    const about = {
        title: 'Search - ' + process.env.NAME,
        templateName: 'public/search',
        devTest: 'dev_search',
        name: process.env.NAME
    };
    return res.render('base', about);
});

router.get('/donate', function (req, res, next) {
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

router.get('/about', function (req, res, next) {
    const terms = req.query.q
    const about = {
        title: 'About - ' + process.env.NAME,
        templateName: 'public/about',
        devTest: 'dev_search',
        name: process.env.NAME
    };
    const logData = ({path: about.templateName})
    console.log(logData)
    return res.render('base', about);
});

module.exports = router