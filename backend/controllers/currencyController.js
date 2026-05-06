const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/response');
const currencyService = require('../services/currencyService');

const convertCurrency = asyncHandler(async (req, res) => {
  const result = await currencyService.convertCurrency(req.query);
  return success(res, 200, 'Currency converted successfully.', result);
});

module.exports = {
  convertCurrency,
};
