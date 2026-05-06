const path = require('path');

function normalizeEnvValue(value) {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function optionalEnv(name, fallback) {
  return normalizeEnvValue(process.env[name]) || fallback;
}

function requireEnv(name, fallback) {
  const value = optionalEnv(name, fallback);

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

module.exports = {
  nodeEnv: optionalEnv('NODE_ENV', 'development'),
  port: Number(optionalEnv('PORT', 5000)),
  appBaseUrl: optionalEnv('APP_BASE_URL', 'http://localhost:5000'),
  jwtSecret: requireEnv('JWT_SECRET', null),
  jwtExpiresIn: optionalEnv('JWT_EXPIRES_IN', '7d'),
  useMongo: optionalEnv('USE_MONGODB', 'false') === 'true',
  mongoUri: optionalEnv('MONGODB_URI', ''),
  mongoDbName: optionalEnv('MONGODB_DB_NAME', ''),
  smtpHost: optionalEnv('SMTP_HOST', ''),
  smtpPort: Number(optionalEnv('SMTP_PORT', 587)),
  smtpSecure: optionalEnv('SMTP_SECURE', 'false') === 'true',
  smtpUser: optionalEnv('SMTP_USER', ''),
  smtpPass: optionalEnv('SMTP_PASS', ''),
  smtpFromEmail: optionalEnv('SMTP_FROM_EMAIL', ''),
  smtpFromName: optionalEnv('SMTP_FROM_NAME', 'TourAssist AI'),
  openAiApiKey: optionalEnv('OPENAI_API_KEY', ''),
  allowMockAi: optionalEnv('ALLOW_MOCK_AI', 'true') === 'true',
  openAiChatModel: optionalEnv('OPENAI_CHAT_MODEL', 'gpt-4.1-mini'),
  openAiTranslationModel: optionalEnv('OPENAI_TRANSLATION_MODEL', 'gpt-4.1-mini'),
  openAiTranscriptionModel: optionalEnv(
    'OPENAI_TRANSCRIPTION_MODEL',
    'gpt-4o-mini-transcribe'
  ),
  openAiTtsModel: optionalEnv('OPENAI_TTS_MODEL', 'gpt-4o-mini-tts'),
  openAiTtsVoice: optionalEnv('OPENAI_TTS_VOICE', 'alloy'),
  exchangeRateApiUrl: optionalEnv(
    'EXCHANGE_RATE_API_URL',
    'https://api.frankfurter.app'
  ),
  placesApiUrl: optionalEnv(
    'PLACES_API_URL',
    'https://overpass-api.de/api/interpreter'
  ),
  placesRadiusMeters: Number(optionalEnv('PLACES_RADIUS_METERS', 2000)),
  paths: {
    root: path.join(__dirname, '..'),
    uploads: path.join(__dirname, '..', 'uploads'),
    uploadAudio: path.join(__dirname, '..', 'uploads', 'audio'),
    temp: path.join(__dirname, '..', 'temp'),
    tempAudio: path.join(__dirname, '..', 'temp', 'audio'),
    storage: path.join(__dirname, '..', 'storage'),
    users: path.join(__dirname, '..', 'storage', 'users.json'),
    sessions: path.join(__dirname, '..', 'storage', 'sessions.json'),
    history: path.join(__dirname, '..', 'storage', 'history.json'),
    logs: path.join(__dirname, '..', 'storage', 'app.log'),
  },
};
