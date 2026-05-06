const fs = require('fs');
const env = require('../config/env');
const { getOpenAiClient } = require('../config/openai');
const ApiError = require('../utils/apiError');

function ensureOpenAiEnabled() {
  if (!env.openAiApiKey) {
    if (env.allowMockAi && env.nodeEnv !== 'production') {
      return false;
    }

    throw new ApiError(500, 'OPENAI_API_KEY is missing. Configure it in backend/.env.');
  }

  return true;
}

function buildMockChatReply(userMessage) {
  const lowerMessage = String(userMessage || '').toLowerCase();

  if (lowerMessage.includes('tunis')) {
    return [
      'Recommended places to visit in Tunis:',
      '1. Medina of Tunis for heritage and traditional streets.',
      '2. Bardo National Museum for history and mosaics.',
      '3. Sidi Bou Said for architecture, sea views, and cafes.',
    ].join('\n');
  }

  if (lowerMessage.includes('museum')) {
    return 'You can visit the Bardo National Museum for one of the richest historical collections in Tunisia.';
  }

  return `Mock AI response: I received your message "${userMessage}". Add OPENAI_API_KEY in backend/.env to switch from mock mode to real AI mode.`;
}

function buildMockTranslation(text, targetLanguage) {
  return `[Mock translation to ${targetLanguage}] ${text}`;
}

async function generateChatResponse({ systemPrompt, userMessage, context = [] }) {
  const openAiEnabled = ensureOpenAiEnabled();

  if (!openAiEnabled) {
    return buildMockChatReply(userMessage);
  }

  const openai = getOpenAiClient();

  const input = [];

  if (systemPrompt) {
    input.push({
      role: 'system',
      content: [{ type: 'input_text', text: systemPrompt }],
    });
  }

  context.forEach((entry) => {
    input.push({
      role: entry.role,
      content: [{ type: 'input_text', text: entry.text }],
    });
  });

  input.push({
    role: 'user',
    content: [{ type: 'input_text', text: userMessage }],
  });

  const response = await openai.responses.create({
    model: env.openAiChatModel,
    input,
  });

  return response.output_text ? response.output_text.trim() : '';
}

async function translateText({ text, sourceLanguage, targetLanguage }) {
  const openAiEnabled = ensureOpenAiEnabled();

  if (!openAiEnabled) {
    return buildMockTranslation(text, targetLanguage);
  }

  const openai = getOpenAiClient();

  const prompt = [
    'You are a professional tourism translation assistant.',
    `Translate the following content into ${targetLanguage}.`,
    sourceLanguage ? `Source language: ${sourceLanguage}.` : 'Detect the source language automatically.',
    'Return only the translated text without explanations.',
    '',
    text,
  ].join('\n');

  const response = await openai.responses.create({
    model: env.openAiTranslationModel,
    input: prompt,
  });

  return response.output_text ? response.output_text.trim() : '';
}

async function detectLanguage(text) {
  const openAiEnabled = ensureOpenAiEnabled();

  if (!openAiEnabled) {
    if (/[\u0600-\u06FF]/.test(text)) {
      return 'Arabic';
    }

    if (/[a-z]/i.test(text)) {
      return 'English';
    }

    return 'Unknown';
  }

  const openai = getOpenAiClient();

  const response = await openai.responses.create({
    model: env.openAiTranslationModel,
    input: [
      'Identify the language of the following text.',
      'Return only the language name in English.',
      '',
      text,
    ].join('\n'),
  });

  return response.output_text ? response.output_text.trim() : 'Unknown';
}

async function transcribeAudio(filePath, { language, prompt } = {}) {
  const openAiEnabled = ensureOpenAiEnabled();

  if (!openAiEnabled) {
    return 'Mock transcript generated because OPENAI_API_KEY is not configured.';
  }

  const openai = getOpenAiClient();

  const result = await openai.audio.transcriptions.create({
    file: fs.createReadStream(filePath),
    model: env.openAiTranscriptionModel,
    language,
    prompt,
  });

  return result.text || '';
}

async function textToSpeech({
  text,
  voice = env.openAiTtsVoice,
  responseFormat = 'mp3',
  instructions,
}) {
  const openAiEnabled = ensureOpenAiEnabled();

  if (!openAiEnabled) {
    return Buffer.from(`Mock audio payload for text: ${text}`, 'utf8');
  }

  const openai = getOpenAiClient();

  const speech = await openai.audio.speech.create({
    model: env.openAiTtsModel,
    voice,
    input: text,
    response_format: responseFormat,
    instructions,
  });

  const arrayBuffer = await speech.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

module.exports = {
  generateChatResponse,
  translateText,
  detectLanguage,
  transcribeAudio,
  textToSpeech,
};
