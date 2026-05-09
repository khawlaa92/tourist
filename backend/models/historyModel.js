const { db } = require('../config/firebase');
const { FieldValue } = require('firebase-admin/firestore');

/**
 * History is stored as a single shared Firestore document.
 * Document ID: 'default' in the 'history' collection.
 */
const docRef = () => db.collection('history').doc('default');

const DEFAULTS = {
  chatMessages: [],
  translations: [],
  visitedPlaces: [],
  recommendations: [],
};

async function getHistoryStore() {
  const doc = await docRef().get();
  return doc.exists ? doc.data() : { ...DEFAULTS };
}

async function appendToField(field, entry) {
  await docRef().set(
    { [field]: FieldValue.arrayUnion(entry) },
    { merge: true }
  );
  return entry;
}

async function addChatMessage(entry) {
  return appendToField('chatMessages', entry);
}

async function addTranslation(entry) {
  return appendToField('translations', entry);
}

async function addVisitedPlace(entry) {
  return appendToField('visitedPlaces', entry);
}

async function addRecommendation(entry) {
  return appendToField('recommendations', entry);
}

module.exports = {
  getHistoryStore,
  addChatMessage,
  addTranslation,
  addVisitedPlace,
  addRecommendation,
};
