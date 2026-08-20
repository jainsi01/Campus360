const ChatService = require('../services/chatService');
const asyncHandler = require('../utils/asyncHandler');
const { BadRequestError } = require('../utils/ApiError');

const handleChat = asyncHandler(async (req, res) => {
  const { message } = req.body;
  if (!message || typeof message !== 'string' || !message.trim()) {
    throw new BadRequestError('Message parameter is required and must be a non-empty string.');
  }

  const reply = await ChatService.handleUserChat({
    user: req.user,
    message: message.trim()
  });

  res.status(200).json({
    success: true,
    data: {
      message: reply,
      role: req.user.role,
      timestamp: new Date().toISOString()
    }
  });
});

module.exports = {
  handleChat
};
