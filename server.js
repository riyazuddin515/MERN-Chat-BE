const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const authRoute = require('./routes/authRoute')
const usersRoute = require('./routes/usersRoute')
const chatRoute = require('./routes/chatRoute')

const app = express()
dotenv.config()
app.use(express.json())
connectDB()

app.use('/auth', authRoute)
app.use('/users', usersRoute)
app.use('/chat', chatRoute)


app.listen(process.env.PORT, console.log('Hello from server😀'))