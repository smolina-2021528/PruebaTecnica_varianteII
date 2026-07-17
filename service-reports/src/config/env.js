import 'dotenv/config';

const parsedPort = Number(process.env.PORT);

export const env = Object.freeze({
  port:
    Number.isInteger(parsedPort) && parsedPort > 0
      ? parsedPort
      : 4003,
  jwtSecret: process.env.JWT_SECRET || 'change_me',
  inventoryServiceUrl:
    process.env.INVENTORY_SERVICE_URL ||
    'http://localhost:4002',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
});