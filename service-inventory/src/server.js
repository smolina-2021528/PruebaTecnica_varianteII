import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';

let server;

async function start() {
  await connectDB();

  server = app.listen(env.port, () => {
    console.log('service-inventory running on http://localhost:' + env.port);
  });
}

start();

function shutdown(signal) {
  console.log('\n' + signal + ' received. Closing service-inventory...');

  if (!server) {
    process.exit(0);
    return;
  }

  server.close(() => {
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));