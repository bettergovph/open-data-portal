/** biome-ignore-all lint/suspicious/noExplicitAny: any is acceptable in Hono routes */
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi"
import { RATE_LIMIT_CONFIG } from "../../lib/config/rate-limit.ts"
import { query, queryOne } from "../../lib/db.ts"
import { rateLimit } from "../../lib/middleware/rate-limit.ts"
import {
  createApiResponseSchema,
  DatasetDetailSchema,
  DatasetListItemSchema,
  DatasetListQuerySchema,
  ErrorResponseSchema,
  PaginationInfoSchema,
  parseAttribution,
  RateLimitErrorResponseSchema,
} from "../../lib/schemas.ts"
import type { DatasetDetail, DatasetListItem } from "../../lib/types.ts"
import { calculatePagination, sanitizeFTSQuery } from "../../lib/utils.ts"

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
  const {
    search,
    category_id,
    publisher_id,
    format,
    sort,
    dir,
    limit,
    offset,
  } = c.req.valid("query")

  try {
    const conditions: string[] = ["1=1"]
    const params: any[] = []

    if (search) {
      const sanitizedSearch = sanitizeFTSQuery(search)
      if (sanitizedSearch) {
        conditions.push(
          "d.id IN (SELECT rowid FROM datasets_fts WHERE datasets_fts MATCH ?)",
        )
        params.push(sanitizedSearch)
      }
    }

    if (category_id) {
      conditions.push("d.category_id = ?")
      params.push(category_id)
    }

    if (publisher_id) {
      conditions.push("d.publisher_id = ?")
      params.push(publisher_id)
    }

    if (format) {
      conditions.push(
        "EXISTS (SELECT 1 FROM resources r WHERE r.dataset_id = d.id AND r.mime_type LIKE ?)",
      )
      params.push(`%${format}%`)
    }

    const whereClause = conditions.join(" AND ")

    const countSql = `
      SELECT COUNT(DISTINCT d.id) as total
      FROM datasets d
      WHERE ${whereClause}
    `
    const countResult = await queryOne<{ total: number }>(countSql, params)
    const total = countResult?.total || 0

    const dataSql = `
      SELECT
        d.id,
        d.name,
        d.description,
        d.publisher_id,
        d.category_id,
        d.tags,
        d.size_bytes,
        d.latest_version_date,
        d.attribution,
        d.license,
        d.license_url,
        p.id as publisher_id,
        p.name as publisher_name,
        c.id as category_id,
        c.name as category_name,
        (SELECT COUNT(*) FROM resources r WHERE r.dataset_id = d.id) as resource_count
      FROM datasets d
      LEFT JOIN publishers p ON d.publisher_id = p.id
      LEFT JOIN categories c ON d.category_id = c.id
      WHERE ${whereClause}
      ORDER BY d.${sort} ${dir.toUpperCase()}
      LIMIT ? OFFSET ?
    `

    const datasets = await query<any>(dataSql, [...params, limit, offset])

    const transformedDatasets: DatasetListItem[] = datasets.map((row: any) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      publisher_id: row.publisher_id,
      category_id: row.category_id,
      tags: row.tags,
      size_bytes: row.size_bytes,
      latest_version_date: row.latest_version_date,
      attribution: parseAttribution(row.attribution),
      license: row.license,
      license_url: row.license_url,
      publisher: {
        id: row.publisher_id,
        name: row.publisher_name,
      },
      category: {
        id: row.category_id,
        name: row.category_name,
      },
      resource_count: row.resource_count,
    }))

    return c.json({
      success: true,
      data: transformedDatasets,
      pagination: calculatePagination(total, limit, offset),
    })
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
    params: z.object({
      id: z.coerce.number().int().positive(),
    }),
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
    const datasetSql = `
      SELECT
        d.*,
        p.id as publisher_id,
        p.name as publisher_name,
        p.website_url as publisher_website_url,
        c.id as category_id,
        c.name as category_name,
        c.description as category_description
      FROM datasets d
      LEFT JOIN publishers p ON d.publisher_id = p.id
      LEFT JOIN categories c ON d.category_id = c.id
      WHERE d.id = ?
    `

    const dataset = await queryOne<any>(datasetSql, [id])

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

    const result: DatasetDetail = {
      id: dataset.id,
      name: dataset.name,
      description: dataset.description,
      publisher_id: dataset.publisher_id,
      category_id: dataset.category_id,
      tags: dataset.tags,
      size_bytes: dataset.size_bytes,
      latest_version_date: dataset.latest_version_date,
      attribution: parseAttribution(dataset.attribution),
      license: dataset.license,
      license_url: dataset.license_url,
      publisher: {
        id: dataset.publisher_id,
        name: dataset.publisher_name,
        website_url: dataset.publisher_website_url,
      },
      category: {
        id: dataset.category_id,
        name: dataset.category_name,
        description: dataset.category_description,
      },
    }

    return c.json({
      success: true,
      data: result,
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
