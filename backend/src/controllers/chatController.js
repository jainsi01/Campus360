const ChatService = require('../services/chatService');
const asyncHandler = require('../utils/asyncHandler');
const { BadRequestError } = require('../utils/ApiError');

const handleChat = asyncHandler(async (req, res) => {
  const { message, conversation } = req.body;
  if (!message || typeof message !== 'string' || !message.trim()) {
    throw new BadRequestError('Message parameter is required and must be a non-empty string.');
  }
  if (message.trim().length > 4000) throw new BadRequestError('Message must be 4,000 characters or fewer.');
  if (conversation !== undefined && (!Array.isArray(conversation) || conversation.some((item) => !item || !['user', 'assistant'].includes(item.role) || typeof item.content !== 'string'))) {
    throw new BadRequestError('Conversation history is malformed.');
  }

  const reply = await ChatService.handleUserChat({
    user: req.user,
    message: message.trim(),
    conversation
  });

  res.status(200).json({
    success: true,
    data: {
      reply,
      message: reply,
      role: req.user.role,
      timestamp: new Date().toISOString()
    }
  });
});

module.exports = {
  handleChat
};
