import mongoose from 'mongoose';
import { env } from './env.js';

mongoose.set('strictQuery', true);

export async function connectDB() {
  try {
    await mongoose.connect(env.mongoUri);
    console.log('service-inventory: conectado a MongoDB (' + env.mongoUri + ')');
  } catch (error) {
    console.error('service-inventory: error al conectar a MongoDB');
    console.error(error);
    process.exit(1);
  }

  mongoose.connection.on('disconnected', () => {
    console.warn('service-inventory: conexión a MongoDB perdida');
  });
}
