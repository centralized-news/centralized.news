const express = require('express');
const router = express.Router()
const article = require('../models/Article')
const Users = require('../models/User');

router.get('/', function (req, res, next) {
    const about = {
        title: 'Developers - ' + process.env.NAME,
        templateName: 'developers/index',
        devTest: 'dev_developers',
        name: process.env.NAME,
    };
    return res.redirect('https://developers.centralizednews.org');
});

module.exports = router