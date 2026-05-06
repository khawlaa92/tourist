const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/response');
const dashboardService = require('../services/dashboardService');

const getStats = asyncHandler(async (_req, res) => {
  const result = await dashboardService.getStats();
  return success(res, 200, 'Dashboard statistics fetched successfully.', result);
});

module.exports = {
  getStats,
};
