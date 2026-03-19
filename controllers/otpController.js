const { generateToken, sendMail } = require("../lib/mailConfig")
const User = require("../schemas/userSchema")

const otpVerify = async (req, res) => {
    const { otp, email } = req.body
    const normalizedEmail = email.toLowerCase()

    try {
        const user = await User.findOne({ email: normalizedEmail })
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        if (user.verified) {
            return res.status(400).json({ message: "User is already verified" })
        }

        if (!user.otp || !user.otpUsageTime || user.otpUsageTime < Date.now()) {
            return res.status(400).json({ message: "OTP has expired" })
        }

        if (user.otp !== String(otp)) {
            return res.status(400).json({ message: "OTP invalid" })
        }

        user.otp = undefined
        user.otpUsageTime = undefined
        user.verified = true

        await user.save()

        res.status(200).json({
            message: "Your account has been verified, you can proceed to sign in"
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error" })
    }
}

const otpResend = async (req, res) => {
    const { email } = req.body
    const time = Date.now()
    const normalizedEmail = email.toLowerCase()

    try {
        const user = await User.findOne({ email: normalizedEmail })
        if (!user) {
            return res.status(404).json({message: "User not found"})
        }
        if (user.verified) {
            return res.status(400).json({message: "User is already verified"})
        }
        if (user.lastOtpSent && time - user.lastOtpSent < 60 * 1000) {
            return res.status(429).json({message: "Please wait for 1 minute to request another OTP"})
        }

        const { otp, otpUsageTime } = generateToken()

        user.otp = otp
        user.otpUsageTime = otpUsageTime
        user.lastOtpSent = time

        await user.save()

       try {
            const mailObj = {
                mailFrom: `JustBlogIt ${process.env.KITS_EMAIL}`,
                mailTo: normalizedEmail,
                subject: 'JustBlogIt OTP Resend',
                body: `
                    <h2>Your OTP Code</h2>
                    <p>Your new verification OTP is <strong>${otp}</strong></p>
                    <p>This code expires in 10 minutes.</p>
                `
            }

            const info = await sendMail(mailObj)
            console.log("Email sent:", info.response)

        } catch (error) {
            console.log("Email error:", error.message)
        }
        res.status(200).json({message: "Please check your email for the OTP"})

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}


module.exports = {
    otpVerify,
    otpResend
}