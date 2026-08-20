const { GoogleGenAI } = require('@google/genai');
const { ServiceUnavailableError } = require('../utils/ApiError');

let ai;
const DEFAULT_MODEL = 'gemini-2.5-flash';
const MAX_HISTORY_MESSAGES = 16;

const getGeminiClient = () => {
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return ai;
};

const getSafeGeminiErrorMessage = (error) => String(error?.message || 'No error message provided')
  .replace(/AIza[\w-]+/g, '[redacted]')
  .slice(0, 500);

const SYSTEM_INSTRUCTION = `You are Campus360 AI, an intelligent and helpful university assistant integrated into the Campus360 University Management System.

You can answer general questions naturally and help with university management, academics, programming, computer science, study preparation, placement preparation, general educational questions, Campus360 functionality, general knowledge, coding explanations, and problem solving. Do not restrict yourself to predefined questions.

Understand the user's intent and provide useful answers. Adapt technical explanations to the user's apparent level. For Campus360-specific functionality, only describe functionality that actually exists in Campus360, respects the current user's role, and never claim an action was completed unless the backend actually completed it.

Never reveal passwords, API keys, JWT tokens, database credentials, secrets, or another user's private information. Respect authentication and authorization. You are an assistant, not an administrator: do not bypass authorization or modify records. If you do not know something, say so rather than inventing it. Use concise Markdown and code blocks when helpful.`;

class AIService {
  static async generateResponse({ user, message, conversation = [] }) {
    if (!process.env.GEMINI_API_KEY) {
      throw new ServiceUnavailableError('Campus360 AI is temporarily unavailable. Please contact the administrator.');
    }

    const history = conversation.slice(-MAX_HISTORY_MESSAGES).map((item) => ({
      role: item.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: item.content.slice(0, 4000) }]
    }));
    const contents = [...history, { role: 'user', parts: [{ text: message }] }];
    const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;
    const role = user?.role || 'STUDENT';

    try {
      const response = await getGeminiClient().models.generateContent({
        model,
        contents,
        config: {
          systemInstruction: `${SYSTEM_INSTRUCTION}\n\nCurrent user role: ${role}\nExplain only ${role}-accessible Campus360 functionality.`,
          maxOutputTokens: 900
        }
      });
      const reply = response.text?.trim();
      if (!reply) throw new Error('Gemini returned no text response');
      return reply;
    } catch (error) {
      const status = Number(error?.status || error?.code);
      console.error('[Gemini] Chat request failed:', {
        status: Number.isFinite(status) ? status : 'unknown',
        name: error?.name,
        code: error?.code,
        message: getSafeGeminiErrorMessage(error)
      });

      if (status === 429) {
        throw new ServiceUnavailableError('Campus360 AI is temporarily busy. Please try again later.');
      }
      throw new ServiceUnavailableError('Campus360 AI is temporarily unavailable. Please try again later.');
    }
  }
}

module.exports = AIService;
