import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi"
import { RATE_LIMIT_CONFIG } from "../../lib/config/rate-limit.ts"
import { rateLimit } from "../../lib/middleware/rate-limit.ts"
import { RateLimitErrorResponseSchema } from "../../lib/schemas.ts"

const app = new OpenAPIHono()
app.use("/", rateLimit({ config: RATE_LIMIT_CONFIG.ping }))

const pingRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Health"],
  summary: "Health check",
  description: "Check if the API is running. Rate limit: 1000 requests per minute.",
  responses: {
    200: {
      description: "API is healthy",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            data: z.object({
              status: z.string(),
              timestamp: z.string(),
            }),
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

app.openapi(pingRoute, async (c) => {
  return c.json(
    {
      success: true,
      data: {
        status: "ok",
        timestamp: new Date().toISOString(),
      },
    },
    200,
  )
})

export default app
