const jwt = require("jsonwebtoken")
const User = require("../schemas/userSchema")


const adminMiddleware = async (req, res, next) => {

    const token = req.cookies.token
    const JWT_SECRET = process.env.JWT_SECRET

    if (!token) {
        return res.status(401).json({ message: "Authentication required" })
    }

    try {
        const verifiedToken = jwt.verify(token, JWT_SECRET)

        const user = await User.findById(verifiedToken.id).select("-password")

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            })
        }

        if (!user.admin) {
            return res.status(403).json({ message: "Admin access required" })
        }

        req.user = user
        next()

    } catch (error) {
       console.error(error.message) 
       return res.status(401).json({ message: "Token invalid or expired" })
    }

}

module.exports = adminMiddleware