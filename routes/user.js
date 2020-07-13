const express = require('express');
const router = express.Router()
const Users = require('../models/User')
const article = require('../models/Article')

router.get('/', async function (req, res, next) {
    const id = req.query.id
    const user = await Users.findById(id)
    const posts = await article.find({ userID: `${id}` }).sort('-date')
    console.log(posts)
    console.log(user)
    const about = {
        title: user.name,
        posts: posts,
        userName: user.name,
        userAdmin: user.admin,
        userWriter: user.writer,
        templateName: 'public/user',
        devTest: 'dev_user',
        name: process.env.NAME 
   };
    return res.render('base', about);
});

router.post('/delete', async function (req, res, next) {
    Users.findByIdAndRemove(req.body.userId, (err) => {
        if (err) return res.status(500)
        return res.redirect('/admin/users')
    });
})

router.post('/writer/give', async function (req, res, next) {
    Users.findByIdAndUpdate(req.body.userId, {writer: true}, (err) => {
        if (err) return res.status(500)
        return res.redirect('/admin/users')
    });
})

router.post('/writer/revoke', async function (req, res, next) {
    Users.findByIdAndUpdate(req.body.userId, {writer: false}, (err) => {
        if (err) return res.status(500)
        return res.redirect('/admin/users')
    });
})

router.post('/producer/give', async function (req, res, next) {
    Users.findByIdAndUpdate(req.body.userId, {producer: true}, (err) => {
        if (err) return res.status(500)
        return res.redirect('/admin/users')
    });
})

router.post('/producer/revoke', async function (req, res, next) {
    Users.findByIdAndUpdate(req.body.userId, {producer: false}, (err) => {
        if (err) return res.status(500)
        return res.status(200)
    });
})

module.exports = router