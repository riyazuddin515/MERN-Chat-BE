const mongoose = require('mongoose')

const userModel = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        default: "https://www.nicepng.com/png/detail/522-5226533_get-beyond-the-usual-suspects-profile-pic-icon.png"
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    },
    updatedAt: {
        type: Date,
        default: () => Date.now()
    }
}, { timestamps: true })

module.exports = mongoose.model('user', userModel)