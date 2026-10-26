/** biome-ignore-all lint/suspicious/noExplicitAny: any is acceptable in Hono routes */
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi"
import { RATE_LIMIT_CONFIG } from "../../lib/config/rate-limit.ts"
import { listCategories } from "../../lib/data.ts"
import { rateLimit } from "../../lib/middleware/rate-limit.ts"
import {
  CategoryListItemSchema,
  CategoryListQuerySchema,
  ErrorSchema,
  RateLimitErrorResponseSchema,
} from "../../lib/schemas.ts"
import type { Bindings } from "../../lib/types.ts"

const app = new OpenAPIHono<{ Bindings: Bindings }>()
app.use("/", rateLimit({ config: RATE_LIMIT_CONFIG.list }))

const listCategoriesRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Categories"],
  summary: "List all categories",
  description:
    "Get a list of all categories. Rate limit: 60 requests per minute.",
  request: {
    query: CategoryListQuerySchema,
  },
  responses: {
    200: {
      description: "Successful response",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            data: CategoryListItemSchema.array().optional(),
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

app.openapi(listCategoriesRoute, async (c: any) => {
  try {
    const categories = await listCategories(c.req.valid("query"))

    return c.json({
      success: true,
      data: categories,
    })
  } catch (error) {
    console.error("Error listing categories:", error)
    return c.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to retrieve categories",
        },
      },
      500,
    )
  }
})

export default app
