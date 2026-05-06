const { v4: uuidv4 } = require('uuid');
const openaiService = require('./openaiService');
const historyModel = require('../models/historyModel');
const ApiError = require('../utils/apiError');

async function translate({
  user,
  text,
  sourceLanguage,
  targetLanguage,
  filePath,
  originalFileName,
}) {
  if (!text && !filePath) {
    throw new ApiError(400, 'Provide either text or an audio file.');
  }

  if (!targetLanguage) {
    throw new ApiError(400, 'targetLanguage is required.');
  }

  let sourceText = text || '';

  if (filePath) {
    sourceText = await openaiService.transcribeAudio(filePath, {
      language: sourceLanguage,
    });
  }

  const detectedSourceLanguage =
    sourceLanguage || (sourceText ? await openaiService.detectLanguage(sourceText) : 'Unknown');

  let translatedText = '';

  try {
    translatedText = await openaiService.translateText({
      text: sourceText,
      sourceLanguage: detectedSourceLanguage,
      targetLanguage,
    });
  } catch (error) {
    throw new ApiError(
      500,
      'Failed to translate text with OpenAI.',
      error.message || String(error)
    );
  }

  if (!translatedText) {
    throw new ApiError(500, 'OpenAI returned an empty translation.');
  }

  const record = {
    id: uuidv4(),
    userId: user ? user.id : null,
    inputType: filePath ? 'audio' : 'text',
    originalText: sourceText,
    translatedText,
    sourceLanguage: detectedSourceLanguage,
    targetLanguage,
    originalFileName: originalFileName || null,
    createdAt: new Date().toISOString(),
  };

  await historyModel.addTranslation(record);

  return record;
}

module.exports = {
  translate,
};
