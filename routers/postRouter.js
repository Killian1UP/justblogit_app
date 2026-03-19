const express = require("express")
const authMiddleware = require("../middlewares/authMiddleware")
const { createPost, getPosts, getPostById, updatePost, deletePost } = require("../controllers/postController")
const postRouter = express.Router()

postRouter
    .post('/posts', authMiddleware, createPost)

// get all posts
    .get('/posts', getPosts)

// get post by id
    .get('/posts/:id', getPostById)

// update a post
    .put('/posts/:id', authMiddleware, updatePost)

// delete a post
    .delete('/posts/:id', authMiddleware, deletePost)


module.exports = postRouter