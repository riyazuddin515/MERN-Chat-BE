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
        }).find({ _id: { $ne: req.user._id } }).select('-password')
        res.json({
            success: true,
            result: allUsers
        })
    } catch (error) {
        console.log(error.message)
        res.status(400).send(error.message)
    }
})

module.exports = router