const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");

const sendMessage = async (req, res) => {
    try {
        const { content, chatId } = req.body;
        if (!content || !chatId) {
            res.status(400).json({
                message: 'Invalid data passed for sending message'
            });
        }

        //create a new message
        let newMessage = {
            sender: req.user._id,
            content,
            chat: chatId
        }

        let message = await Message.create(newMessage);

        message = await message.populate("sender", "name pic");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.users",
            select: "name pic email",
        });

        //update this message as the latest message of the chat
        await Chat.findByIdAndUpdate(chatId, { latestMessage: message });


        return res.status(200).json(message);

    }
    catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Error occured while sending message'
        })
    }
}

const allMessages = async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "name picture email").populate('chat');
        res.json(messages);
    } catch (error) {
        return res.status(400).json({
            message: 'Error occured while fetching chat messages'
        })
    }

}

module.exports = { allMessages, sendMessage };