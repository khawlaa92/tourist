const OpenAI = require('openai');
const env = require('./env');

let openAiClient = null;

function getOpenAiClient() {
  if (!env.openAiApiKey) {
    throw new Error('OPENAI_API_KEY is not configured.');
  }

  if (!openAiClient) {
    openAiClient = new OpenAI({
      apiKey: env.openAiApiKey,
    });
  }

  return openAiClient;
}

module.exports = {
  getOpenAiClient,
};
