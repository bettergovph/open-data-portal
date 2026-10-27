/* oxlint-disable typescript/no-explicit-any -- any is acceptable in Hono routes */
import { createRoute, OpenAPIHono } from "@hono/zod-openapi"
import { RATE_LIMIT_CONFIG } from "../../lib/config/rate-limit.ts"
import { listPublishers } from "../../lib/data.ts"
import { rateLimit } from "../../lib/middleware/rate-limit.ts"
import {
  createApiResponseSchema,
  PaginationInfoSchema,
  PublisherListQuerySchema,
  PublisherSchema,
  RateLimitErrorResponseSchema,
} from "../../lib/schemas.ts"

const app = new OpenAPIHono()
app.use("/", rateLimit({ config: RATE_LIMIT_CONFIG.list }))

const listPublishersRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Publishers"],
  summary: "List all publishers",
  description: "Get a paginated list of publishers. Rate limit: 60 requests per minute.",
  request: {
    query: PublisherListQuerySchema,
  },
  responses: {
    200: {
      description: "Successful response",
      content: {
        "application/json": {
          schema: createApiResponseSchema(PublisherSchema.array()).extend({
            pagination: PaginationInfoSchema,
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

app.openapi(listPublishersRoute, async (c: any) => {
  try {
    const { data, pagination } = await listPublishers(c.req.valid("query"))
    return c.json({ success: true, data, pagination })
  } catch (error) {
    console.error("Error listing publishers:", error)
    return c.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to retrieve publishers",
        },
      },
      500,
    )
  }
})

export default app
