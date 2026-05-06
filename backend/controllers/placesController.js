const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/response');
const placesService = require('../services/placesService');

const getNearbyPlaces = asyncHandler(async (req, res) => {
  const result = await placesService.getNearbyPlaces(req.query);
  return success(res, 200, 'Nearby places fetched successfully.', result);
});

const recordVisitedPlace = asyncHandler(async (req, res) => {
  const result = await placesService.recordVisitedPlace({
    user: req.user,
    ...req.body,
  });

  return success(res, 201, 'Visited place recorded successfully.', result);
});

module.exports = {
  getNearbyPlaces,
  recordVisitedPlace,
};
