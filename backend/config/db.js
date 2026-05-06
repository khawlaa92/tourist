const mongoose = require('mongoose');
const env = require('./env');
const logger = require('../utils/logger');

async function connectToDatabase() {
  if (!env.useMongo) {
    logger.info('MongoDB is disabled. Using JSON file storage.');
    return false;
  }

  if (!env.mongoUri) {
    logger.warn('USE_MONGODB is enabled but MONGODB_URI is missing. Falling back to JSON file storage.');
    return false;
  }

  if (mongoose.connection.readyState === 1) {
    return true;
  }

  try {
    await mongoose.connect(env.mongoUri, {
      dbName: env.mongoDbName || undefined,
      serverSelectionTimeoutMS: 5000,
    });
    logger.info('MongoDB connected successfully.');
    return true;
  } catch (error) {
    logger.error('MongoDB connection failed. Falling back to JSON file storage.', error);
    return false;
  }
}

function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}

module.exports = {
  connectToDatabase,
  isMongoConnected,
};
