const express = require('express');
const { registerUser, authUser, allUsers, changeProfilePicture } = require('../Controllers/userControllers');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

//user Routes
router.route('/').post(registerUser).get(protect, allUsers);
router.post('/login', authUser);
router.post('/changePic', protect, changeProfilePicture)

//chat Routes

module.exports = router;
