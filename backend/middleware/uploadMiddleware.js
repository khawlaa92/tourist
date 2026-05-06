const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const env = require('../config/env');
const ApiError = require('../utils/apiError');

const allowedAudioExtensions = new Set([
  '.aac',
  '.flac',
  '.mp3',
  '.mp4',
  '.wav',
  '.m4a',
  '.webm',
  '.mpeg',
  '.mpga',
]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, env.paths.uploadAudio);
  },
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname || '').toLowerCase() || '.webm';
    cb(null, `${uuidv4()}${extension}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const extension = path.extname(file.originalname || '').toLowerCase();

  if (!allowedAudioExtensions.has(extension)) {
    cb(new ApiError(400, 'Unsupported audio format.'));
    return;
  }

  cb(null, true);
};

const uploadAudio = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 15 * 1024 * 1024,
  },
});

module.exports = {
  uploadAudio,
};
