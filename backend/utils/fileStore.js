const fs = require('fs/promises');
const path = require('path');
const env = require('../config/env');

const initialFiles = [
  {
    filePath: env.paths.users,
    defaultValue: {
      users: [],
    },
  },
  {
    filePath: env.paths.sessions,
    defaultValue: {
      revokedTokens: [],
      passwordResetTokens: [],
    },
  },
  {
    filePath: env.paths.history,
    defaultValue: {
      chatMessages: [],
      translations: [],
      visitedPlaces: [],
      recommendations: [],
    },
  },
];

async function ensureDirectory(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function ensureJsonFile(filePath, defaultValue) {
  try {
    await fs.access(filePath);
  } catch (_error) {
    await fs.writeFile(filePath, JSON.stringify(defaultValue, null, 2), 'utf8');
  }
}

async function initializeStorage() {
  await Promise.all([
    ensureDirectory(env.paths.storage),
    ensureDirectory(env.paths.uploads),
    ensureDirectory(env.paths.uploadAudio),
    ensureDirectory(env.paths.temp),
    ensureDirectory(env.paths.tempAudio),
  ]);

  await Promise.all(
    initialFiles.map((entry) => ensureJsonFile(entry.filePath, entry.defaultValue))
  );

  await ensureJsonFile(
    path.join(env.paths.storage, '.keep.json'),
    { note: 'Storage bootstrap marker' }
  );
}

async function readJson(filePath, fallback) {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (_error) {
    return fallback;
  }
}

async function writeJson(filePath, value) {
  await fs.writeFile(filePath, JSON.stringify(value, null, 2), 'utf8');
  return value;
}

module.exports = {
  initializeStorage,
  readJson,
  writeJson,
};
