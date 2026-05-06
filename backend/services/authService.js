const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const env = require('../config/env');
const ApiError = require('../utils/apiError');
const userModel = require('../models/userModel');
const sessionModel = require('../models/sessionModel');
const emailService = require('./emailService');

const OTP_LENGTH = 6;
const OTP_RESEND_COOLDOWN_MS = 1000 * 60;
const EMAIL_VERIFICATION_TTL_MS = 1000 * 60 * 15;
const PASSWORD_RESET_OTP_TTL_MS = 1000 * 60 * 15;
const PASSWORD_RESET_SESSION_TTL_MS = 1000 * 60 * 15;
const MAX_PASSWORD_RESET_ATTEMPTS = 5;

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function generateSixDigitCode() {
  const min = 10 ** (OTP_LENGTH - 1);
  const max = (10 ** OTP_LENGTH) - 1;
  return String(Math.floor(min + Math.random() * (max - min + 1)));
}

function hashCode(code) {
  return crypto.createHash('sha256').update(String(code)).digest('hex');
}

function createOtpMetadata(expiresInMs) {
  return {
    sentAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + expiresInMs).toISOString(),
    resendAvailableAt: new Date(Date.now() + OTP_RESEND_COOLDOWN_MS).toISOString(),
  };
}

function ensureResendAllowed(resendAvailableAt) {
  const remainingMs = new Date(resendAvailableAt || 0).getTime() - Date.now();

  if (remainingMs > 0) {
    throw new ApiError(
      429,
      `Please wait ${Math.ceil(remainingMs / 1000)} seconds before requesting a new code.`
    );
  }
}

function buildOtpPayload({ email, expiresAt, resendAvailableAt, purpose }) {
  return {
    email,
    purpose,
    otpLength: OTP_LENGTH,
    expiresAt,
    resendAvailableAt,
  };
}

function buildToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    env.jwtSecret,
    {
      expiresIn: env.jwtExpiresIn,
    }
  );
}

function sanitizeUser(user) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    emailVerified: user.emailVerified !== false,
    createdAt: user.createdAt,
  };
}

async function register({ fullName, email, password }) {
  if (!fullName || !email || !password) {
    throw new ApiError(400, 'fullName, email, and password are required.');
  }

  const normalizedEmail = normalizeEmail(email);
  const existingUser = await userModel.findByEmail(normalizedEmail);
  const passwordHash = await bcrypt.hash(password, 10);
  const verificationCode = generateSixDigitCode();
  const { sentAt, expiresAt, resendAvailableAt } = createOtpMetadata(
    EMAIL_VERIFICATION_TTL_MS
  );
  let user;

  if (existingUser && existingUser.emailVerified !== false) {
    throw new ApiError(409, 'A user with this email already exists.');
  }

  if (existingUser) {
    user = await userModel.updateUser(existingUser.id, {
      fullName,
      passwordHash,
      emailVerificationCodeHash: hashCode(verificationCode),
      emailVerificationExpiresAt: expiresAt,
      emailVerificationSentAt: sentAt,
      emailVerificationResendAvailableAt: resendAvailableAt,
    });
  } else {
    user = await userModel.createUser({
      fullName,
      email: normalizedEmail,
      passwordHash,
    });

    user = await userModel.updateUser(user.id, {
      emailVerificationCodeHash: hashCode(verificationCode),
      emailVerificationExpiresAt: expiresAt,
      emailVerificationSentAt: sentAt,
      emailVerificationResendAvailableAt: resendAvailableAt,
    });
  }

  await emailService.sendEmailVerificationEmail({
    to: normalizedEmail,
    fullName,
    verificationCode,
    expiresAt,
  });

  return {
    user: sanitizeUser({
      ...user,
      emailVerified: false,
    }),
    requiresEmailVerification: true,
    ...buildOtpPayload({
      email: normalizedEmail,
      expiresAt,
      resendAvailableAt,
      purpose: 'signup_verification',
    }),
  };
}

async function login({ email, password }) {
  if (!email || !password) {
    throw new ApiError(400, 'email and password are required.');
  }

  const user = await userModel.findByEmail(normalizeEmail(email));

  if (!user) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  if (user.emailVerified === false) {
    throw new ApiError(
      403,
      'Your email is not verified yet.',
      'Please check your email for the verification code, then verify your account before logging in.'
    );
  }

  const token = buildToken(user);

  return {
    user: sanitizeUser(user),
    token,
  };
}

async function logout(token) {
  if (!token) {
    throw new ApiError(400, 'Authorization token is required for logout.');
  }

  await sessionModel.addRevokedToken(token);
}

async function forgotPassword({ email }) {
  if (!email) {
    throw new ApiError(400, 'email is required.');
  }

  const normalizedEmail = normalizeEmail(email);
  const user = await userModel.findByEmail(normalizedEmail);

  if (!user) {
    const { expiresAt, resendAvailableAt } = createOtpMetadata(PASSWORD_RESET_OTP_TTL_MS);
    return {
      email: normalizedEmail,
      resetRequested: true,
      delivery: 'email',
      ...buildOtpPayload({
        email: normalizedEmail,
        expiresAt,
        resendAvailableAt,
        purpose: 'password_reset',
      }),
    };
  }

  const activeRequest = await sessionModel.findResetTokenByUserId(user.id);

  if (activeRequest && !activeRequest.usedAt && activeRequest.resendAvailableAt) {
    ensureResendAllowed(activeRequest.resendAvailableAt);
  }

  const code = generateSixDigitCode();
  const { sentAt, expiresAt, resendAvailableAt } = createOtpMetadata(
    PASSWORD_RESET_OTP_TTL_MS
  );

  await sessionModel.saveOrReplaceResetToken({
    id: uuidv4(),
    userId: user.id,
    codeHash: hashCode(code),
    createdAt: sentAt,
    sentAt,
    expiresAt,
    resendAvailableAt,
    attemptCount: 0,
  });

  await emailService.sendPasswordResetEmail({
    to: user.email,
    resetCode: code,
    expiresAt,
  });

  return {
    email: user.email,
    resetRequested: true,
    delivery: 'email',
    ...buildOtpPayload({
      email: user.email,
      expiresAt,
      resendAvailableAt,
      purpose: 'password_reset',
    }),
  };
}

async function verifyEmail({ email, code }) {
  if (!email || !code) {
    throw new ApiError(400, 'email and code are required.');
  }

  const user = await userModel.findByEmail(normalizeEmail(email));

  if (!user) {
    throw new ApiError(404, 'No account was found for this email.');
  }

  if (user.emailVerified !== false) {
    return {
      user: sanitizeUser(user),
      alreadyVerified: true,
      token: buildToken(user),
    };
  }

  if (!user.emailVerificationCodeHash || !user.emailVerificationExpiresAt) {
    throw new ApiError(400, 'No verification code is active for this account.');
  }

  if (new Date(user.emailVerificationExpiresAt).getTime() < Date.now()) {
    throw new ApiError(400, 'This verification code has expired.');
  }

  if (hashCode(code) !== user.emailVerificationCodeHash) {
    throw new ApiError(400, 'Invalid verification code.');
  }

  const updatedUser = await userModel.updateUser(user.id, {
    emailVerified: true,
    emailVerificationCodeHash: null,
    emailVerificationExpiresAt: null,
    emailVerificationSentAt: null,
    emailVerificationResendAvailableAt: null,
  });

  return {
    user: sanitizeUser(updatedUser),
    token: buildToken(updatedUser),
    verified: true,
  };
}

async function resendVerificationCode({ email }) {
  if (!email) {
    throw new ApiError(400, 'email is required.');
  }

  const user = await userModel.findByEmail(normalizeEmail(email));

  if (!user) {
    throw new ApiError(404, 'No account was found for this email.');
  }

  if (user.emailVerified !== false) {
    return {
      email: user.email,
      alreadyVerified: true,
    };
  }

  ensureResendAllowed(user.emailVerificationResendAvailableAt);

  const verificationCode = generateSixDigitCode();
  const { sentAt, expiresAt, resendAvailableAt } = createOtpMetadata(
    EMAIL_VERIFICATION_TTL_MS
  );

  await userModel.updateUser(user.id, {
    emailVerificationCodeHash: hashCode(verificationCode),
    emailVerificationExpiresAt: expiresAt,
    emailVerificationSentAt: sentAt,
    emailVerificationResendAvailableAt: resendAvailableAt,
  });

  await emailService.sendEmailVerificationEmail({
    to: user.email,
    fullName: user.fullName,
    verificationCode,
    expiresAt,
  });

  return {
    email: user.email,
    resent: true,
    ...buildOtpPayload({
      email: user.email,
      expiresAt,
      resendAvailableAt,
      purpose: 'signup_verification',
    }),
  };
}

async function verifyPasswordResetCode({ email, code }) {
  if (!email || !code) {
    throw new ApiError(400, 'email and code are required.');
  }

  const user = await userModel.findByEmail(normalizeEmail(email));

  if (!user) {
    throw new ApiError(400, 'Invalid reset code.');
  }

  const resetRequest = await sessionModel.findResetTokenByUserId(user.id);

  if (!resetRequest || resetRequest.usedAt) {
    throw new ApiError(400, 'No password reset code is active for this email.');
  }

  if (new Date(resetRequest.expiresAt).getTime() < Date.now()) {
    throw new ApiError(400, 'This password reset code has expired.');
  }

  if ((resetRequest.attemptCount || 0) >= MAX_PASSWORD_RESET_ATTEMPTS) {
    throw new ApiError(429, 'Too many incorrect attempts. Please request a new code.');
  }

  if (hashCode(code) !== resetRequest.codeHash) {
    await sessionModel.updateResetToken(resetRequest.id, {
      attemptCount: (resetRequest.attemptCount || 0) + 1,
    });
    throw new ApiError(400, 'Invalid reset code.');
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpiresAt = new Date(
    Date.now() + PASSWORD_RESET_SESSION_TTL_MS
  ).toISOString();

  await sessionModel.updateResetToken(resetRequest.id, {
    verifiedAt: new Date().toISOString(),
    resetTokenHash: hashCode(resetToken),
    resetTokenExpiresAt,
  });

  return {
    verified: true,
    resetToken,
    email: user.email,
    resetTokenExpiresAt,
  };
}

async function resetPassword({ resetToken, newPassword }) {
  const effectiveToken = String(resetToken || '').trim();

  if (!effectiveToken || !newPassword) {
    throw new ApiError(400, 'resetToken and newPassword are required.');
  }

  if (String(newPassword).length < 6) {
    throw new ApiError(400, 'newPassword must be at least 6 characters.');
  }

  const tokenRecord = await sessionModel.findResetTokenByResetTokenHash(
    hashCode(effectiveToken)
  );

  if (!tokenRecord) {
    throw new ApiError(400, 'Invalid password reset session.');
  }

  if (tokenRecord.usedAt) {
    throw new ApiError(400, 'This password reset session has already been used.');
  }

  if (!tokenRecord.resetTokenExpiresAt || new Date(tokenRecord.resetTokenExpiresAt).getTime() < Date.now()) {
    throw new ApiError(400, 'This password reset session has expired.');
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  const updatedUser = await userModel.updatePassword(tokenRecord.userId, passwordHash);

  if (!updatedUser) {
    throw new ApiError(404, 'User associated with this reset token was not found.');
  }

  await sessionModel.updateResetToken(tokenRecord.id, {
    usedAt: new Date().toISOString(),
    codeHash: null,
    resetTokenHash: null,
    resetTokenExpiresAt: null,
  });
}

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
