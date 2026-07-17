import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDatabase() {
  try {
    await mongoose.connect(env.mongoUri);

    console.log('Auth database connected');
  } catch (error) {
    console.error('Auth database connection failed');
    console.error(error.message);

    process.exit(1);
  }
}