const express = require('express')
const userSchema = require('../models/userModel')
const bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken');
const { response } = require('express');

const router = express.Router()

router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            res.json({
                success: false,
                message: 'Invalid request'
            })
            return
        }
        const userExists = await userSchema.where('email').eq(req.body.email)
        if (!userExists) {
            console.log(userExists)
            res.json({
                success: false,
                message: "User already exists with this mail"
            })
            return
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const jwtToken = jwt.sign(req.body.email, process.env.JWT_TOKEN)
        const user = await userSchema.create({
            name: name,
            email: email,
            password: hashedPassword,
            token: jwtToken
        })
        const { password: pass, ...response } = user._doc
        response.success = true
        res.json(response)
        console.log('User Created.')
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            res.json({
                success: false,
                message: 'Invalid request.'
            })
            return
        }
        const user = await userSchema.where('email').eq(req.body.email)
        if (user.length === 0) {
            res.json({
                success: false,
                message: "No user found with this email."
            })
            return
        }
        const matched = await bcrypt.compare(password, user[0].password)
        if (matched) {
            const { password: pass, ...response } = user[0]._doc
            response.success = true
            res.json(response)
            return
        }
        res.json({
            success: false,
            message: "Wrong password."
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
})

module.exports = router