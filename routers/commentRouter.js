const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware')
const { createComment, getComments, getCommentById, updateComment, deleteComment } = require('../controllers/commentController')
const commentRouter = express.Router()

commentRouter
    .get('/posts/comments', getComments)
    
    .post('/posts/:postId/comments', authMiddleware, createComment)
    
    .get('/posts/:postId/comments/:id', getCommentById)
    
    .put('/posts/:postId/comments/:id', authMiddleware, updateComment)
    
    .delete('/posts/:postId/comments/:id', authMiddleware, deleteComment)

module.exports = commentRouter