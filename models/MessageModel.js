const mongoose = require('mongoose')
const userModel = require('./userModel')
const chatModel = require('./chatModel')

const messageModel = mongoose.Schema({
    content: {
        type: String
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: userModel.modelName
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: chatModel.modelName
    },
    readBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: userModel.modelName
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('messages', messageModel)