const express = require('express');
const router = express.Router()
const article = require('../models/Article')

router.get('/', async function (req, res, next) {
    const id = req.query.id
    const posts = await article.findById(id)
    console.log(posts)
    const about = {
        title: posts.title,
        articleTitle: posts.title,
        articleBody: posts.body,
        templateName: 'public/article',
        devTest: 'dev_article',
        name: process.env.NAME
    };
    return res.render('base', about);
});

router.post('/', async function (req, res, next) {
    const newArticle = new article({
        title: req.body.title,
        body: req.body.body,
        userID: req.body.userID
    });
    console.log(newArticle)
    try{
        const saveArticle = await newArticle.save()
        console.log(saveArticle)
        res.json(saveArticle)
    }catch (err){
        res.json({message: err})
    }
})

module.exports = router