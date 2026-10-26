/** biome-ignore-all lint/suspicious/noExplicitAny: any is acceptable in Hono routes */
import { createRoute, OpenAPIHono } from "@hono/zod-openapi"
import { RATE_LIMIT_CONFIG } from "../../lib/config/rate-limit.ts"
import { getResource, listResources } from "../../lib/data.ts"
import { rateLimit } from "../../lib/middleware/rate-limit.ts"
import {
  createApiResponseSchema,
  ErrorResponseSchema,
  IdParamSchema,
  PaginationInfoSchema,
  RateLimitErrorResponseSchema,
  ResourceListQuerySchema,
  ResourceSchema,
} from "../../lib/schemas.ts"

const app = new OpenAPIHono()
app.use("/", rateLimit({ config: RATE_LIMIT_CONFIG.list }))
app.use("/:id", rateLimit({ config: RATE_LIMIT_CONFIG.detail }))

const listResourcesRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Resources"],
  summary: "List resources for a dataset",
  description:
    "Get a paginated list of resources for a specific dataset. Rate limit: 60 requests per minute.",
  request: {
    query: ResourceListQuerySchema,
  },
  responses: {
    200: {
      description: "Successful response",
      content: {
        "application/json": {
          schema: createApiResponseSchema(ResourceSchema.array()).extend({
            pagination: PaginationInfoSchema,
          }),
        },
      },
    },
    400: {
      description: "Bad request",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
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

app.openapi(listResourcesRoute, async (c: any) => {
  try {
    const { data, pagination } = await listResources(c.req.valid("query"))
    return c.json({ success: true, data, pagination })
  } catch (error) {
    console.error("Error listing resources:", error)
    return c.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to retrieve resources",
        },
      },
      500,
    )
  }
})

const getResourceRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["Resources"],
  summary: "Get resource details",
  description:
    "Get full details of a specific resource. Rate limit: 100 requests per minute.",
  request: {
    params: IdParamSchema,
  },
  responses: {
    200: {
      description: "Successful response",
      content: {
        "application/json": {
          schema: createApiResponseSchema(ResourceSchema),
        },
      },
    },
    404: {
      description: "Resource not found",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
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

app.openapi(getResourceRoute, async (c: any) => {
  const { id } = c.req.valid("param")

  try {
    const resource = await getResource(id)

    if (!resource) {
      return c.json(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Resource not found",
          },
        },
        404,
      )
    }

    return c.json({
      success: true,
      data: resource,
    })
  } catch (error) {
    console.error("Error getting resource:", error)
    return c.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to retrieve resource",
        },
      },
      500,
    )
  }
})

export default app
