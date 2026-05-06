const path = require('path');
const dotenv = require('dotenv');

const ENV_ALREADY_LOADED_FLAG = '__SMART_TOURISM_ENV_LOADED__';

if (!global[ENV_ALREADY_LOADED_FLAG]) {
  const envFilePath = path.resolve(__dirname, '..', '.env');
  const result = dotenv.config({
    path: envFilePath,
    override: true,
  });

  if (result.error) {
    console.warn(`Unable to load environment file at ${envFilePath}`);
  }

  global[ENV_ALREADY_LOADED_FLAG] = true;
}
