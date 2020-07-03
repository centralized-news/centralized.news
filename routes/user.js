const express = require('express');
const router = express.Router()
const Users = require('../models/User')

router.get('/', async function (req, res, next) {
    try{
        const id = req.query.id
        const posts = await Users.find(id)
        const about = {
            title: posts[0].title,
            articleTitle: posts[0].title,
            articleBody: posts[0].body,
            templateName: 'public/article',
            devTest: 'dev_article',
            name: process.env.NAME
        };
        return res.render('base', about);
    }catch (err) {
        res.json(err)
    }
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