interface RateLimitEntry {
  timestamps: number[]
  lastCleanup: number
}

export interface RateLimitConfig {
  windowMs: number
  maxRequests: number
}

export interface RateLimitResult {
  allowed: boolean
  limit: number
  remaining: number
  /** Unix timestamp in milliseconds when the rate limit resets */
  resetTime: number
}

class InMemoryRateLimiter {
  private store = new Map<string, RateLimitEntry>()
  private readonly cleanupIntervalMs = 60_000

  /**
   * Check if a request should be allowed based on rate limit configuration.
   * Uses sliding window algorithm to track requests over time.
   *
   * @param key - Unique identifier for the rate limit (e.g., IP address)
   * @param config - Rate limit configuration specifying window and max requests
   * @returns Result indicating if request is allowed and current limit status
   */
  check(key: string, config: RateLimitConfig): RateLimitResult {
    const now = Date.now()
    const windowStart = now - config.windowMs

    let entry = this.store.get(key)
    if (!entry) {
      entry = { timestamps: [], lastCleanup: now }
      this.store.set(key, entry)
    }

    entry.timestamps = entry.timestamps.filter((ts) => ts > windowStart)

    const currentCount = entry.timestamps.length
    const oldestTimestamp = entry.timestamps[0] || now
    const resetTime = oldestTimestamp + config.windowMs

    if (currentCount >= config.maxRequests) {
      return {
        allowed: false,
        limit: config.maxRequests,
        remaining: 0,
        resetTime,
      }
    }

    entry.timestamps.push(now)
    const remaining = Math.max(0, config.maxRequests - entry.timestamps.length)

    if (now - entry.lastCleanup > this.cleanupIntervalMs) {
      this.cleanup(now, config.windowMs)
      entry.lastCleanup = now
    }

    return {
      allowed: true,
      limit: config.maxRequests,
      remaining,
      resetTime,
    }
  }

  private cleanup(now: number, windowMs: number): void {
    const staleThreshold = now - windowMs * 2

    for (const [key, entry] of this.store.entries()) {
      if (entry.timestamps.length === 0 || entry.timestamps[entry.timestamps.length - 1] < staleThreshold) {
        this.store.delete(key)
      }
    }
  }

  getStoreSize(): number {
    return this.store.size
  }

  reset(): void {
    this.store.clear()
  }
}

export const rateLimiter = new InMemoryRateLimiter()
