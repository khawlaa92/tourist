const { v4: uuidv4 } = require('uuid');
const env = require('../config/env');
const { isMongoConnected } = require('../config/db');
const { User } = require('./mongoModels');
const { readJson, writeJson } = require('../utils/fileStore');

async function getUsersStore() {
  return readJson(env.paths.users, { users: [] });
}

async function saveUsersStore(store) {
  return writeJson(env.paths.users, store);
}

async function findByEmail(email) {
  if (env.useMongo && isMongoConnected()) {
    return User.findOne({ email: email.toLowerCase() }).lean();
  }

  const store = await getUsersStore();
  return store.users.find((user) => user.email.toLowerCase() === email.toLowerCase()) || null;
}

async function findById(userId) {
  if (env.useMongo && isMongoConnected()) {
    return User.findOne({ id: userId }).lean();
  }

  const store = await getUsersStore();
  return store.users.find((user) => user.id === userId) || null;
}

async function createUser({ fullName, email, passwordHash }) {
  if (env.useMongo && isMongoConnected()) {
    const newUser = await User.create({
      id: uuidv4(),
      fullName,
      email: email.toLowerCase(),
      passwordHash,
      emailVerified: false,
      createdAt: new Date().toISOString(),
    });

    return newUser.toObject();
  }

  const store = await getUsersStore();

  const newUser = {
    id: uuidv4(),
    fullName,
    email: email.toLowerCase(),
    passwordHash,
    emailVerified: false,
    createdAt: new Date().toISOString(),
  };

  store.users.push(newUser);
  await saveUsersStore(store);
  return newUser;
}

async function updatePassword(userId, passwordHash) {
  if (env.useMongo && isMongoConnected()) {
    const user = await User.findOneAndUpdate(
      { id: userId },
      {
        passwordHash,
        updatedAt: new Date().toISOString(),
      },
      {
        new: true,
      }
    );

    return user ? user.toObject() : null;
  }

  const store = await getUsersStore();
  const userIndex = store.users.findIndex((user) => user.id === userId);

  if (userIndex === -1) {
    return null;
  }

  store.users[userIndex].passwordHash = passwordHash;
  store.users[userIndex].updatedAt = new Date().toISOString();
  await saveUsersStore(store);

  return store.users[userIndex];
}

async function updateUser(userId, updates) {
  const nextUpdates = {
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  if (env.useMongo && isMongoConnected()) {
    const user = await User.findOneAndUpdate(
      { id: userId },
      nextUpdates,
      { new: true }
    );

    return user ? user.toObject() : null;
  }

  const store = await getUsersStore();
  const userIndex = store.users.findIndex((user) => user.id === userId);

  if (userIndex === -1) {
    return null;
  }

  store.users[userIndex] = {
    ...store.users[userIndex],
    ...nextUpdates,
  };
  await saveUsersStore(store);

  return store.users[userIndex];
}

module.exports = {
  findByEmail,
  findById,
  createUser,
  updatePassword,
  updateUser,
};
