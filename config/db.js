const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log(`Connected to DB: ${connection.connection.host}`)
    } catch (error) {
        console.log(error.message)
        process.exit()
    }
}

module.exports = connectDB;