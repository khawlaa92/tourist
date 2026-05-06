const nodemailer = require('nodemailer');
const env = require('../config/env');
const ApiError = require('../utils/apiError');

function createTransporter() {
  if (!env.smtpHost || !env.smtpPort || !env.smtpUser || !env.smtpPass || !env.smtpFromEmail) {
    throw new ApiError(
      500,
      'Email service is not configured.',
      'Configure SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and SMTP_FROM_EMAIL in backend/.env.'
    );
  }

  return nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpSecure,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass,
    },
  });
}

function buildFromAddress() {
  return env.smtpFromName
    ? `"${env.smtpFromName}" <${env.smtpFromEmail}>`
    : env.smtpFromEmail;
}

async function sendMail(payload) {
  const transporter = createTransporter();

  try {
    await transporter.sendMail({
      from: buildFromAddress(),
      ...payload,
    });
  } catch (error) {
    if (error && (error.responseCode === 535 || error.code === 'EAUTH')) {
      throw new ApiError(
        500,
        'Email sending failed: SMTP authentication was rejected.',
        'Check SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and verify that SMTP_FROM_EMAIL is approved by your email provider.'
      );
    }

    throw error;
  }
}

async function sendEmailVerificationEmail({ to, fullName, verificationCode, expiresAt }) {
  await sendMail({
    to,
    subject: 'TourAssist AI - Verify Your Email',
    text: [
      `Hello ${fullName || 'traveler'},`,
      '',
      'Welcome to TourAssist AI.',
      `Your verification code is: ${verificationCode}`,
      '',
      `This code expires at: ${expiresAt}`,
      '',
      'If you did not create this account, you can ignore this email.',
    ].join('\n'),
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1a1a1a;">
        <h2 style="color: #c41e3a;">Verify Your TourAssist AI Account</h2>
        <p>Hello ${fullName || 'traveler'},</p>
        <p>Welcome to TourAssist AI.</p>
        <p>Your verification code is:</p>
        <p style="font-size: 28px; font-weight: 700; letter-spacing: 4px; color: #c41e3a;">${verificationCode}</p>
        <p><strong>Expires at:</strong> ${expiresAt}</p>
        <p>If you did not create this account, you can ignore this email.</p>
      </div>
    `,
  });
}

async function sendPasswordResetEmail({ to, resetCode, expiresAt }) {
  await sendMail({
    to,
    subject: 'TourAssist AI - Password Reset Code',
    text: [
      'You requested a password reset for your TourAssist AI account.',
      '',
      `Reset code: ${resetCode}`,
      '',
      `This code expires at: ${expiresAt}`,
      '',
      'If you did not request this, you can ignore this email.',
    ].join('\n'),
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1a1a1a;">
        <h2 style="color: #c41e3a;">TourAssist AI Password Reset</h2>
        <p>You requested a password reset for your TourAssist AI account.</p>
        <p>Your reset code is:</p>
        <p style="font-size: 28px; font-weight: 700; letter-spacing: 4px; color: #c41e3a;">${resetCode}</p>
        <p><strong>Expires at:</strong> ${expiresAt}</p>
        <p>If you did not request this, you can ignore this email.</p>
      </div>
    `,
  });
}

module.exports = {
  sendEmailVerificationEmail,
  sendPasswordResetEmail,
};
