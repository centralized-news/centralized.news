const express = require('express');
const router = express.Router()
var ar = require('array-randomizer');
const Videos = require('../models/Video')
const db = require('quick.db');
const live = new db.table('urls');

router.get('/', async function (req, res, next) {
    const postArray = await Videos.find()
    const posts = ar.randomizeArray(postArray);

    const liveStatus = live.get('live')

    console.log(live.get('live'))
    // console.log(postArray)
    const amountOfPosts = Object.keys(postArray).length;

    console.log(posts + ' yay')
    console.log(amountOfPosts, 'video posts')
    const about = {
        posts: posts,
        title: 'Videos - ' + process.env.NAME,
        templateName: 'producers/index',
        devTest: 'dev_videos_index',
        name: process.env.NAME,
        live: liveStatus,
        channelName: process.env.TWITCH_USERNAME
    };
    return res.render('base', about);
    
});

router.post('/delete', async function (req, res, next) {
    Videos.findByIdAndRemove(req.body.videoId, (err) => {
        if (err) return res.status(500)
        return res.redirect('/admin/videos')
    });
})

module.exports = router