const express = require('express');
const router = express.Router();
const Users = require('../models/User');
const article = require('../models/Article');
const Videos = require('../models/Video');
const db = require('quick.db');
const live = new db.table('urls');

router.get('/', async function (req, res, next) {
    if (!req.user) {
        return res.redirect('/')
    }
    console.log(req.user)
    if(req.user.admin === false) {
        return res.redirect('/')
    }
    const posts = await article.find()

    const about = {
        title: 'Admin - ' + process.env.NAME,
        templateName: 'admin/index',
        devTest: 'dev_admin',
        name: process.env.NAME,
        posts: posts
    };
    return res.render('base', about);
});

router.get('/users', async function (req, res, next) {
    if (!req.user) {
        return res.redirect('/')
    }
    console.log(req.user)
    if(req.user.admin === false) {
        return res.redirect('/')
    }
    const users = await Users.find()

    console.log(users)

    const about = {
        title: 'Admin - ' + process.env.NAME,
        templateName: 'admin/perms',
        devTest: 'dev_admin',
        name: process.env.NAME,
        users: users
    };
    return res.render('base', about);
});

router.get('/videos', async function (req, res, next) {
    if (!req.user) {
        return res.redirect('/')
    }
    console.log(req.user)
    if(req.user.admin === false) {
        return res.redirect('/')
    }
    const videos = await Videos.find()

    console.log(videos)

    const about = {
        title: 'Admin - ' + process.env.NAME,
        templateName: 'admin/videos',
        devTest: 'dev_admin',
        name: process.env.NAME,
        videos: videos
    };
    return res.render('base', about);
});

router.get('/live', async function (req, res, next) {
    if (!req.user) {
        return res.redirect('/')
    }
    console.log(req.user)
    if(req.user.admin === false) {
        return res.redirect('/')
    }
    const videos = await Videos.find()

    console.log(videos)
    
    const liveStatus = live.get('live')

    if (liveStatus === true) {
        const liveStatusEjs = 'true'

        const about = {
            title: 'Admin - ' + process.env.NAME,
            templateName: 'admin/live',
            devTest: 'dev_admin',
            name: process.env.NAME,
            live: liveStatusEjs,
            channelName: process.env.TWITCH_USERNAME
        };
        return res.render('base', about);
    } else {
        const liveStatusEjs = 'false'

        const about = {
            title: 'Admin - ' + process.env.NAME,
            templateName: 'admin/live',
            devTest: 'dev_admin',
            name: process.env.NAME,
            live: liveStatusEjs,
            channelName: process.env.TWITCH_USERNAME
        };
        return res.render('base', about);
    }
});

router.post('/live/true', async function (req, res, next) {
    live.set('live', false)
    res.redirect('/admin/live')
})

router.post('/live/false', async function (req, res, next) {
    live.set('live', true)
    res.redirect('/admin/live')
})

module.exports = router