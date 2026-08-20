const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const chatController = require('../controllers/chatController');
const rateLimit = require('express-rate-limit');

const router = express.Router();

router.use(authMiddleware);

// @route   POST /api/chat
// @desc    General Campus360 Help AI Assistant
// @access  Private (All authenticated roles)
router.post('/', rateLimit({ windowMs: 60 * 1000, max: 15, standardHeaders: true, legacyHeaders: false, message: { success: false, message: 'Too many AI requests. Please wait a minute and try again.' } }), chatController.handleChat);

module.exports = router;
