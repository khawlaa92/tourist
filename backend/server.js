require('./config/loadEnv');
const logger = require('./utils/logger');
const { connectToDatabase } = require('./config/db');

if (!process.env.OPENAI_API_KEY) {
  logger.warn('OPENAI_API_KEY is not set. The backend will use mock AI responses where supported until backend/.env is updated.');
}

const app = require('./app');
const env = require('./config/env');
const { initializeStorage } = require('./utils/fileStore');

async function bootstrap() {
  try {
    await connectToDatabase();
    await initializeStorage();

    const server = app.listen(env.port, () => {
      logger.info(`Backend running on port ${env.port}`);
    });

    server.on('error', (error) => {
      if (error && error.code === 'EADDRINUSE') {
        logger.error(`Port ${env.port} is already in use. Stop the existing server or change PORT in backend/.env.`);
        return process.exit(1);
      }

      logger.error('Server failed after startup', error);
      process.exit(1);
    });
  } catch (error) {
    logger.error('Failed to start backend', error);
    process.exit(1);
  }
}

bootstrap();
