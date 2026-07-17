import app from './app.js';
import { env } from './config/env.js';

const server = app.listen(env.port, () => {
  console.log('service-reports running on http://localhost:' + env.port);
});

function shutdown(signal) {
  console.log('\n' + signal + ' received. Closing service-reports...');

  server.close(() => {
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));