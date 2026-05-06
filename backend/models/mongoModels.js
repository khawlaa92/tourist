const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationCodeHash: String,
    emailVerificationExpiresAt: String,
    emailVerificationSentAt: String,
    emailVerificationResendAvailableAt: String,
    createdAt: String,
    updatedAt: String,
  },
  {
    versionKey: false,
  }
);

const revokedTokenSchema = new mongoose.Schema(
  {
    token: String,
    revokedAt: String,
  },
  { _id: false }
);

const passwordResetTokenSchema = new mongoose.Schema(
  {
    id: String,
    userId: String,
    codeHash: String,
    createdAt: String,
    sentAt: String,
    expiresAt: String,
    resendAvailableAt: String,
    attemptCount: {
      type: Number,
      default: 0,
    },
    verifiedAt: String,
    resetTokenHash: String,
    resetTokenExpiresAt: String,
    usedAt: String,
  },
  { _id: false }
);

const sessionStoreSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: 'default',
      unique: true,
    },
    revokedTokens: {
      type: [revokedTokenSchema],
      default: [],
    },
    passwordResetTokens: {
      type: [passwordResetTokenSchema],
      default: [],
    },
  },
  {
    versionKey: false,
  }
);

const historyEntrySchema = new mongoose.Schema({}, { _id: false, strict: false });

const historyStoreSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: 'default',
      unique: true,
    },
    chatMessages: {
      type: [historyEntrySchema],
      default: [],
    },
    translations: {
      type: [historyEntrySchema],
      default: [],
    },
    visitedPlaces: {
      type: [historyEntrySchema],
      default: [],
    },
    recommendations: {
      type: [historyEntrySchema],
      default: [],
    },
  },
  {
    versionKey: false,
  }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
const SessionStore =
  mongoose.models.SessionStore || mongoose.model('SessionStore', sessionStoreSchema);
const HistoryStore =
  mongoose.models.HistoryStore || mongoose.model('HistoryStore', historyStoreSchema);

module.exports = {
  User,
  SessionStore,
  HistoryStore,
};
