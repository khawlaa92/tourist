const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/response');
const speechService = require('../services/speechService');

const speechToText = asyncHandler(async (req, res) => {
  const result = await speechService.speechToText({
    filePath: req.file ? req.file.path : null,
    language: req.body.language,
    prompt: req.body.prompt,
  });

  return success(res, 200, 'Speech converted to text successfully.', result);
});

const textToSpeech = asyncHandler(async (req, res) => {
  const result = await speechService.convertTextToSpeech({
    text: req.body.text,
    voice: req.body.voice,
    responseFormat: req.body.responseFormat || 'mp3',
    instructions: req.body.instructions,
  });

  return success(res, 200, 'Text converted to speech successfully.', result);
});

const braceletPipeline = asyncHandler(async (req, res) => {
  const result = await speechService.braceletPipeline({
    user: req.user,
    filePath: req.file ? req.file.path : null,
    sourceLanguage: req.body.sourceLanguage,
    targetLanguage: req.body.targetLanguage,
    voice: req.body.voice,
    responseFormat: req.body.responseFormat || 'mp3',
  });

  return success(
    res,
    200,
    'Bracelet audio pipeline completed successfully.',
    result
  );
});

module.exports = {
  speechToText,
  textToSpeech,
  braceletPipeline,
};
