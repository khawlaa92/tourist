const env = require('../config/env');
const { isMongoConnected } = require('../config/db');
const { SessionStore } = require('./mongoModels');
const { readJson, writeJson } = require('../utils/fileStore');

async function getMongoSessionStore() {
  let store = await SessionStore.findOne({ key: 'default' });

  if (!store) {
    store = await SessionStore.create({
      key: 'default',
      revokedTokens: [],
      passwordResetTokens: [],
    });
  }

  return store;
}

async function getSessionStore() {
  return readJson(env.paths.sessions, {
    revokedTokens: [],
    passwordResetTokens: [],
  });
}

async function saveSessionStore(store) {
  return writeJson(env.paths.sessions, store);
}

async function addRevokedToken(token) {
  if (env.useMongo && isMongoConnected()) {
    const store = await getMongoSessionStore();
    store.revokedTokens.push({
      token,
      revokedAt: new Date().toISOString(),
    });
    await store.save();
    return;
  }

  const store = await getSessionStore();
  store.revokedTokens.push({
    token,
    revokedAt: new Date().toISOString(),
  });
  await saveSessionStore(store);
}

async function isTokenRevoked(token) {
  if (env.useMongo && isMongoConnected()) {
    const store = await getMongoSessionStore();
    return store.revokedTokens.some((entry) => entry.token === token);
  }

  const store = await getSessionStore();
  return store.revokedTokens.some((entry) => entry.token === token);
}

async function saveResetToken(record) {
  if (env.useMongo && isMongoConnected()) {
    const store = await getMongoSessionStore();
    store.passwordResetTokens.push(record);
    await store.save();
    return;
  }

  const store = await getSessionStore();
  store.passwordResetTokens.push(record);
  await saveSessionStore(store);
}

async function saveOrReplaceResetToken(record) {
  if (env.useMongo && isMongoConnected()) {
    const store = await getMongoSessionStore();
    store.passwordResetTokens = store.passwordResetTokens.filter(
      (entry) => entry.userId !== record.userId || entry.usedAt
    );
    store.passwordResetTokens.push(record);
    await store.save();
    return record;
  }

  const store = await getSessionStore();
  store.passwordResetTokens = store.passwordResetTokens.filter(
    (entry) => entry.userId !== record.userId || entry.usedAt
  );
  store.passwordResetTokens.push(record);
  await saveSessionStore(store);
  return record;
}

async function findResetToken(token) {
  if (env.useMongo && isMongoConnected()) {
    const store = await getMongoSessionStore();
    return store.passwordResetTokens.find((entry) => entry.token === token) || null;
  }

  const store = await getSessionStore();
  return store.passwordResetTokens.find((entry) => entry.token === token) || null;
}

async function findResetTokenByUserId(userId) {
  if (env.useMongo && isMongoConnected()) {
    const store = await getMongoSessionStore();
    const matches = store.passwordResetTokens.filter((entry) => entry.userId === userId);
    return matches[matches.length - 1] || null;
  }

  const store = await getSessionStore();
  const matches = store.passwordResetTokens.filter((entry) => entry.userId === userId);
  return matches[matches.length - 1] || null;
}

async function findResetTokenByResetTokenHash(resetTokenHash) {
  if (env.useMongo && isMongoConnected()) {
    const store = await getMongoSessionStore();
    return (
      store.passwordResetTokens.find((entry) => entry.resetTokenHash === resetTokenHash) || null
    );
  }

  const store = await getSessionStore();
  return store.passwordResetTokens.find((entry) => entry.resetTokenHash === resetTokenHash) || null;
}

async function updateResetToken(recordId, updates) {
  if (env.useMongo && isMongoConnected()) {
    const store = await getMongoSessionStore();
    const tokenEntry = store.passwordResetTokens.find((entry) => entry.id === recordId);

    if (!tokenEntry) {
      return null;
    }

    Object.assign(tokenEntry, updates);
    await store.save();
    return tokenEntry;
  }

  const store = await getSessionStore();
  const tokenEntry = store.passwordResetTokens.find((entry) => entry.id === recordId);

  if (!tokenEntry) {
    return null;
  }

  Object.assign(tokenEntry, updates);
  await saveSessionStore(store);
  return tokenEntry;
}

async function markResetTokenUsed(token) {
  if (env.useMongo && isMongoConnected()) {
    const store = await getMongoSessionStore();
    const tokenEntry = store.passwordResetTokens.find((entry) => entry.token === token);

    if (!tokenEntry) {
      return null;
    }

    tokenEntry.usedAt = new Date().toISOString();
    await store.save();
    return tokenEntry;
  }

  const store = await getSessionStore();
  const tokenEntry = store.passwordResetTokens.find((entry) => entry.token === token);

  if (!tokenEntry) {
    return null;
  }

  tokenEntry.usedAt = new Date().toISOString();
  await saveSessionStore(store);
  return tokenEntry;
}

module.exports = {
  addRevokedToken,
  isTokenRevoked,
  saveResetToken,
  saveOrReplaceResetToken,
  findResetToken,
  findResetTokenByUserId,
  findResetTokenByResetTokenHash,
  updateResetToken,
  markResetTokenUsed,
};
