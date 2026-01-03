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

// Simple in-memory rate limiting (no Upstash dependency when Redis not available)
let useUpstash = false;

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
      useUpstash = true;
    } catch (redisError) {
      // If Redis fails, use simple memory store
      console.warn('Redis connection failed, using simple in-memory rate limiting');
      memoryStore = new MemoryStore();
      useUpstash = false;
    }
  } else {
    // Use simple in-memory storage (default)
    memoryStore = new MemoryStore();
    useUpstash = false;
  }
} catch (error) {
  // Final fallback - use simple memory store
  console.warn('Rate limiter initialization failed, using simple in-memory fallback');
  memoryStore = new MemoryStore();
  useUpstash = false;
}

export async function checkRateLimit(identifier: string) {
  try {
    if (useUpstash && ratelimit) {
      // Use Upstash Ratelimit if available
      const { success, limit, remaining, reset } = await ratelimit.limit(identifier);
      return {
        success,
        limit,
        remaining,
        reset,
      };
    } else if (memoryStore) {
      // Use simple in-memory rate limiting
      const now = Date.now();
      const windowMs = 10000; // 10 seconds
      const maxRequests = 10;
      const key = `ratelimit:${identifier}`;
      
      const count = await memoryStore.get(key);
      const reset = now + windowMs;
      
      if (!count || count < maxRequests) {
        await memoryStore.incr(key, reset);
        const newCount = await memoryStore.get(key) || 1;
        return {
          success: true,
          limit: maxRequests,
          remaining: Math.max(0, maxRequests - newCount),
          reset,
        };
      } else {
        return {
          success: false,
          limit: maxRequests,
          remaining: 0,
          reset,
        };
      }
    } else {
      // Fallback - allow all requests
      return {
        success: true,
        limit: 10,
        remaining: 10,
        reset: Date.now() + 10000,
      };
    }
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

