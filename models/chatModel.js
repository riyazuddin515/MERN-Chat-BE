const { mongoose } = require("mongoose")
const userModel = require('./userModel')

const chatModel = mongoose.Schema(
    {
        chatName: { type: String, trim: true },
        isGroupChat: { type: Boolean, default: false },
        users: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user"
            }
        ],
        lastMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message"
        },
        groupAdmin: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: userModel.modelName
        }]
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("chat", chatModel);