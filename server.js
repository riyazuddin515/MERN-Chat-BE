const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const authRoute = require('./routes/authRoute')

const app = express()
dotenv.config()
app.use(express.json())
connectDB()

app.use('/auth', authRoute)

const PORT = process.env.PORT || 5432
app.listen(PORT, console.log('Hello from server😀'))
