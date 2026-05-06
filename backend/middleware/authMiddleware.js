const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');
const userModel = require('../models/userModel');
const sessionModel = require('../models/sessionModel');

const protect = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization || '';

  if (!authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Authorization token is required.');
  }

  const token = authHeader.replace('Bearer ', '').trim();

  if (await sessionModel.isTokenRevoked(token)) {
    throw new ApiError(401, 'This session has already been logged out.');
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await userModel.findById(decoded.userId);

    if (!user) {
      throw new ApiError(401, 'User not found for this token.');
    }

    req.user = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
    };
    req.token = token;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(401, 'Invalid or expired authorization token.');
  }
});

module.exports = {
  protect,
};
