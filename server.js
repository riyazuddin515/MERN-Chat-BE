const express = require('express')
const dotenv = require('dotenv')
const { colors } = require('colors')
const connectDB = require('./config/db')
const authRoute = require('./routes/authRoute')
const usersRoute = require('./routes/usersRoute')
const chatRoute = require('./routes/chatRoute')
const { instrument } = require('@socket.io/admin-ui')

const app = express()
dotenv.config()
app.use(express.json())
connectDB()

app.use('/auth', authRoute)
app.use('/users', usersRoute)
app.use('/chat', chatRoute)

app.get('/', (req, res) => {
    console.log('Hello from server')
})


const server = app.listen(process.env.PORT, console.log('Hello from server😀'))

const io = require('socket.io')(server, {
    pingTimeOut: 60000,
    cors: {
        origin: ['http://localhost:3000', 'https://admin.socket.io/']
    }
})

io.on('connection', (socket) => {
    socket.on('add-user', userId => {
        socket.join(userId)
    })
    socket.on('disconnect', () => {
        io.in(socket.id).disconnectSockets(true);
    })
    socket.on('send-message', message => {
        message.chat.users
            .filter(user => user._id != message.sender._id)
            .forEach((user) => {
                io.to(user._id).emit('receive-message', message)
            })
    })
    socket.on('typing', (chat, userId) => {
        chat.users.forEach(user => {
            if (user._id !== userId) {
                io.to(user._id).emit('typing', chat._id)
            }
        })
    })
    socket.on('stop-typing', (chat, userId) => {
        chat.users.forEach(user => {
            if (user._id !== userId) {
                io.to(user._id).emit('stop-typing', chat._id)
            }
        })
    })
})

instrument(io, { auth: false })