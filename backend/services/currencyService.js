const axios = require('axios');
const env = require('../config/env');
const ApiError = require('../utils/apiError');

function buildRateUrl(from, to) {
  const rawBaseUrl = String(env.exchangeRateApiUrl || 'https://api.frankfurter.app').trim();

  try {
    const url = new URL(rawBaseUrl);
    // Route legacy hosts to the current official Frankfurter API.
    if (url.hostname === 'api.frankfurter.app' || url.hostname === 'frankfurter.app') {
      url.hostname = 'api.frankfurter.dev';
    }
    url.pathname = `/v2/rate/${encodeURIComponent(from)}/${encodeURIComponent(to)}`;
    url.search = '';
    return url.toString();
  } catch (error) {
    return `${rawBaseUrl.replace(/\/+$/, '')}/v2/rate/${encodeURIComponent(from)}/${encodeURIComponent(to)}`;
  }
}

async function convertCurrency({ from, to, amount }) {
  if (!from || !to || !amount) {
    throw new ApiError(400, 'from, to, and amount are required.');
  }

  const parsedAmount = Number(amount);
  const normalizedFrom = from.toUpperCase();
  const normalizedTo = to.toUpperCase();

  if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
    throw new ApiError(400, 'amount must be a valid number greater than 0.');
  }

  try {
    const response = await axios.get(buildRateUrl(normalizedFrom, normalizedTo));

    const rate = response.data?.rate;

    if (typeof rate !== 'number') {
      throw new Error('Exchange rate is missing from Frankfurter response.');
    }

    const result = Number((parsedAmount * rate).toFixed(4));

    return {
      from: normalizedFrom,
      to: normalizedTo,
      amount: parsedAmount,
      result,
    };
  } catch (error) {
    console.error('Currency conversion failed:', error.response?.data || error.message || error);
    throw new Error('Failed to convert currency.');
  }
}

module.exports = {
  convertCurrency,
};
