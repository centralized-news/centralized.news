const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    admin: {
        type: Boolean,
        default: false
    },
    writer: {
        type: Boolean,
        default: false
    },
    producer: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Users', userSchema)