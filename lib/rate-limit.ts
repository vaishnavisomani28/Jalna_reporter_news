/**
 * Rate limiting utility
 * Uses Upstash Redis if available, otherwise falls back to in-memory storage
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// In-memory rate limiter fallback
class MemoryStore {
  private store: Map<string, { count: number; reset: number }> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Cleanup expired entries every minute
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, value] of this.store.entries()) {
        if (value.reset < now) {
          this.store.delete(key);
        }
      }
    }, 60000);
  }

  async get(key: string) {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (entry.reset < Date.now()) {
      this.store.delete(key);
      return null;
    }
    return entry.count;
  }

  async set(key: string, count: number, reset: number) {
    this.store.set(key, { count, reset });
  }

  async incr(key: string, reset: number) {
    const entry = this.store.get(key);
    if (!entry || entry.reset < Date.now()) {
      this.store.set(key, { count: 1, reset });
      return 1;
    }
    entry.count++;
    return entry.count;
  }

  destroy() {
    clearInterval(this.cleanupInterval);
  }
}

// Create rate limiter instance
let ratelimit: Ratelimit;
let memoryStore: MemoryStore | null = null;

// Always use in-memory store for now (Redis is optional)
// This prevents "evalsha" errors when Redis is not properly configured
try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    // Try to use Upstash Redis if available
    try {
      const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      });

      ratelimit = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests per 10 seconds
        analytics: true,
      });
    } catch (redisError) {
      // If Redis fails, fall back to memory
      console.warn('Redis connection failed, using in-memory rate limiting');
      memoryStore = new MemoryStore();
      ratelimit = new Ratelimit({
        store: memoryStore,
        limiter: Ratelimit.slidingWindow(10, '10 s'),
        analytics: true,
      });
    }
  } else {
    // Use in-memory storage (default)
    memoryStore = new MemoryStore();
    ratelimit = new Ratelimit({
      store: memoryStore,
      limiter: Ratelimit.slidingWindow(10, '10 s'),
      analytics: true,
    });
  }
} catch (error) {
  // Final fallback - always use memory store
  console.warn('Rate limiter initialization failed, using in-memory fallback');
  memoryStore = new MemoryStore();
  ratelimit = new Ratelimit({
    store: memoryStore,
    limiter: Ratelimit.slidingWindow(10, '10 s'),
    analytics: true,
  });
}

export async function checkRateLimit(identifier: string) {
  try {
    const { success, limit, remaining, reset } = await ratelimit.limit(identifier);
    return {
      success,
      limit,
      remaining,
      reset,
    };
  } catch (error) {
    // If rate limiting fails, allow the request (fail open)
    console.error('Rate limit check failed:', error);
    return {
      success: true,
      limit: 10,
      remaining: 10,
      reset: Date.now() + 10000,
    };
  }
}

export { ratelimit };

