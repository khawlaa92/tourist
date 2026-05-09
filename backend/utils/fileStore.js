const fs = require('fs/promises');
const env = require('../config/env');

/**
 * Creates the local temp/upload directories needed for audio processing.
 * JSON file storage has been removed — Firestore is the only database now.
 */
async function ensureDirectory(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function initializeStorage() {
  await Promise.all([
    ensureDirectory(env.paths.uploads),
    ensureDirectory(env.paths.uploadAudio),
    ensureDirectory(env.paths.temp),
    ensureDirectory(env.paths.tempAudio),
  ]);
}

module.exports = {
  initializeStorage,
};
