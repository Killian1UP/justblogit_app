const express = require("express")
const { login, resetRequest, validationPasswordOTP, resetPassword } = require("../controllers/authController")
const authRouter = express.Router()

authRouter
    .post('/user/login', login)
    .post('/password/resetRequest', resetRequest)
    .post('/password/validate', validationPasswordOTP)
    .post('/password/reset', resetPassword)

module.exports = authRouter