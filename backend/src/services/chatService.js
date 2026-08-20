const AIService = require('./aiService');

class ChatService {
  static async handleUserChat({ user, message, conversation }) {
    return AIService.generateResponse({ user, message, conversation });
  }
}

module.exports = ChatService;
