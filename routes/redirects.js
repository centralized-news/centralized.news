const express = require('express');
const router = express.Router()

router.get('/github', async function (req, res, next) {
    res.redirect('https://github.com/mr-winson/nodium')
});

router.get('/admin/articles', async function (req, res, next) {
    res.redirect('/admin')
});

module.exports = router