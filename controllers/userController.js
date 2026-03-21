const bcrypt = require("bcrypt")
const User = require("../schemas/userSchema")
const { generateToken, sendMail } = require("../lib/mailConfig")

const createUser = async (req, res) => {
    try {

        const { username, email, password } = req.body

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required!"
            })
        } else {
            const user = await User.findOne({ email })
            if (user) {
                res.status(409).json({ message: "User is already registered, proceed to login."})
                return
            }
            const hashedPassword = await bcrypt.hash(password, 10)

            // otp generation
            const {otp, otpUsageTime} = generateToken()
            const time = Date.now()

            const normalizedEmail = email.toLowerCase()  // avoid duplicate emails

            const newUser = new User(
                {
                    username,
                    email: normalizedEmail,
                    password: hashedPassword,
                    otp,
                    otpUsageTime,
                    lastOtpSent: time
                }
            )
            
            await newUser.save()

            try {
                const mailObj = {
                    mailFrom: `JustBlogIt ${process.env.KITS_EMAIL}`,
                    mailTo: normalizedEmail,
                    subject: 'JustBlogIt OTP Verification',
                    body: `
                        <h1>Welcome to JustBlogIt, <strong>${username}</strong> 🙌</h1>
                        <p> Here is your OTP ${otp}, proceed to verify <p>
                        <p> Please do not reply to this email, as it is coming from the app <p>
                    `
                }

                const info = await sendMail(mailObj)
                console.log("Email sent:", info.response)

            } catch (error) {
                console.log("Email error:", error.message)
            }

            res.status(201).json({
                message: "User registered successfully. Check your email for OTP."
            })
        }

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password -otp -passwordResetToken")
        if (users.length === 0) {
            return res.status(200).json({
                message: "No user(s) was found, you must register or sign-in as a user."
            })
        }
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

const getUserById = async (req, res) => {
    try {
        const { id } = req.params

        // Only allow self or admin
        if (req.user._id.toString() !== id && !req.user.admin) {
            return res.status(403).json({ message: "Not authorized to view this user" })
        }

        const user = await User.findById(id).select("-password -otp -passwordResetToken")
        if (!user) {
            return res.status(404).json({
                message: `User with the id ${id} is not found`
            })
        }
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

const updateUser = async (req, res) => {
    try {
        const { username, email, password } = req.body
        const { id } = req.params

        // Only allow updating self or admin
        if (req.user._id.toString() !== id && !req.user.admin) {
            return res.status(403).json({ message: "Not authorized to update this user" })
        }

        let updatedData = {}

        if (username) {
            updatedData.username = username
        }

        if (email) {
            updatedData.email = email.toLowerCase()
        }       

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10)
            updatedData.password = hashedPassword
        }
        
        const user = await User.findByIdAndUpdate(
            id,
            updatedData,
            { returnDocument: 'after' } 
        )
        if (!user) {
            return res.status(404).json({
                message: `User with the id ${id} is not found`
            })
        }
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findByIdAndDelete(id)
        if (!user) {
            return res.status(404).json({
                message: `User with the id ${id} is not found`
            })
        }
        res.status(200).json({
            message: "User deleted successfully"
        })
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
}