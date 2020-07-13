const express = require('express');
const router = express.Router()
const Users = require('../models/User')
const article = require('../models/Article');
var ar = require('array-randomizer');
const { post } = require('./user');

router.get('/', async function (req, res, next) {
    const postArray = await article.find().sort('-date')
    const organArray = await article.find().sort('-date')
    const posts = ar.randomizeArray(postArray);
    const type = req.query.type

    // console.log(postArray)
    const amountOfPosts = Object.keys(postArray).length;



    if (type == 'random') {
        const about = {
            type: 'Random Articles',
            posts: posts,
            title: 'Home - ' + process.env.NAME,
            templateName: 'public/index',
            devTest: 'dev_index',
            name: process.env.NAME
        };
        return res.render('base', about);
     }
    const about = {
        type: 'Recent Articles',
        posts: organArray,
        amount: amountOfPosts,
        title: 'Home - ' + process.env.NAME,
        templateName: 'public/index',
        devTest: 'dev_index',
        name: process.env.NAME
    };
    return res.render('base', about);
});

router.get('/search', async function (req, res, next) {
    /*const terms = req.query.q
    console.log(terms)
    const posts = await article.find({ $text : { $search : terms } })
    console.log(posts)
    const postOneTitle = posts[0].title
    const postOneTags = posts[0].tags
    const postOneId = posts[0]._id
    const postOneImage = posts[0].image
    const postOneUserId = posts[0].userID
    const postOneUserDatePre = posts[0].date
    const postOneDate = postOneUserDatePre.toDateString().split("T")[0]
    const postOneUser = await Users.findById(postOneUserId);
    const postOneUserName = postOneUser.name;
    const about = {
        postOneTitle: postOneTitle,
        postOneId: postOneId,
        postOneImage: postOneImage,
        postOneUserId: postOneUserId,
        postOneDate: postOneDate,
        postOneUserName: postOneUserName,
        postOneTags: postOneTags,*/
    const terms = req.query.q
    if (!terms) {
        const about = {
            title: 'Search - ' + process.env.NAME,
            templateName: 'public/searchBar',
            devTest: 'dev_search',
            name: process.env.NAME
        };
        return res.render('base', about);
    }
    const posts = await article.find({ $text : { $search : terms } })
    console.log(posts)
    const about = {
        posts: posts,
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
        devTest: 'dev_about',
        description: process.env.DESC,
        name: process.env.NAME
    };
    const logData = ({path: about.templateName})
    console.log(logData)
    return res.render('base', about);
});

router.get('/privacy', function (req, res, next) {
    const terms = req.query.q
    const about = {
        title: 'Privacy - ' + process.env.NAME,
        templateName: 'public/privacy',
        devTest: 'dev_search',
        name: process.env.NAME,
        domain: process.env.BASEURL
    };
    const logData = ({path: about.templateName})
    console.log(logData)
    return res.render('base', about);
});

router.get('/terms', function (req, res, next) {
    const terms = req.query.q
    const about = {
        title: 'Terms - ' + process.env.NAME,
        templateName: 'public/terms',
        devTest: 'dev_search',
        name: process.env.NAME,
        domain: process.env.BASEURL
    };
    const logData = ({path: about.templateName})
    console.log(logData)
    return res.render('base', about);
});

router.get('/jobs', function (req, res, next) {
    const about = {
        title: 'Jobs - ' + process.env.NAME,
        templateName: 'public/jobs',
        devTest: 'dev_developers',
        name: process.env.NAME,
    };
    return res.render('base', about);
});

router.get('/apply', function (req, res, next) {
    const about = {
	formUrl: process.env.APPLY_FORM_URL,
        title: 'Apply - ' + process.env.NAME,
        templateName: 'public/apply',
        devTest: 'dev_developers',
        name: process.env.NAME,
    };
    return res.render('base', about);
});

router.get('/contact', function (req, res, next) {
    const about = {
        title: 'Contact - ' + process.env.NAME,
        templateName: 'public/contact',
        devTest: 'dev_developers',
        name: process.env.NAME,
        phone: process.env.PHONE,
        email: process.env.EMAIL
    };
    return res.render('base', about);
});

router.get('/topic', function (req, res, next) {
    const about = {
        title: 'Topics - ' + process.env.NAME,
        templateName: 'public/topics',
        devTest: 'dev_topics',
        name: process.env.NAME,
        phone: process.env.PHONE,
        email: process.env.EMAIL,
    };
    return res.render('base', about);
})

router.get('/topic/:topic', async function (req, res, next) {
    const topic = req.params.topic
    const posts = await article.find({ $text : { $search : topic } })
    const about = {
        title: topic + ' - ' + process.env.NAME,
        templateName: 'public/topic',
        devTest: 'dev_topic_specific',
        name: process.env.NAME,
        phone: process.env.PHONE,
        email: process.env.EMAIL,
        posts: posts,
        topic: topic
    };
    return res.render('base', about);
});

module.exports = router