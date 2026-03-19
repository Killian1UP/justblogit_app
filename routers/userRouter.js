const express = require('express')
const adminMiddleware = require('../middlewares/adminMiddleware')
const authMiddleware = require('../middlewares/authMiddleware')
const { createUser, getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController')
const userRouter = express.Router()

// user creation
userRouter
    .post('/register', createUser)

// get all users
    .get('/users', authMiddleware, adminMiddleware, getAllUsers)

// get a user
    .get('/users/:id', authMiddleware, getUserById)

// update a user
    .put('/users/:id', authMiddleware, updateUser)

// delete a user
    .delete('/users/:id', authMiddleware, adminMiddleware, deleteUser)


module.exports = userRouter