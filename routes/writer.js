const express = require('express');
const router = express.Router()
const Users = require('../models/User')
const article = require('../models/Article')

router.get('/', function(req, res, next) {
    res.redirect('/')
})

router.get('/new', function (req, res, next) {
    if (!req.user) {
        return res.redirect('/')
    }
    console.log(req.user)
    if(req.user.writer === false) {
        return res.redirect('/')
    }
    const title = req.query.title
    const body = req.query.body

    const about = {
        title: 'Donate - ' + process.env.NAME,
        templateName: 'writers/editor',
        writerID: req.user._id,
        devTest: 'dev_search',
        name: process.env.NAME,
        body: body,
        title: title,
    };
    return res.render('base', about);
});

router.get('/edit/:id', async function (req, res, next) {
    if (!req.user) {
        return res.redirect('/')
    }
    console.log(req.user)
    if(req.user.writer === false) {
        return res.redirect('/')
    }

    const articleId = req.params.id
    const articleJSON = await article.findById(articleId)

    if (req.user._id != articleJSON.userID) { return res.redirect('/') }

    const about = {
        title: 'Donate - ' + process.env.NAME,
        templateName: 'writers/edit',
        articleID: articleId,
        writerIDConfirm: articleJSON.userID,
        writerID: req.user._id,
        devTest: 'dev_search',
        name: process.env.NAME,
        body: articleJSON.body,
        articleTitle: articleJSON.title,
        image: articleJSON.image,
        tags: articleJSON.tags
    };
    return res.render('base', about);
});

module.exports = router