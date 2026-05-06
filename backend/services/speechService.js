const fs = require('fs/promises');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const env = require('../config/env');
const ApiError = require('../utils/apiError');
const openaiService = require('./openaiService');
const translationService = require('./translationService');

async function speechToText({ filePath, language, prompt }) {
  if (!filePath) {
    throw new ApiError(400, 'Audio file is required.');
  }

  const transcript = await openaiService.transcribeAudio(filePath, {
    language,
    prompt,
  });

  const detectedLanguage = transcript
    ? await openaiService.detectLanguage(transcript)
    : language || 'Unknown';

  return {
    transcript,
    detectedLanguage,
  };
}

async function convertTextToSpeech({ text, voice, responseFormat, instructions }) {
  if (!text) {
    throw new ApiError(400, 'text is required.');
  }

  const audioBuffer = await openaiService.textToSpeech({
    text,
    voice,
    responseFormat,
    instructions,
  });

  const extension = responseFormat || 'mp3';
  const fileName = `${uuidv4()}.${extension}`;
  const outputPath = path.join(env.paths.tempAudio, fileName);

  await fs.writeFile(outputPath, audioBuffer);

  return {
    fileName,
    filePath: outputPath,
    mimeType: `audio/${extension}`,
    audioBase64: audioBuffer.toString('base64'),
  };
}

async function braceletPipeline({
  user,
  filePath,
  sourceLanguage,
  targetLanguage,
  voice,
  responseFormat,
}) {
  if (!filePath) {
    throw new ApiError(400, 'Audio file is required for bracelet processing.');
  }

  if (!targetLanguage) {
    throw new ApiError(400, 'targetLanguage is required.');
  }

  const transcription = await speechToText({
    filePath,
    language: sourceLanguage,
  });

  const translation = await translationService.translate({
    user,
    text: transcription.transcript,
    sourceLanguage: transcription.detectedLanguage,
    targetLanguage,
  });

  const spokenResponse = await convertTextToSpeech({
    text: translation.translatedText,
    voice,
    responseFormat,
    instructions:
      'Speak clearly and naturally for a tourism wearable device response.',
  });

  return {
    transcript: transcription.transcript,
    sourceLanguage: transcription.detectedLanguage,
    targetLanguage,
    translatedText: translation.translatedText,
    audio: spokenResponse,
  };
}

module.exports = {
  speechToText,
  convertTextToSpeech,
  braceletPipeline,
};
