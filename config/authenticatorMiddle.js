const jwt = require('jsonwebtoken')
const userSchema = require('../models/userModel')

const authenticatorMiddle = async (req, res, next) => {
    try {
        if (!req.headers || !req.headers.authorization) {
            return res.status(400).send('Unauthorized request.')
        }
        const decodedMail = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_TOKEN)
        const user = await userSchema.findOne({ 'email': decodedMail })
        if (user) {
            req.user = user
            next()
        } else {
            throw new Error('User not found')
        }
    } catch (error) {
        console.error(error.message)
        return res.status(400).send(error.message)
    }
}
module.exports = authenticatorMiddle