const mongoose = require('mongoose');

const messageSchema = mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        chat: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat"
        },

        content: [{
            type: String,
            trime: true
        }],

    }, { timestamps: true }
)

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;