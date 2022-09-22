const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const authRoute = require('./routes/authRoute')
const usersRoute = require('./routes/usersRoute')
const chatRoute = require('./routes/chatRoute')
const { instrument } = require('@socket.io/admin-ui')
const path = require('path')

const app = express()
dotenv.config()
app.use(express.json())
connectDB()

app.use('/auth', authRoute)
app.use('/users', usersRoute)
app.use('/chat', chatRoute)


if (process.env.NODE_ENV === 'production') {
    app.use(express.static('public'))
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
    })
} else {
    app.get('/', (req, res) => {
        res.status(200).send('Server is up😀')
    })
}

const server = app.listen(process.env.PORT, console.log('Hello from server😀'))

const io = require('socket.io')(server, {
    pingTimeOut: 60000,
    cors: {
        origin: ['http://localhost:3000']
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