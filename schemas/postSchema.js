const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true    // remove unnecessary spaces
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String
    }
}, {timestamps: true})

const Post =  mongoose.model('Post', postSchema)

module.exports = Post