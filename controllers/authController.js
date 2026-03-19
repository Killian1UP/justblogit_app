const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../schemas/userSchema")
const { generateToken, sendMail } = require("../lib/mailConfig")

const activateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: "1hr"})
}

// logging in
const login = async (req, res) => {
    try {

        const { email, password } = req.body
        if (!email || !password) {
            res.status(400).json({
                message: "Please provide all fields to sign-in"
            })
            return
        } else {
            const normalizedEmail = email.toLowerCase()
            const user = await User.findOne({ email: normalizedEmail })
            if (!user) {
                res.status(404).json({ message: "User not found, please proceed to register first."})
                return          
            }
            if (!user.verified) {
                return res.status(400).json({message: "User needs to verify first before logging in"})
            }
            const comparedPassword = await bcrypt.compare(password, user.password)
            if (!comparedPassword) {
                res.status(401).json({
                    message: "Email or password is incorrect, please try again!"
                })
                return
            }

            const token = activateToken(user._id)

            return res
                .cookie('token', token, {httpOnly: true, sameSite:'strict'})
                .status(200)
                .json({message: "Logged in successfully, Proceed to make a post"})

        }
    } catch (error) {
        res.status(500).json(({
            message: error.message
        }))
    }
}

// request for password reset
const resetRequest = async (req, res) => {
    const { email } = req.body

    try {
        
        if (!email) {
            return res.status(400).json({
                message: "Please provide an email address"
            })
        }      
        
        const normalizedEmail = email.toLowerCase()       
        const user = await User.findOne({email: normalizedEmail})
        
        if (!user) {
            return res.status(400).json({
                message: "Account not found. Please contact support or try again."
            })
        }  

        const { passwordResetToken, otpUsageTime } = generateToken()
        user.passwordResetToken = passwordResetToken
        user.passwordResetUsageTime = otpUsageTime
        await user.save()

        // sending a password reset otp to the email address
        try {
            const mailObj = {
                mailFrom: `JustBlogIt ${process.env.KITS_EMAIL}`,
                mailTo: user.email,
                subject: 'JustBlogIt Password Reset',
                body: `
                    <h1>Password Reset Request</h1>
                    <p>Hello <strong>${user.username}</strong></p>
                    <p>Your reset code is <strong>${passwordResetToken}</strong></p>
                `
            }

            await sendMail(mailObj)
            
            res.status(200).json({
                message: "Password reset email sent"
            })

        } catch (error) {
            console.error(error)
            return res.status(500).json({
                message: "Failed to send reset email"
            })
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

const validationPasswordOTP = async (req, res) => {
    const { token, email } = req.body

    try {

        if (!email || !token) {
            return res.status(400).json({
                message: "Email and token are required"
            })
        }

        const normalizedEmail = email.toLowerCase()
        const user = await User.findOne({email: normalizedEmail})
        if (!user) {
            return res.status(404).json({
                message: "Account not found."
            })
        }

        if (!user.passwordResetToken || !user.passwordResetUsageTime) {
            return res.status(400).json({
                message: "No password reset request found"
            })
        }

        if (user.passwordResetToken !== token || user.passwordResetUsageTime < Date.now()) {
            return res.status(400).json({message: "OTP is invalid or expired"})
        }
        res.status(200).json({message: "Access granted to change password"})
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

const resetPassword = async (req, res) => {
    const { email, token, newPassword } = req.body

    try {
        
        if (!email || !token || !newPassword) {
            return res.status(400).json({
                message: "Email, token and new password are required"
            })
        }

        const normalizedEmail = email.toLowerCase()
        const user = await User.findOne({
            email: normalizedEmail,
            passwordResetToken: token
        })
        if (!user) {
            return res.status(400).json({
                message: "Account not found."
            })
        }

        if (user.passwordResetUsageTime < Date.now()) {
            return res.status(400).json({
                message: "Reset token is invalid or expired"
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        user.password = hashedPassword
        user.passwordResetToken = undefined
        user.passwordResetUsageTime = undefined

        await user.save()

        res.status(200).json({message: "Password successfully changed"})
    
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

module.exports = {
    login,
    resetRequest,
    validationPasswordOTP,
    resetPassword
}