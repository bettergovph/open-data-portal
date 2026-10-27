/* oxlint-disable typescript/no-explicit-any -- any is acceptable in Hono routes */
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi"
import { RATE_LIMIT_CONFIG } from "../../lib/config/rate-limit.ts"
import { getStats } from "../../lib/data.ts"
import { rateLimit } from "../../lib/middleware/rate-limit.ts"
import { ErrorSchema, RateLimitErrorResponseSchema, StatsSchema } from "../../lib/schemas.ts"

const app = new OpenAPIHono()
app.use("/", rateLimit({ config: RATE_LIMIT_CONFIG.stats }))

const getStatsRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Statistics"],
  summary: "Get platform statistics",
  description: "Retrieve platform-wide statistics including counts and totals. Rate limit: 30 requests per minute.",
  responses: {
    200: {
      description: "Successful response",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            data: StatsSchema.optional(),
            error: ErrorSchema.optional(),
          }),
        },
      },
    },
    429: {
      description: "Rate limit exceeded",
      content: {
        "application/json": {
          schema: RateLimitErrorResponseSchema,
        },
      },
    },
  },
})

app.openapi(getStatsRoute, async (c: any) => {
  try {
    const stats = await getStats()

    return c.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error("Error getting stats:", error)
    return c.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to retrieve statistics",
        },
      },
      500,
    )
  }
})

export default app
