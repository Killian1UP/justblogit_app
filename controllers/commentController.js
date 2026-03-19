const mongoose = require("mongoose")
const commentRouter = require("../routers/commentRouter")
const Comment = require("../schemas/commentSchema")
const Post = require("../schemas/postSchema")


const createComment = async (req, res) => {
    const { message, image, postId } = req.body
    const user = req.user

    if (!message || !postId) {
        return res.status(400).json({
            message: "Post ID and message are required!"
        })
    }

    try {
        
        const post = await Post.findById(postId)
        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            })
        }

        const newComment = new Comment({ 
            message,
            image,
            userId: user._id,
            postId: post._id
        })
        
        await newComment.save()
        
        res.status(201).json({
            message: "Comment created successfully",
            comment: newComment
        })
    
    } catch (error) {
        res.status(500).json({
            message: "Internal sever error"
        })
    }
}

const getComments = async (req, res) => {
    try {

        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const skip = (page - 1) * limit

        const comments = await Comment.find()
            .populate('userId', 'username email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)

        const totalComments = await Comment.countDocuments()
        
        res.status(200).json({
            currentPage: page,
            totalPages: Math.ceil(totalComments / limit),
            totalComments,
            comments
        })
    
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

const getCommentById = async (req, res) => {
    try {
        const { postId, id } = req.params
        
        if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({
                message: "Invalid comment or post ID"
            })
        }       // validate if the comment id is there or not

        const comment = await Comment.findOne({ _id: id, postId })
            .populate('userId', 'username email')
        
        if (!comment) {
            return res.status(404).json({
                message: 'Comment not found for this post'
            })
        }
        
        res.status(200).json(comment)
    
    } catch (error) {
        res.status(500).json({message: "Internal server error"})
    }
}

const updateComment = async (req, res) => {
    try {
        const user = req.user
        const { postId, id } = req.params
        const { message, image } = req.body

        if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({
                message: "Invalid comment or post ID"
            })
        }       // validate if the comment id is there or not

        const comment = await Comment.findOne({ _id: id, postId })

        if (!comment) {
            return res.status(404).json({
                message: `Comment with the id ${id} is not found`
            })
        }

        if (!comment.userId.equals(user._id)) {
            return res.status(403).json({
                message: "You can only update your own comments"
            })
        }

        if (!message && !image) {
            return res.status(400).json({ message: "No fields to update" })
        }

        // allowed updates only
        if (message) comment.message = message
        if (image) comment.image = image

        await comment.save()

        res.status(200).json({
            message: "Comment updated successfully.",
            comment
        })
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
    }
}

const deleteComment = async (req, res) => {

    try {
        const user = req.user
        const { postId, id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({
                message: "Invalid comment or post ID"
            })
        }       // validate if the comment id is there or not

        const comment = await Comment.findOne({ _id: id, postId })
        
        if (!comment) {
            return res.status(404).json({
                message: `Comment with the id ${id} is not found`
            })
        }
        if (!comment.userId.equals(user._id) && !user.admin) {
            return res.status(403).json({
                message: "You can only delete your comments"
            })
        }
        
        await comment.deleteOne()
        
        res.status(200).json({
            message: "Comment deleted successfully."
        })
    
    } catch (error) {
        res.status(500).json({message: "Internal server error"})
    }
}

module.exports = {
    createComment,
    getComments,
    getCommentById,
    updateComment,
    deleteComment
}