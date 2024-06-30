const express = require('express');
const router = express.Router();
const {
    createNotification,
    fetchAllNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead
} = require('../Controllers/notificationControllers')

const { protect } = require("../middleware/authMiddleware");

// GET route to fetch all notifications for a user
router.get('/', protect, fetchAllNotifications);
// PUT route to mark all notifications as read for a user
router.put('/markAllasRead', protect, markAllNotificationsAsRead)
// PUT route to mark all notifications as read for a user
router.patch('/markasRead', protect, markNotificationAsRead)
    

//chat Routes
module.exports = router;
