const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const env = require('./env');

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: env.firebaseProjectId,
      clientEmail: env.firebaseClientEmail,
      // Handle escaped newlines from .env files
      privateKey: env.firebasePrivateKey?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

module.exports = { db };
