const Post = require("../schemas/postSchema")
const mongoose = require("mongoose")


const createPost = async (req, res) => {
    const { title, message, image } = req.body
    const user = req.user

    if (!title || !message) {
        return res.status(400).json({
            message: "Title and message are required!"
        })
    }
    try {
        const newPost = new Post({
            title, 
            message,
            image,
            userId: user._id
        })
        
        await newPost.save()
        
        res.status(201).json({
            message: "Post created successfully",
            post: newPost
        })
    
    } catch (error) {
        res.status(500).json({
            message: "Internal sever error"
        })
    }
}

const getPosts = async (req, res) => {
    try {

        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const skip = (page - 1) * limit

        const posts = await Post.find()
            .populate('userId', 'username email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)

        const totalPosts = await Post.countDocuments()
        
        res.status(200).json({
            currentPage: page,
            totalPages: Math.ceil(totalPosts / limit),
            totalPosts,
            posts
        })
    
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

const getPostById = async (req, res) => {
    try {
        const { id } = req.params
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid post ID"
            })
        }       // validate if the post id is there or not

        const post = await Post.findById(id)
            .populate('userId', 'username email')
        
        if (!post) {
            return res.status(404).json({
                message: `Post with the id ${id} is not found`
            })
        }
        
        res.status(200).json(post)
    
    } catch (error) {
        res.status(500).json({message: "Internal server error"})
    }
}

const updatePost = async (req, res) => {
    try {
        const user = req.user
        const { id } = req.params
        const { title, message, image } = req.body

        const post = await Post.findById(id)

        if (!post) {
            return res.status(404).json({
                message: `Post with the id ${id} is not found`
            })
        }

        if (!post.userId.equals(user._id)) {
            return res.status(403).json({
                message: "You can only update your own posts"
            })
        }

        // allowed updates only
        if (title) post.title = title
        if (message) post.message = message
        if (image) post.image = image

        await post.save()

        res.status(200).json({
            message: "Post updated successfully.",
            post
        })
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
    }
}

const deletePost = async (req, res) => {

    try {
        const user = req.user
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid post ID"
            })
        }

        const post = await Post.findById(id)
        
        if (!post) {
            return res.status(404).json({
                message: `Post with the id ${id} is not found`
            })
        }
        if (!post.userId.equals(user._id) && !user.admin) {
            return res.status(403).json({
                message: "You can only delete your posts"
            })
        }
        
        await post.deleteOne()
        
        res.status(200).json({
            message: "Post deleted successfully."
        })
    
    } catch (error) {
        res.status(500).json({message: "Internal server error"})
    }
}

module.exports = {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost
}