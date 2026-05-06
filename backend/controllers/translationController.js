const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/response');
const translationService = require('../services/translationService');

const translate = asyncHandler(async (req, res) => {
  const result = await translationService.translate({
    user: req.user,
    text: req.body.text,
    sourceLanguage: req.body.sourceLanguage,
    targetLanguage: req.body.targetLanguage,
    filePath: req.file ? req.file.path : null,
    originalFileName: req.file ? req.file.originalname : null,
  });

  return success(res, 200, 'Translation completed successfully.', result);
});

module.exports = {
  translate,
};
