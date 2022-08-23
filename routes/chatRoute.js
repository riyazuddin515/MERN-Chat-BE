const express = require('express')
const chatModel = require('../models/chatModel')
const authenticatorMiddleware = require('../config/authenticatorMiddle')

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
        res.status(200).json({
            success: true,
            result: chatList
        })
    } catch (error) {
        console.log(error.message)
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
})


module.exports = router