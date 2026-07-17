import 'dotenv/config';

const parsedPort = Number(process.env.PORT);

function parseClientUrls(value) {
  const urls = String(value || 'http://localhost:5173')
    .split(',')
    .map((url) => url.trim())
    .filter(Boolean);

  return urls.length > 0 ? urls : ['http://localhost:5173'];
}

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

  clientUrls: parseClientUrls(process.env.CLIENT_URL),
});