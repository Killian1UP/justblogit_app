const express = require("express")
const { otpVerify, otpResend } = require("../controllers/otpController")
const otpRouter = express.Router()

otpRouter
    .post('/verify', otpVerify)
    .post('/resendOTP', otpResend)

module.exports = otpRouter