const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/response');
const authService = require('../services/authService');

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  return success(res, 201, 'User registered successfully.', result);
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  return success(res, 200, 'Login successful.', result);
});

const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.token);
  return success(res, 200, 'Logout successful.');
});

const verifyEmail = asyncHandler(async (req, res) => {
  const result = await authService.verifyEmail(req.body);
  return success(res, 200, 'Email verified successfully.', result);
});

const resendVerificationCode = asyncHandler(async (req, res) => {
  const result = await authService.resendVerificationCode(req.body);
  return success(res, 200, 'Verification code sent successfully.', result);
});

const forgotPassword = asyncHandler(async (req, res) => {
  const result = await authService.forgotPassword(req.body);
  return success(res, 200, 'Password reset request processed.', result);
});

const verifyPasswordResetCode = asyncHandler(async (req, res) => {
  const result = await authService.verifyPasswordResetCode(req.body);
  return success(res, 200, 'Password reset code verified.', result);
});

const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.body);
  return success(res, 200, 'Password updated successfully.');
});

module.exports = {
  register,
  login,
  logout,
  verifyEmail,
  resendVerificationCode,
  forgotPassword,
  verifyPasswordResetCode,
  resetPassword,
};
