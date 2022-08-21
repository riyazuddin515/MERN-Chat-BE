const express = require('express')
const userSchema = require('../models/userModel')
const authenticatorMiddle = require('../config/authenticatorMiddle')

const router = express.Router()

router.get('/hello', authenticatorMiddle, async (req, res) => {
    console.log('route')
    res.send('done')
})

router.get('/', authenticatorMiddle, async (req, res) => {
    try {
        const searchKeyword = req.query.search
        if (!searchKeyword) {
            res.json({
                success: false,
                message: 'Invalid request.'
            })
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
        res.json({
            success: false,
            message: error.message
        })
    }
})

module.exports = router