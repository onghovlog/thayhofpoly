const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/thayhotb',
  JWT_SECRET: process.env.JWT_SECRET || 'thayhotb_jwt_secret_key_default',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '30d',
  YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY || '',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  TRUST_PROXY: process.env.TRUST_PROXY || '1',
};

