import { OpenAPIHono } from "@hono/zod-openapi"
import { beforeEach, describe, expect, it } from "vite-plus/test"
import { rateLimit } from "../middleware/rate-limit.ts"
import { rateLimiter } from "../rate-limiter.ts"

describe("Rate Limit Middleware", () => {
  beforeEach(() => {
    rateLimiter.reset()
  })

  describe("basic functionality", () => {
    it("should allow requests under the limit", async () => {
      const app = new OpenAPIHono()

      app.use("/test", rateLimit({ config: { windowMs: 60_000, maxRequests: 5 } }))
      app.get("/test", (c) => c.json({ message: "success" }))

      for (let i = 0; i < 5; i++) {
        const res = await app.request("/test", {
          headers: { "cf-connecting-ip": "1.2.3.4" },
        })
        expect(res.status).toBe(200)
        // oxlint-disable-next-line typescript/no-explicit-any -- test response body structure
        const body = (await res.json()) as any
        expect(body).toEqual({ message: "success" })
      }
    })

    it("should block requests over the limit with 429", async () => {
      const app = new OpenAPIHono()

      app.use("/test", rateLimit({ config: { windowMs: 60_000, maxRequests: 3 } }))
      app.get("/test", (c) => c.json({ message: "success" }))

      for (let i = 0; i < 3; i++) {
        await app.request("/test", {
          headers: { "cf-connecting-ip": "1.2.3.4" },
        })
      }

      // 4th request should be blocked
      const res = await app.request("/test", {
        headers: { "cf-connecting-ip": "1.2.3.4" },
      })

      expect(res.status).toBe(429)

      // oxlint-disable-next-line typescript/no-explicit-any -- test response body structure
      const body = (await res.json()) as any
      expect(body).toMatchObject({
        success: false,
        error: {
          code: "RATE_LIMIT_EXCEEDED",
          message: "Too many requests. Please try again later.",
        },
      })
    })
  })

  describe("headers", () => {
    it("should include rate limit headers in successful responses", async () => {
      const app = new OpenAPIHono()

      app.use("/test", rateLimit({ config: { windowMs: 60_000, maxRequests: 10 } }))
      app.get("/test", (c) => c.json({ message: "success" }))

      const res = await app.request("/test", {
        headers: { "cf-connecting-ip": "1.2.3.4" },
      })

      expect(res.status).toBe(200)
      // oxlint-disable-next-line typescript/no-non-null-assertion -- header is guaranteed to exist in successful rate limit response
      expect(res.headers.get("x-ratelimit-limit")!).toBe("10")
      // oxlint-disable-next-line typescript/no-non-null-assertion -- header is guaranteed to exist in successful rate limit response
      expect(res.headers.get("x-ratelimit-remaining")!).toBe("9")
      expect(res.headers.get("x-ratelimit-reset")).toBeTruthy()
    })

    it("should include retry-after header when rate limited", async () => {
      const app = new OpenAPIHono()

      app.use("/test", rateLimit({ config: { windowMs: 60_000, maxRequests: 2 } }))
      app.get("/test", (c) => c.json({ message: "success" }))

      // Exhaust the limit
      await app.request("/test", { headers: { "cf-connecting-ip": "1.2.3.4" } })
      await app.request("/test", { headers: { "cf-connecting-ip": "1.2.3.4" } })

      // Get rate limited response
      const res = await app.request("/test", {
        headers: { "cf-connecting-ip": "1.2.3.4" },
      })

      expect(res.status).toBe(429)
      // oxlint-disable-next-line typescript/no-non-null-assertion -- header is guaranteed to exist in rate limit response
      expect(res.headers.get("x-ratelimit-limit")!).toBe("2")
      // oxlint-disable-next-line typescript/no-non-null-assertion -- header is guaranteed to exist in rate limit response
      expect(res.headers.get("x-ratelimit-remaining")!).toBe("0")
      expect(res.headers.get("retry-after")).toBeTruthy()

      const retryAfter = Number.parseInt(res.headers.get("retry-after") || "0", 10)
      expect(retryAfter).toBeGreaterThan(0)
      expect(retryAfter).toBeLessThanOrEqual(60)
    })

    it("should update remaining count correctly", async () => {
      const app = new OpenAPIHono()

      app.use("/test", rateLimit({ config: { windowMs: 60_000, maxRequests: 5 } }))
      app.get("/test", (c) => c.json({ message: "success" }))

      const res1 = await app.request("/test", {
        headers: { "cf-connecting-ip": "1.2.3.4" },
      })
      // oxlint-disable-next-line typescript/no-non-null-assertion -- header is guaranteed to exist in rate limit response
      expect(res1.headers.get("x-ratelimit-remaining")!).toBe("4")

      const res2 = await app.request("/test", {
        headers: { "cf-connecting-ip": "1.2.3.4" },
      })
      // oxlint-disable-next-line typescript/no-non-null-assertion -- header is guaranteed to exist in rate limit response
      expect(res2.headers.get("x-ratelimit-remaining")!).toBe("3")

      const res3 = await app.request("/test", {
        headers: { "cf-connecting-ip": "1.2.3.4" },
      })
      // oxlint-disable-next-line typescript/no-non-null-assertion -- header is guaranteed to exist in rate limit response
      expect(res3.headers.get("x-ratelimit-remaining")!).toBe("2")
    })
  })

  describe("IP extraction", () => {
    it("should use cf-connecting-ip header", async () => {
      const app = new OpenAPIHono()

      app.use("/test", rateLimit({ config: { windowMs: 60_000, maxRequests: 2 } }))
      app.get("/test", (c) => c.json({ message: "success" }))

      await app.request("/test", { headers: { "cf-connecting-ip": "1.2.3.4" } })
      await app.request("/test", { headers: { "cf-connecting-ip": "1.2.3.4" } })

      const res1 = await app.request("/test", {
        headers: { "cf-connecting-ip": "1.2.3.4" },
      })
      expect(res1.status).toBe(429)

      const res2 = await app.request("/test", {
        headers: { "cf-connecting-ip": "5.6.7.8" },
      })
      expect(res2.status).toBe(200)
    })

    it("should handle requests without IP header", async () => {
      const app = new OpenAPIHono()

      app.use("/test", rateLimit({ config: { windowMs: 60_000, maxRequests: 5 } }))
      app.get("/test", (c) => c.json({ message: "success" }))

      const res = await app.request("/test")
      expect(res.status).toBe(200)
    })
  })

  describe("error response format", () => {
    it("should return standardized error format", async () => {
      const app = new OpenAPIHono()

      app.use("/test", rateLimit({ config: { windowMs: 60_000, maxRequests: 1 } }))
      app.get("/test", (c) => c.json({ message: "success" }))

      await app.request("/test", { headers: { "cf-connecting-ip": "1.2.3.4" } })

      const res = await app.request("/test", {
        headers: { "cf-connecting-ip": "1.2.3.4" },
      })

      expect(res.status).toBe(429)

      // oxlint-disable-next-line typescript/no-explicit-any -- test response body structure
      const body = (await res.json()) as any
      expect(body).toHaveProperty("success", false)
      expect(body).toHaveProperty("error")
      expect(body.error).toHaveProperty("code", "RATE_LIMIT_EXCEEDED")
      expect(body.error).toHaveProperty("message")
      expect(body.error).toHaveProperty("details")
      expect(body.error.details).toHaveProperty("limit", 1)
      expect(body.error.details).toHaveProperty("windowMs", 60_000)
      expect(body.error.details).toHaveProperty("retryAfter")
    })
  })

  describe("concurrent requests", () => {
    it("should handle concurrent requests correctly", async () => {
      const app = new OpenAPIHono()

      app.use("/test", rateLimit({ config: { windowMs: 60000, maxRequests: 5 } }))
      app.get("/test", (c) => c.json({ message: "success" }))

      const promises = Array.from({ length: 10 }).map(() =>
        app.request("/test", { headers: { "cf-connecting-ip": "1.2.3.4" } }),
      )

      const responses = await Promise.all(promises)

      const successful = responses.filter((r) => r.status === 200)
      const rateLimited = responses.filter((r) => r.status === 429)

      expect(successful.length).toBe(5)
      expect(rateLimited.length).toBe(5)
    })
  })

  describe("development mode", () => {
    it("should bypass rate limiting when ENVIRONMENT is development", async () => {
      const app = new OpenAPIHono<{
        Bindings: { ENVIRONMENT: string }
      }>()

      app.use("/test", rateLimit({ config: { windowMs: 60_000, maxRequests: 2 } }))
      app.get("/test", (c) => c.json({ message: "success" }))

      const devEnv = { ENVIRONMENT: "development" }

      for (let i = 0; i < 5; i++) {
        const req = new Request("http://localhost/test", {
          headers: { "cf-connecting-ip": "1.2.3.4" },
        })
        const res = await app.fetch(req, devEnv)
        expect(res.status).toBe(200)
      }
    })

    it("should apply rate limiting when ENVIRONMENT is not development", async () => {
      const app = new OpenAPIHono<{
        Bindings: { ENVIRONMENT: string }
      }>()

      app.use("/test", rateLimit({ config: { windowMs: 60_000, maxRequests: 2 } }))
      app.get("/test", (c) => c.json({ message: "success" }))

      const prodEnv = { ENVIRONMENT: "production" }

      const req1 = new Request("http://localhost/test", {
        headers: { "cf-connecting-ip": "1.2.3.4" },
      })
      await app.fetch(req1, prodEnv)

      const req2 = new Request("http://localhost/test", {
        headers: { "cf-connecting-ip": "1.2.3.4" },
      })
      await app.fetch(req2, prodEnv)

      const req3 = new Request("http://localhost/test", {
        headers: { "cf-connecting-ip": "1.2.3.4" },
      })
      const res = await app.fetch(req3, prodEnv)

      expect(res.status).toBe(429)
    })
  })

  describe("cleanup mechanism", () => {
    it("should clean up stale entries", async () => {
      const app = new OpenAPIHono()

      app.use("/test", rateLimit({ config: { windowMs: 1_000, maxRequests: 5 } }))
      app.get("/test", (c) => c.json({ message: "success" }))

      await app.request("/test", { headers: { "cf-connecting-ip": "1.2.3.4" } })

      const initialSize = rateLimiter.getStoreSize()
      expect(initialSize).toBeGreaterThan(0)

      await new Promise((resolve) => setTimeout(resolve, 2_500))

      await app.request("/test", { headers: { "cf-connecting-ip": "5.6.7.8" } })
    })
  })
})
