const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/response');
const chatService = require('../services/chatService');

const sendChatMessage = asyncHandler(async (req, res) => {
  const result = await chatService.sendMessage({
    user: req.user,
    message: req.body.message,
    history: req.body.history || [],
  });

  return success(res, 200, 'AI response generated successfully.', result);
});

module.exports = {
  sendChatMessage,
};
