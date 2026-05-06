const ApiError = require('../utils/apiError');
const logger = require('../utils/logger');

function notFoundHandler(req, _res, next) {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
}

function errorHandler(error, _req, res, _next) {
  logger.error('Request failed', error);

  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: error.message || 'Internal server error.',
    details: error.details || null,
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
