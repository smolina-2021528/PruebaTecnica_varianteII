import 'dotenv/config';

const parsedPort = Number(process.env.PORT);

export const env = Object.freeze({
  port:
    Number.isInteger(parsedPort) && parsedPort > 0
      ? parsedPort
      : 4001,
  mongoUri:
    process.env.MONGODB_URI ||
    'mongodb://localhost:27017/inventory_auth',
  jwtSecret: process.env.JWT_SECRET || 'change_me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '4h',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
});