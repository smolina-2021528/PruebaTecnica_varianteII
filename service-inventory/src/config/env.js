import 'dotenv/config';

const parsedPort = Number(process.env.PORT);

export const env = Object.freeze({
  port:
    Number.isInteger(parsedPort) && parsedPort > 0
      ? parsedPort
      : 4002,
  mongoUri:
    process.env.MONGODB_URI ||
    'mongodb://localhost:27017/inventory_core',
  jwtSecret: process.env.JWT_SECRET || 'change_me',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
});