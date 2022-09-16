const express = require('express')
const userSchema = require('../models/userModel')
const authenticatorMiddle = require('../config/authenticatorMiddle')

const router = express.Router()

router.get('/', authenticatorMiddle, async (req, res) => {
    try {
        const searchKeyword = req.query.search
        if (!searchKeyword) {
            res.status(400).send('Invalid request.')
            return
        }
        const allUsers = await userSchema.find({
            $or: [
                { name: { $regex: searchKeyword, $options: 'i' } },
                { email: { $regex: searchKeyword, $options: 'i' } }
            ]
        }).find({ _id: { $ne: req.user._id } }).select({ 'password': 0, 'token': 0 })
        res.status(200).send(allUsers)
    } catch (error) {
        console.log(error.message)
        res.status(500).send(error.message)
    }
})

router.put('/update', authenticatorMiddle, async (req, res) => {
    try {
        if (!req.body) {
            res.status(400).send('Invalid request')
            return
        }
        await userSchema.updateOne({ _id: req.user._id }, { $set: req.body })
        const user = await userSchema.findOne({ _id: req.user._id }).select('-password')
        return res.status(200).send(user)
    } catch (error) {
        console.log(error.log)
        res.status(500).send(error.message)
    }
})

module.exports = router