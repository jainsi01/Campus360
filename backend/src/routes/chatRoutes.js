const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const chatController = require('../controllers/chatController');

const router = express.Router();

router.use(authMiddleware);

// @route   POST /api/chat
// @desc    General Campus360 Help AI Assistant
// @access  Private (All authenticated roles)
router.post('/', chatController.handleChat);

module.exports = router;
