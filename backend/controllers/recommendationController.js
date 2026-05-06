const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/response');
const recommendationService = require('../services/recommendationService');

const recommend = asyncHandler(async (req, res) => {
  const result = await recommendationService.recommend({
    user: req.user,
    lat: req.body.lat,
    lng: req.body.lng,
    preferences: req.body.preferences || [],
  });

  return success(res, 200, 'Recommendations generated successfully.', result);
});

module.exports = {
  recommend,
};
