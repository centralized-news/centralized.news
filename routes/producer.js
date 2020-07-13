const express = require('express');
const router = express.Router()
const Users = require('../models/User')
const Videos = require('../models/Video')

router.get('/', function(req, res, next) {
    res.redirect('/')
})

router.get('/new', function (req, res, next) {
    if (!req.user) {
        return res.redirect('/')
    }
    console.log(req.user)
    if(req.user.producer === false) {
        return res.redirect('/')
    }
    const title = req.query.title
    const body = req.query.body

    const about = {
        title: 'Video Publisher - ' + process.env.NAME,
        templateName: 'producers/editor',
        producerID: req.user._id,
        devTest: 'dev_video_producer',
        name: process.env.NAME,
        body: body,
        title: title,
    };
    return res.render('base', about);
});

router.post('/', async function (req, res, next) {
    const user = await Users.findById(req.user._id);
    const name = user.name;
    const userid = req.user._id
    const newVideo = new Videos({
        title: req.body.title,
        userID: userid,
        tags: req.body.tags,
        authorName: name,
        videoId: req.body.videoId
    });
    console.log(req.user._id)
    console.log(newVideo)
    try{
        const saveVideo = await newVideo.save()
        console.log(saveVideo)
        res.json(saveVideo)
    }catch (err){
        res.json({message: err})
    }
})

module.exports = router