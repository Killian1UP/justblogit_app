const nodemailer = require("nodemailer")
const crypto = require("crypto")

const generateToken = () => {
    return {
        otp: crypto.randomInt(10000, 100000).toString(),  
        otpUsageTime: new Date(Date.now() + 10 * 60 * 1000),
        passwordResetToken: crypto.randomBytes(32).toString('hex') 
    }
} 

const sendMail = async ({mailFrom, mailTo, subject, body}) => {
    try {
        //verifying the app
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: true,
            auth: {
                user: process.env.APP_EMAIL,
                pass: process.env.EMAIL_PASS
            }
        })

        // sending the email
        const info = await transporter.sendMail({
            from: mailFrom,
            to: mailTo,
            subject,
            html: body
        })
        return info
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    generateToken,
    sendMail
}