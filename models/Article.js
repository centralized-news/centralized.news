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
    image: {
        type: String,
        required: true
    },
    userID: {
        type: String,
        required: true
    },
    tags: {
        type: String,
        required: true
    },
    authorName: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

articleSchema.index({ title: 'text', tags: 'text', body: 'text' });

module.exports = mongoose.model('article', articleSchema)