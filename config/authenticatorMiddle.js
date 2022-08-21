const jwt = require('jsonwebtoken')
const userSchema = require('../models/userModel')

const authenticatorMiddle = async (req, res, next) => {
    try {
        if (!req.headers || !req.headers.authorization) {
            res.json({
                success: false,
                message: 'Unauthorized request.'
            })
            return
        }
        const decodedMail = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_TOKEN)
        req.user = await userSchema.findOne({ 'email': decodedMail })
        next()
    } catch (error) {
        console.log(error.message)
        res.json({
            success: false,
            message: error.message
        })
    }
}
module.exports = authenticatorMiddle