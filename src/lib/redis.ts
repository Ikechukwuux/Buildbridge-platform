import { Redis } from '@upstash/redis'

// Initialize the Redis client. 
// Note: We use a try-catch or safe instantiation so the app doesn't crash 
// if environment variables are missing during build steps.
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
})

/**
 * Helper function to fetch data with a Redis fallback cache.
 * @param key The unique string key to store the data under in Redis
 * @param fetcher The async function to call if there is a cache miss
 * @param ttlSeconds How long the data should live in the cache before expiring
 */
export async function getCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number = 60
): Promise<T> {
  // If Redis is not configured, bypass caching and fetch directly
  if (!process.env.UPSTASH_REDIS_REST_URL) {
    console.warn(`Redis not configured, bypassing cache for key: ${key}`);
    return fetcher();
  }

  try {
    // 1. Try to get the data from Redis
    const cachedData = await redis.get<T>(key);
    
    if (cachedData) {
      console.log(`[Cache HIT] ${key}`);
      return cachedData;
    }

    console.log(`[Cache MISS] ${key}`);
    
    // 2. If miss, fetch fresh data
    const freshData = await fetcher();

    // 3. Store fresh data in Redis with expiration
    await redis.set(key, freshData, { ex: ttlSeconds });

    return freshData;
  } catch (error) {
    console.error(`Redis cache error for key ${key}:`, error);
    // Fallback to fetcher if Redis fails for any reason
    return fetcher();
  }
}

/**
 * Helper function to manually delete a key from the cache.
 * Useful when a user performs a mutation (e.g. submits a new story)
 * and we want the public feed to reflect it immediately.
 * @param key The exact string key or array of keys to delete
 */
export async function invalidateCache(key: string | string[]) {
  if (!process.env.UPSTASH_REDIS_REST_URL) return;
  
  try {
    if (Array.isArray(key)) {
      await redis.del(...key);
      console.log(`[Cache INVALIDATED] Keys: ${key.join(', ')}`);
    } else {
      await redis.del(key);
      console.log(`[Cache INVALIDATED] Key: ${key}`);
    }
  } catch (error) {
    console.error(`Failed to invalidate cache for ${key}:`, error);
  }
}
