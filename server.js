const express = require("express")
const cookieParser = require('cookie-parser')
const connectDB = require("./mongoDb/dbConnection")
const userRouter = require("./routers/userRouter")
const otpRouter = require("./routers/otpRouter")
const authRouter = require("./routers/authRouter")
const postRouter = require("./routers/postRouter")
const commentRouter = require("./routers/commentRouter")

require('dotenv').config()
connectDB()

const server = express()
const port = process.env.PORT

// middlewares
server.use(express.json())
server.use(express.urlencoded({extended: true}))
server.use(cookieParser())

// routers
server.use('/api', userRouter)
server.use('/api', otpRouter)
server.use('/api', authRouter)
server.use('/api', commentRouter)
server.use('/api', postRouter)


server.listen(port, () => {
    console.log(`Server is listening to port ${port}`)
})