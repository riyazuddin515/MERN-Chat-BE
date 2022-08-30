const express = require('express')
const authenticatorMiddleware = require('../config/authenticatorMiddle')
const userModel = require('../models/userModel')
const chatModel = require('../models/chatModel')
const messageModel = require('../models/MessageModel')

const router = express.Router()

router.post('/', authenticatorMiddleware, async (req, res) => {
    try {
        const { userId } = req.body
        if (!userId || userId === req.user._id) {
            res.status(400).send('Invalid request.')
            return
        }

        const chat = await chatModel.findOne({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: userId } } },
                { users: { $elemMatch: { $eq: req.user._id } } }
            ]
        }).populate('users', { 'password': 0, 'token': 0 })
            .populate('lastMessage')

        if (chat) {
            console.log('found');
            res.status(200).json(chat)
            return
        }

        let createChat = await chatModel.create({
            chatName: 'One to One Chat',
            isGroupChat: false,
            users: [userId, req.user._id],
            groupAdmin: [req.user._id]
        })
        createChat = await chatModel.findOne({ _id: createChat._id })
            .populate('users', { 'password': 0, 'token': 0 })
            .populate('lastMessage')
        console.log('chat created');
        res.status(200).json(createChat)
    } catch (error) {
        console.log(error.message);
        res.status(400).send(error.message)
    }
})

//access Chat
router.get('/', authenticatorMiddleware, async (req, res) => {
    try {
        const chatList = await chatModel.find({
            users: { $elemMatch: { $eq: req.user._id } }
        })
            .populate('users', { 'password': 0, 'token': 0 })
            .populate('groupAdmin', { 'password': 0, 'token': 0 })
            .populate('lastMessage')
            .sort({ updatedAt: -1 })
        res.status(200).json(chatList)
    } catch (error) {
        console.log(error.message)
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
})

//Send Message
router.post('/messages/', authenticatorMiddleware, async (req, res) => {
    try {
        const { content, chat } = req.body
        if (!content || !chat) {
            res.status(400).send('Invalid request.')
            return
        }

        let message = await messageModel.create({
            content: content,
            sender: req.user._id,
            chat: chat,
        })
        message = await message.populate('sender', { 'password': 0, 'token': 0 })
        message = await message.populate('chat')
        message = await message.populate('chat.users', { 'password': 0, 'token': 0 })
        res.status(200).json(message)
    } catch (error) {
        console.log(error.message)
        res.status(500).send(error.message)
    }
})

//Get Messages
router.get('/messages/:chatId', authenticatorMiddleware, async (req, res) => {
    try {
        if (!req.params.chatId) {
            res.status(400).send('Invalid request abcd.')
            return
        }
        const messages = await messageModel.find({
            chat: req.params.chatId
        }).populate('sender', { 'password': 0, 'token': 0 })
        res.status(200).json(messages)
    } catch (error) {
        console.log(error.message)
        res.status(400).send(error.message)
    }
})

module.exports = router