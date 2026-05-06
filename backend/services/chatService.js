const { v4: uuidv4 } = require('uuid');
const openaiService = require('./openaiService');
const historyModel = require('../models/historyModel');
const ApiError = require('../utils/apiError');

async function sendMessage({ user, message, history = [] }) {
  if (!message) {
    throw new ApiError(400, 'message is required.');
  }

  const reply = await openaiService.generateChatResponse({
    systemPrompt:
      'You are Smart AI Tourism Bracelet, a helpful travel assistant focused on tourism, culture, navigation, and safety.',
    userMessage: message,
    context: history.map((item) => ({
      role: item.role || 'user',
      text: item.text || '',
    })),
  });

  const entry = {
    id: uuidv4(),
    userId: user ? user.id : null,
    message,
    response: reply,
    createdAt: new Date().toISOString(),
  };

  await historyModel.addChatMessage(entry);

  return entry;
}

module.exports = {
  sendMessage,
};
