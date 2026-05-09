const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/firebase');

const col = () => db.collection('users');

async function findByEmail(email) {
  const snap = await col()
    .where('email', '==', email.toLowerCase())
    .limit(1)
    .get();

  if (snap.empty) return null;
  const doc = snap.docs[0];
  return { id: doc.id, ...doc.data() };
}

async function findById(userId) {
  const doc = await col().doc(userId).get();
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
}

async function createUser({ fullName, email, passwordHash }) {
  const userId = uuidv4();
  const user = {
    fullName,
    email: email.toLowerCase(),
    passwordHash,
    emailVerified: false,
    createdAt: new Date().toISOString(),
  };

  await col().doc(userId).set(user);
  return { id: userId, ...user };
}

async function updatePassword(userId, passwordHash) {
  await col().doc(userId).update({
    passwordHash,
    updatedAt: new Date().toISOString(),
  });
  return findById(userId);
}

async function updateUser(userId, updates) {
  const nextUpdates = {
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  await col().doc(userId).update(nextUpdates);
  return findById(userId);
}

module.exports = {
  findByEmail,
  findById,
  createUser,
  updatePassword,
  updateUser,
};
