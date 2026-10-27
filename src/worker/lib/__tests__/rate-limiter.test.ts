import { beforeEach, describe, expect, it, vi } from "vite-plus/test"
import { type RateLimitConfig, rateLimiter } from "../rate-limiter.ts"

describe("InMemoryRateLimiter", () => {
  beforeEach(() => {
    rateLimiter.reset()
  })

  describe("basic rate limiting", () => {
    it("should allow requests under the limit", () => {
      const config: RateLimitConfig = {
        windowMs: 60_000,
        maxRequests: 5,
      }

      for (let i = 0; i < config.maxRequests; i++) {
        const result = rateLimiter.check("test-ip", config)
        expect(result.allowed).toBe(true)
        expect(result.limit).toBe(config.maxRequests)
      }
    })

    it("should block requests over the limit", () => {
      const config: RateLimitConfig = {
        windowMs: 60_000,
        maxRequests: 5,
      }

      for (let i = 0; i < config.maxRequests; i++) {
        rateLimiter.check("test-ip", config)
      }

      // 6th request should be blocked
      const result = rateLimiter.check("test-ip", config)
      expect(result.allowed).toBe(false)
      expect(result.remaining).toBe(0)
    })

    it("should return correct remaining count", () => {
      const config: RateLimitConfig = {
        windowMs: 60_000,
        maxRequests: 10,
      }

      const result1 = rateLimiter.check("test-ip", config)
      expect(result1.allowed).toBe(true)
      expect(result1.remaining).toBe(9)

      const result2 = rateLimiter.check("test-ip", config)
      expect(result2.allowed).toBe(true)
      expect(result2.remaining).toBe(8)

      const result3 = rateLimiter.check("test-ip", config)
      expect(result3.allowed).toBe(true)
      expect(result3.remaining).toBe(7)
    })
  })

  describe("sliding window", () => {
    it("should reset after window expires", async () => {
      const config: RateLimitConfig = {
        windowMs: 100,
        maxRequests: 2,
      }

      rateLimiter.check("test-ip", config)
      rateLimiter.check("test-ip", config)

      const blocked = rateLimiter.check("test-ip", config)
      expect(blocked.allowed).toBe(false)

      // Wait for window to expire
      await new Promise((resolve) => setTimeout(resolve, 150))

      const allowed = rateLimiter.check("test-ip", config)
      expect(allowed.allowed).toBe(true)
    })

    it("should only count requests within the window", async () => {
      const config: RateLimitConfig = {
        windowMs: 100,
        maxRequests: 3,
      }

      rateLimiter.check("test-ip", config)
      rateLimiter.check("test-ip", config)

      // Wait for first request to expire
      await new Promise((resolve) => setTimeout(resolve, 110))

      const result = rateLimiter.check("test-ip", config)
      expect(result.allowed).toBe(true)
    })
  })

  describe("multiple clients", () => {
    it("should track different IPs separately", () => {
      const config: RateLimitConfig = {
        windowMs: 60_000,
        maxRequests: 2,
      }

      rateLimiter.check("ip1", config)
      rateLimiter.check("ip1", config)

      // IP1 should be blocked
      const ip1Result = rateLimiter.check("ip1", config)
      expect(ip1Result.allowed).toBe(false)

      // IP2 should still be allowed
      const ip2Result = rateLimiter.check("ip2", config)
      expect(ip2Result.allowed).toBe(true)
    })

    it("should not interfere between different IPs", () => {
      const config: RateLimitConfig = {
        windowMs: 60_000,
        maxRequests: 5,
      }

      rateLimiter.check("ip1", config)
      rateLimiter.check("ip2", config)
      rateLimiter.check("ip3", config)

      const result1 = rateLimiter.check("ip1", config)
      expect(result1.remaining).toBe(3)

      const result2 = rateLimiter.check("ip2", config)
      expect(result2.remaining).toBe(3)

      const result3 = rateLimiter.check("ip3", config)
      expect(result3.remaining).toBe(3)
    })
  })

  describe("reset time calculation", () => {
    it("should return correct reset time", () => {
      const config: RateLimitConfig = {
        windowMs: 60_000,
        maxRequests: 5,
      }

      const before = Date.now()
      const result = rateLimiter.check("test-ip", config)
      const after = Date.now()

      // Reset time should be approximately now + 60 seconds
      expect(result.resetTime).toBeGreaterThanOrEqual(before + config.windowMs)
      expect(result.resetTime).toBeLessThanOrEqual(after + config.windowMs)
    })

    it("should maintain reset time based on oldest request", () => {
      const config: RateLimitConfig = {
        windowMs: 60_000,
        maxRequests: 3,
      }

      const result1 = rateLimiter.check("test-ip", config)
      const firstResetTime = result1.resetTime

      const wait = 100
      vi.useFakeTimers()
      vi.advanceTimersByTime(wait)

      const result2 = rateLimiter.check("test-ip", config)

      // Reset time should still be based on first request
      expect(result2.resetTime).toBe(firstResetTime)

      vi.useRealTimers()
    })
  })

  describe("cleanup", () => {
    it("should track store size", () => {
      const config: RateLimitConfig = {
        windowMs: 60_000,
        maxRequests: 10,
      }

      expect(rateLimiter.getStoreSize()).toBe(0)

      rateLimiter.check("ip1", config)
      expect(rateLimiter.getStoreSize()).toBe(1)

      rateLimiter.check("ip2", config)
      expect(rateLimiter.getStoreSize()).toBe(2)

      rateLimiter.check("ip3", config)
      expect(rateLimiter.getStoreSize()).toBe(3)
    })

    it("should clear all entries on reset", () => {
      const config: RateLimitConfig = {
        windowMs: 60_000,
        maxRequests: 10,
      }

      rateLimiter.check("ip1", config)
      rateLimiter.check("ip2", config)
      rateLimiter.check("ip3", config)

      expect(rateLimiter.getStoreSize()).toBe(3)

      rateLimiter.reset()

      expect(rateLimiter.getStoreSize()).toBe(0)
    })
  })

  describe("edge cases", () => {
    it("should handle zero requests limit", () => {
      const config: RateLimitConfig = {
        windowMs: 60_000,
        maxRequests: 0,
      }

      const result = rateLimiter.check("test-ip", config)
      expect(result.allowed).toBe(false)
      expect(result.remaining).toBe(0)
    })

    it("should handle very high request limits", () => {
      const config: RateLimitConfig = {
        windowMs: 60_000,
        maxRequests: 1_000_000,
      }

      const result = rateLimiter.check("test-ip", config)
      expect(result.allowed).toBe(true)
      expect(result.limit).toBe(config.maxRequests)
    })
  })
})
