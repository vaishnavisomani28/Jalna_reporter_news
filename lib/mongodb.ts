import mongoose from 'mongoose';
import { env } from './env-validation';
import { logger } from './logger';

const MONGODB_URI = env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB(retries = 3, delay = 1000) {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    cached.promise = (async () => {
      for (let i = 0; i < retries; i++) {
        try {
          const connection = await mongoose.connect(MONGODB_URI, opts);
          logger.info('MongoDB connected successfully');
          return connection;
        } catch (error) {
          logger.error('MongoDB connection attempt failed', error instanceof Error ? error : undefined, {
            attempt: i + 1,
            retries,
          });
          
          if (i === retries - 1) {
            throw error;
          }
          
          // Wait before retrying
          await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
        }
      }
      throw new Error('Failed to connect to MongoDB after retries');
    })();
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    logger.error('MongoDB connection error', e instanceof Error ? e : undefined);
    throw e;
  }

  return cached.conn;
}

export default connectDB;

