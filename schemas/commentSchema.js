const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    },
    message: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500      // avoid extremely long comments
    },
    image: {
        type: String
    }
}, {timestamps: true})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment