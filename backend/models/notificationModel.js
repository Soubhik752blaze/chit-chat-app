const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
    //user Id of the sender
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: true
    },
    read: {
        type: Boolean,
        default: false
    },
    message: {
        type: String,
        default: '1 new unread message'
    }
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
