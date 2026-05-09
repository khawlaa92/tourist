const crypto = require('crypto');
const { db } = require('../config/firebase');
const { FieldValue } = require('firebase-admin/firestore');

const revokedCol = () => db.collection('revokedTokens');
const resetCol = () => db.collection('passwordResetTokens');

/**
 * Hash the token to produce a safe Firestore document ID.
 * Tokens can contain characters that are invalid in doc IDs.
 */
function tokenDocId(token) {
  return crypto.createHash('sha256').update(String(token)).digest('hex');
}

// ─── Revoked tokens ──────────────────────────────────────────────────────────

async function addRevokedToken(token) {
  await revokedCol().doc(tokenDocId(token)).set({
    token,
    revokedAt: new Date().toISOString(),
  });
}

async function isTokenRevoked(token) {
  const doc = await revokedCol().doc(tokenDocId(token)).get();
  return doc.exists;
}

// ─── Password reset tokens ───────────────────────────────────────────────────

async function saveResetToken(record) {
  await resetCol().doc(record.id).set(record);
}

async function saveOrReplaceResetToken(record) {
  // Remove any active (unused) tokens for this user
  const existing = await resetCol()
    .where('userId', '==', record.userId)
    .get();

  const batch = db.batch();

  existing.docs.forEach((d) => {
    if (!d.data().usedAt) {
      batch.delete(d.ref);
    }
  });

  batch.set(resetCol().doc(record.id), record);
  await batch.commit();
  return record;
}

async function findResetToken(token) {
  const snap = await resetCol().where('token', '==', token).limit(1).get();
  if (snap.empty) return null;
  const doc = snap.docs[0];
  return { id: doc.id, ...doc.data() };
}

async function findResetTokenByUserId(userId) {
  const snap = await resetCol()
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .limit(1)
    .get();

  if (snap.empty) return null;
  const doc = snap.docs[0];
  return { id: doc.id, ...doc.data() };
}

async function findResetTokenByResetTokenHash(resetTokenHash) {
  const snap = await resetCol()
    .where('resetTokenHash', '==', resetTokenHash)
    .limit(1)
    .get();

  if (snap.empty) return null;
  const doc = snap.docs[0];
  return { id: doc.id, ...doc.data() };
}

async function updateResetToken(recordId, updates) {
  const ref = resetCol().doc(recordId);
  await ref.update(updates);
  const doc = await ref.get();
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
}

async function markResetTokenUsed(token) {
  const record = await findResetToken(token);
  if (!record) return null;
  return updateResetToken(record.id, { usedAt: new Date().toISOString() });
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
