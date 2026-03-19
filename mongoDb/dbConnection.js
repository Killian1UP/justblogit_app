const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        console.log("Connecting to MongoDB...")
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("MongoDb connected 👍")       
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDB