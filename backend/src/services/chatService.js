const AIService = require('./aiService');

class ChatService {
  static async handleUserChat({ user, message }) {
    const role = user.role || 'STUDENT';
    const userName = user.name || 'User';

    const systemPrompt = `You are Campus360 Assistant, an AI help agent for the Campus360 University Management System.
The current user is ${userName} with role ${role}.
Rules:
1. Provide concise, helpful instructions on how to use Campus360 operations available to the ${role} role.
2. NEVER reveal sensitive data such as user password hashes, JWT secrets, database connection strings, or private information of unauthorized users.
3. NEVER claim that a database operation, record modification, grade edit, or attendance update was executed unless it was done through official API forms.
4. Keep tone professional, encouraging, and clear.`;

    const reply = await AIService.generateResponse({
      systemPrompt,
      userMessage: message
    });

    return reply;
  }
}

module.exports = ChatService;
