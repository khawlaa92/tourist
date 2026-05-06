const env = require('../config/env');
const { isMongoConnected } = require('../config/db');
const { HistoryStore } = require('./mongoModels');
const { readJson, writeJson } = require('../utils/fileStore');

async function getMongoHistoryStore() {
  let store = await HistoryStore.findOne({ key: 'default' });

  if (!store) {
    store = await HistoryStore.create({
      key: 'default',
      chatMessages: [],
      translations: [],
      visitedPlaces: [],
      recommendations: [],
    });
  }

  return store;
}

async function getHistoryStore() {
  if (env.useMongo && isMongoConnected()) {
    const store = await getMongoHistoryStore();
    return store.toObject();
  }

  return readJson(env.paths.history, {
    chatMessages: [],
    translations: [],
    visitedPlaces: [],
    recommendations: [],
  });
}

async function saveHistoryStore(store) {
  return writeJson(env.paths.history, store);
}

async function addChatMessage(entry) {
  if (env.useMongo && isMongoConnected()) {
    const store = await getMongoHistoryStore();
    store.chatMessages.push(entry);
    await store.save();
    return entry;
  }

  const store = await getHistoryStore();
  store.chatMessages.push(entry);
  await saveHistoryStore(store);
  return entry;
}

async function addTranslation(entry) {
  if (env.useMongo && isMongoConnected()) {
    const store = await getMongoHistoryStore();
    store.translations.push(entry);
    await store.save();
    return entry;
  }

  const store = await getHistoryStore();
  store.translations.push(entry);
  await saveHistoryStore(store);
  return entry;
}

async function addVisitedPlace(entry) {
  if (env.useMongo && isMongoConnected()) {
    const store = await getMongoHistoryStore();
    store.visitedPlaces.push(entry);
    await store.save();
    return entry;
  }

  const store = await getHistoryStore();
  store.visitedPlaces.push(entry);
  await saveHistoryStore(store);
  return entry;
}

async function addRecommendation(entry) {
  if (env.useMongo && isMongoConnected()) {
    const store = await getMongoHistoryStore();
    store.recommendations.push(entry);
    await store.save();
    return entry;
  }

  const store = await getHistoryStore();
  store.recommendations.push(entry);
  await saveHistoryStore(store);
  return entry;
}

module.exports = {
  getHistoryStore,
  addChatMessage,
  addTranslation,
  addVisitedPlace,
  addRecommendation,
};
