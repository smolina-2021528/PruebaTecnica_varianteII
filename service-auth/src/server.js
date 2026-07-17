import app from './app.js';
import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';

async function bootstrap() {
  await connectDatabase();

  const server = app.listen(env.port, () => {
    console.log('service-auth running on http://localhost:' + env.port);
  });

  function shutdown(signal) {
    console.log('\n' + signal + ' received. Closing service-auth...');

    server.close(() => {
      process.exit(0);
    });
  }

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

bootstrap();