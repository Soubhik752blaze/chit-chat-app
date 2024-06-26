const mongoose = require('mongoose');

const chatSchema = mongoose.Schema(
    {
        chatName: {
            required: true,
            type: String,
            trim: true
        },

        isGroupChat: {
            required: true,
            type: Boolean,
            default: false
        },

        users: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],

        latestMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message"
        },

        groupAdmin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }

    }, { timestamps: true }
)

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;