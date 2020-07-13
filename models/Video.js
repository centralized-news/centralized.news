const mongoose = require('mongoose')

const videoSchema = mongoose.Schema({
    title: {
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
    },
    videoId: {
        type: String,
        required: true
    }
})

videoSchema.index({ title: 'text', tags: 'text' });

module.exports = mongoose.model('Videos', videoSchema)