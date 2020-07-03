const express = require('express');
const router = express.Router()

router.get('/', function(req, res, next) {
    
})

router.get('/new', function (req, res, next) {
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

module.exports = router