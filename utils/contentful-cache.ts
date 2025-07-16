/**
 * Simple in-memory cache for Contentful data
 * In production, you would use Redis or similar
 */

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

class ContentfulCache {
  private cache = new Map<string, CacheEntry<any>>()
  private defaultTTL = 5 * 60 * 1000 // 5 minutes in milliseconds

  /**
   * Get data from cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) return null
    
    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }
    
    return entry.data
  }

  /**
   * Set data in cache
   */
  set<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    })
  }

  /**
   * Delete from cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size
  }

  /**
   * Clean up expired entries
   */
  cleanup(): number {
    const now = Date.now()
    let cleaned = 0
    
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key)
        cleaned++
      }
    }
    
    return cleaned
  }

  /**
   * Generate cache key for Contentful queries
   */
  generateKey(method: string, params: any): string {
    const paramString = JSON.stringify(params, Object.keys(params).sort())
    // Use btoa for browser compatibility
    const encoded = import.meta.client ? btoa(paramString) : Buffer.from(paramString).toString('base64')
    return `contentful:${method}:${encoded}`
  }
}

// Singleton instance
const contentfulCache = new ContentfulCache()

// Cleanup expired entries every 10 minutes
if (typeof window === 'undefined') { // Only on server
  setInterval(() => {
    const cleaned = contentfulCache.cleanup()
    if (cleaned > 0 && process.env.NODE_ENV === 'development') {
      console.log(`[Contentful Cache] Cleaned up ${cleaned} expired entries`)
    }
  }, 10 * 60 * 1000)
}

export { contentfulCache }

/**
 * Cache decorator for Contentful methods
 */
export function withCache<T extends any[], R>(
  cacheKey: string,
  ttl?: number
) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value

    descriptor.value = async function (...args: T): Promise<R> {
      const key = contentfulCache.generateKey(`${cacheKey}:${propertyName}`, args)
      
      // Try to get from cache first
      const cached = contentfulCache.get<R>(key)
      if (cached) {
        if (process.env.NODE_ENV === 'development') {
          console.log(`[Cache HIT] ${key}`)
        }
        return cached
      }

      // Execute original method
      const result = await method.apply(this, args)
      
      // Store in cache
      contentfulCache.set(key, result, ttl)
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Cache MISS] ${key}`)
      }
      
      return result
    }
  }
}