/** biome-ignore-all lint/suspicious/noExplicitAny: any is acceptable in Hono routes */
import { createRoute, OpenAPIHono } from "@hono/zod-openapi"
import { RATE_LIMIT_CONFIG } from "../../lib/config/rate-limit.ts"
import { getDataset, listDatasets } from "../../lib/data.ts"
import { rateLimit } from "../../lib/middleware/rate-limit.ts"
import {
  createApiResponseSchema,
  DatasetDetailSchema,
  DatasetListItemSchema,
  DatasetListQuerySchema,
  ErrorResponseSchema,
  IdParamSchema,
  PaginationInfoSchema,
  RateLimitErrorResponseSchema,
} from "../../lib/schemas.ts"

const app = new OpenAPIHono()
app.use("/", rateLimit({ config: RATE_LIMIT_CONFIG.search }))
app.use("/:id", rateLimit({ config: RATE_LIMIT_CONFIG.detail }))

const listDatasetsRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Datasets"],
  summary: "List all datasets",
  description:
    "Get a paginated list of datasets with optional filtering, search, and sorting. Rate limit: 20 requests per minute.",
  request: {
    query: DatasetListQuerySchema,
  },
  responses: {
    200: {
      description: "Successful response",
      content: {
        "application/json": {
          schema: createApiResponseSchema(DatasetListItemSchema.array()).extend(
            {
              pagination: PaginationInfoSchema,
            },
          ),
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

app.openapi(listDatasetsRoute, async (c: any) => {
  try {
    const { data, pagination } = await listDatasets(c.req.valid("query"))

    return c.json({ success: true, data, pagination })
  } catch (error) {
    console.error("Error listing datasets:", error)
    return c.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to retrieve datasets",
        },
      },
      500,
    )
  }
})

const getDatasetRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["Datasets"],
  summary: "Get dataset details",
  description:
    "Get full details of a specific dataset. Rate limit: 100 requests per minute.",
  request: {
    params: IdParamSchema,
  },
  responses: {
    200: {
      description: "Successful response",
      content: {
        "application/json": {
          schema: createApiResponseSchema(DatasetDetailSchema),
        },
      },
    },
    404: {
      description: "Dataset not found",
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

app.openapi(getDatasetRoute, async (c: any) => {
  const { id } = c.req.valid("param")

  try {
    const dataset = await getDataset(id)

    if (!dataset) {
      return c.json(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Dataset not found",
          },
        },
        404,
      )
    }

    return c.json({
      success: true,
      data: dataset,
    })
  } catch (error) {
    console.error("Error getting dataset:", error)
    return c.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to retrieve dataset",
        },
      },
      500,
    )
  }
})

export default app
