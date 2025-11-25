/** biome-ignore-all lint/suspicious/noExplicitAny: any is acceptable in Hono routes */
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { query, queryOne } from "../../lib/db";
import {
  createApiResponseSchema,
  DatasetDetailSchema,
  DatasetListItemSchema,
  DatasetListQuerySchema,
  ErrorResponseSchema,
  PaginationInfoSchema,
  parseAttribution,
} from "../../lib/schemas";
import type { DatasetDetail, DatasetListItem } from "../../lib/types";
import { calculatePagination } from "../../lib/utils";

const app = new OpenAPIHono();

// List datasets route
const listDatasetsRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Datasets"],
  summary: "List all datasets",
  description:
    "Get a paginated list of datasets with optional filtering, search, and sorting",
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
  },
});

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
  } = c.req.valid("query");

  try {
    // Build WHERE conditions
    const conditions: string[] = ["1=1"];
    const params: any[] = [];

    // Search condition
    if (search) {
      conditions.push(
        "(d.name LIKE ? OR d.description LIKE ? OR d.tags LIKE ?)",
      );
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    // Category filter
    if (category_id) {
      conditions.push("d.category_id = ?");
      params.push(category_id);
    }

    // Publisher filter
    if (publisher_id) {
      conditions.push("d.publisher_id = ?");
      params.push(publisher_id);
    }

    // Format filter (check resources)
    if (format) {
      conditions.push(
        "EXISTS (SELECT 1 FROM resources r WHERE r.dataset_id = d.id AND r.mime_type LIKE ?)",
      );
      params.push(`%${format}%`);
    }

    const whereClause = conditions.join(" AND ");

    // Count query
    const countSql = `
      SELECT COUNT(DISTINCT d.id) as total
      FROM datasets d
      WHERE ${whereClause}
    `;
    const countResult = await queryOne<{ total: number }>(countSql, params);
    const total = countResult?.total || 0;

    // Data query
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
    `;

    const datasets = await query<any>(dataSql, [...params, limit, offset]);

    // Transform results
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
    }));

    return c.json({
      success: true,
      data: transformedDatasets,
      pagination: calculatePagination(total, limit, offset),
    });
  } catch (error) {
    console.error("Error listing datasets:", error);
    return c.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to retrieve datasets",
        },
      },
      500,
    );
  }
});

// Get dataset details route
const getDatasetRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["Datasets"],
  summary: "Get dataset details",
  description: "Get full details of a specific dataset",
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
  },
});

app.openapi(getDatasetRoute, async (c: any) => {
  const { id } = c.req.valid("param");

  try {
    // Get dataset with publisher and category
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
    `;

    const dataset = await queryOne<any>(datasetSql, [id]);

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
      );
    }

    // Transform result
    const result: Omit<DatasetDetail, "resources"> = {
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
    };

    return c.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error getting dataset:", error);
    return c.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to retrieve dataset",
        },
      },
      500,
    );
  }
});

export default app;
