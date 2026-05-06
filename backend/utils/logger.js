const fs = require('fs/promises');
const env = require('../config/env');

async function write(level, message) {
  const line = `[${new Date().toISOString()}] ${level.toUpperCase()} ${message}\n`;

  try {
    await fs.appendFile(env.paths.logs, line, 'utf8');
  } catch (_error) {
    // Keep the app running even if file logging fails.
  }
}

module.exports = {
  info(message) {
    console.log(message);
    write('info', message);
  },
  warn(message) {
    console.warn(message);
    write('warn', message);
  },
  error(message, error = null) {
    const fullMessage = error ? `${message} | ${error.message}` : message;
    console.error(fullMessage);
    write('error', fullMessage);
  },
};
