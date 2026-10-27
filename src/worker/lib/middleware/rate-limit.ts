import type { Context, MiddlewareHandler } from "hono"
import { type RateLimitConfig, rateLimiter } from "../rate-limiter.ts"

/**
 * Options for configuring the rate limit middleware
 */
interface RateLimitMiddlewareOptions {
  config: RateLimitConfig
  /** Optional function to generate unique key for rate limiting (defaults to IP-based) */
  keyGenerator?: (c: Context) => string
}

/**
 * Creates a rate limiting middleware for Hono routes.
 * Automatically bypasses rate limiting in development environment.
 * Returns 429 status with retry information when limit is exceeded.
 *
 * @param options - Configuration options for the middleware
 * @returns Hono middleware handler
 *
 * @example
 * ```ts
 * app.use("/api", rateLimit({
 *   config: { windowMs: 60_000, maxRequests: 100 }
 * }))
 * ```
 */
export const rateLimit = (options: RateLimitMiddlewareOptions): MiddlewareHandler => {
  const { config, keyGenerator = defaultKeyGenerator } = options

  return async (c, next) => {
    if (c.env?.ENVIRONMENT === "development") {
      await next()
      return
    }

    const key = keyGenerator(c)

    try {
      const result = rateLimiter.check(key, config)

      c.header("x-ratelimit-limit", result.limit.toString())
      c.header("x-ratelimit-remaining", result.remaining.toString())
      c.header("x-ratelimit-reset", Math.ceil(result.resetTime / 1000).toString())

      if (!result.allowed) {
        const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000)
        c.header("retry-after", retryAfter.toString())

        return c.json(
          {
            success: false,
            error: {
              code: "RATE_LIMIT_EXCEEDED",
              message: "Too many requests. Please try again later.",
              details: {
                limit: result.limit,
                windowMs: config.windowMs,
                retryAfter,
              },
            },
          },
          429,
        )
      }

      await next()
    } catch (error) {
      console.error("Rate limiter error:", error)
      await next()
    }
  }
}

const defaultKeyGenerator = (c: Context): string => {
  const cfConnectingIp = c.req.header("cf-connecting-ip")
  if (cfConnectingIp) {
    return `ip:${cfConnectingIp}`
  }

  // oxlint-disable-next-line typescript/no-explicit-any -- CF object types are not exposed in Hono
  const cf = (c.req.raw as any).cf
  if (cf?.connectingIP) {
    return `ip:${cf.connectingIP}`
  }

  const xForwardedFor = c.req.header("x-forwarded-for")
  if (xForwardedFor) {
    return `ip:${xForwardedFor.split(",")[0].trim()}`
  }

  const xRealIp = c.req.header("x-real-ip")
  if (xRealIp) {
    return `ip:${xRealIp}`
  }

  return `ip:unknown-${Date.now()}-${Math.random().toString(36).substring(7)}`
}
