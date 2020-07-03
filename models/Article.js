const mongoose = require('mongoose')

const articleSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    userID: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('article', articleSchema)