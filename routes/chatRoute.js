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
            return res.status(200).json(chat)
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
        let chatList = await chatModel.find({
            users: { $elemMatch: { $eq: req.user._id } }
        })
            .populate('users', { 'password': 0, 'token': 0 })
            .populate('groupAdmin', { 'password': 0, 'token': 0 })
            .populate('lastMessage')
            .sort({ updatedAt: -1 })

        chatList = await chatModel.populate(chatList, { path: 'lastMessage.sender', select: 'name' })
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
        const chatUpdate = await chatModel.updateOne({ _id: chat }, { 'lastMessage': message._id })
        res.status(200).json(message)
    } catch (error) {
        console.log(error.message)
        res.status(500).send(error.message)
    }
})

//Get Messages
router.get('/messages/:chatId', authenticatorMiddleware, async (req, res) => {
    if (!req.params.chatId) {
        res.status(400).send('Invalid request abcd.')
        return
    }
    try {
        const messages = await messageModel.find({
            chat: req.params.chatId
        }).populate('sender', { 'password': 0, 'token': 0 })
        res.status(200).json(messages)
    } catch (error) {
        console.log(error.message)
        res.status(400).send(error.message)
    }
})

router.post('/newGroup', authenticatorMiddleware, async (req, res) => {
    if (!req.body.chatName || !req.body.users) {
        res.status(400).send('Invalid request.')
        return
    }
    const users = JSON.parse(req.body.users)
    if (users.length < 1) {
        return res.status(400).send('Atleat 1 member required.');
    }
    users.push(req.user)
    try {
        let groupChat = await chatModel.create({
            chatName: req.body.chatName,
            isGroupChat: true,
            users: users,
            groupAdmin: req.user._id
        })
        groupChat = await groupChat.populate('users', { 'password': 0, 'token': 0 })
        res.status(200).send(groupChat)
    } catch (error) {
        console.log(error.message)
        res.status(500).send(error.message)
    }
})

//  Add Members
router.post('/addMembers', authenticatorMiddleware, async (req, res) => {
    try {
        if (!req.body.chatId || !req.body.users) {
            res.status(400).send('Invalid request.')
            return
        }
        const users = JSON.parse(req.body.users);
        const r = await chatModel.updateOne({ _id: req.body.chatId }, { $addToSet: { 'users': users } })
        const c = await chatModel.findOne({ _id: req.body.chatId })
            .populate('users', { 'password': 0, 'token': 0 })
            .populate('groupAdmin', { 'password': 0, 'token': 0 })
            .populate('lastMessage')
        return res.status(200).send(c)
    } catch (error) {
        console.log(error.message)
        return res.status(500).send(error.message)
    }
})

module.exports = router