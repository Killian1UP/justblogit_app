const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    admin: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true
    },
    otp: String,
    otpUsageTime: Date,
    lastOtpSent: Date,
    passwordResetToken: String,
    passwordResetUsageTime: Date,
    verified: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

const User =  mongoose.model('User', userSchema)

module.exports = User