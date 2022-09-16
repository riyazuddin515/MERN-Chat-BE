const express = require('express')
const userModel = require('../models/userModel')
const bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken');

const router = express.Router()

router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            res.send(400, 'Invalid request')
            return
        }
        const userExists = await userModel.where('email').eq(req.body.email)
        if (!userExists) {
            res.send(400, 'User already exists with this mail')
            return
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const jwtToken = jwt.sign(req.body.email, process.env.JWT_TOKEN)
        const user = await userModel.create({
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
        res.send(400, error.message)
    }
})

router.post('/login', async (req, res) => {
    try {
        console.log('login invoked');
        const { email, password } = req.body
        if (!email || !password) {
            res.json({
                success: false,
                message: 'Invalid request.'
            })
            return
        }
        const user = await userModel.findOne({ email: { $regex: req.body.email, $options: 'i' } })
        if (user.length === 0) {
            return res.status(400).send("No user found with this email.")
        }
        const matched = await bcrypt.compare(password, user.password)
        if (matched) {
            const { password: pass, ...response } = user._doc
            response.success = true
            res.json(response)
            return
        }
        res.status(400).send("Wrong password.")
    } catch (error) {
        res.status(400).send(error.message)
    }
})

module.exports = router