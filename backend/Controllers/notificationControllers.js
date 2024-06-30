const Notification = require('../models/notificationModel');

const fetchAllNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        const notifications = await Notification.find({ userId, read: false }).populate("chat").sort({ updatedAt: -1 });
        return res.status(200).json(notifications);
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Failed to fetch notifications'
        })
    }
};

const markNotificationAsRead = async (req, res) => {
    
    try {
        const {notificationId} = req.body;
        console.log(notificationId, 'notificationId')
        const notification = await Notification.findById(notificationId);
        if (!notification) {
            throw new Error('Notification not found');
        }
        notification.read = true;
        await notification.save();
        console.log(`${notificationId} notification marked as read` );
        return res.status(200).json({ success: true });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Failed to mark notification as read'
        })
    }
};

const markAllNotificationsAsRead = async (req, res) => {
    // console.log(`markAllNotificationsAsRead called by ${req.user._id}`)
    try {
        const userId = req.user._id;
        await Notification.updateMany({ userId }, { read: true });
        return res.status(200).json({ success: true });
    } catch (err) {
        return res.status(500).json({
            message: 'Failed to mark notifications as read'
        })
    }
};

module.exports = {
    fetchAllNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead
};
