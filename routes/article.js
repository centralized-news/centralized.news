const express = require('express');
const router = express.Router()
const article = require('../models/Article')
const Users = require('../models/User');

router.get('/', async function (req, res, next) {
    // get article id from url
    const id = req.query.id
    if (!id) {
        return res.redirect('/search');
    }
    const posts = await article.findById(id)
    const articleID = posts._id
    // find author name
    const user = await Users.findById(posts.userID);
    const name = user.name;

    // format publish date to a readable string
    const dateM = await article.findById(articleID);
    const date = dateM.date.toDateString().split("T")[0];

    // console log data for dev testing
    // console.log(posts)
    // console.log(name)
    if (!req.user) { 
        const currentuser = '000' 
        const about = {
            title: posts.title,
            articleTitle: posts.title,
            articleBody: posts.body,
            articleImg: posts.image,
            articleDate: date,
            currentUser: currentuser,
            writerID: posts.userID,
            articleID: articleID,
            writerName: name,
            templateName: 'public/article',
            devTest: 'dev_article',
            name: process.env.NAME
        };
        return res.render('base', about);   
        
    } else { 
        const currentuser = req.user._id
        const about = {
            title: posts.title,
            articleTitle: posts.title,
            articleBody: posts.body,
            articleImg: posts.image,
            articleDate: date,
            currentUser: currentuser,
            writerID: posts.userID,
            articleID: articleID,
            writerName: name,
            templateName: 'public/article',
            devTest: 'dev_article',
            name: process.env.NAME
        };
        return res.render('base', about);
    }
});

// save articles from a POST request to /article
router.post('/', async function (req, res, next) {
    const user = await Users.findById(req.user._id);
    const name = user.name;
    const userid = req.user._id
    const newArticle = new article({
        title: req.body.title,
        body: req.body.body,
        image: req.body.image,
        userID: userid,
        tags: req.body.tags,
        authorName: name
    });
    console.log(req.user._id)
    console.log(newArticle)
    try{
        const saveArticle = await newArticle.save()
        console.log(saveArticle)
        res.json(saveArticle)
    }catch (err){
        res.json({message: err})
    }
})

// save articles from a POST request to /article
router.post('/edit', async function (req, res, next) {
    const userID = await article.findById(req.body.artcleId)

    if (userID.userID != req.user._id) { return res.redirect('/') }
    await article.findByIdAndUpdate(req.body.artcleId, { title: req.body.title, body: req.body.body, image: req.body.image, tags: req.body.tags })
    res.redirect(`/article?id=${req.body.artcleId}`)
})

router.post('/delete', async function (req, res, next) {
    if (!req.user) {return res.redirect('/')}
    if (req.user.admin = false) {return res.redirect('/')}

    article.findByIdAndRemove(req.body.articleId, (err) => {
        if (err) return res.status(500)
        return res.status(200)
    });
})

router.get('/delete/:articlePostID', async function (req, res, next) {
    const articlePost = await article.findById(req.params.articlePostID)
    console.log(articlePost)
    if (!req.user) {return res.redirect('/article?id=' + req.params.articlePostID)}
    if (req.user._id != articlePost.userID) {return res.redirect('/article?id=' + req.params.articlePostID)}
    article.findByIdAndRemove(req.params.articlePostID, (err) => {
        if (err) return res.status(500)
        return res.redirect('/')
    });
})

module.exports = router