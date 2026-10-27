/* oxlint-disable typescript/no-explicit-any -- any is acceptable for raw D1 rows */
import { query, queryOne } from "./db.ts"
import {
  type CategoryListQuery,
  type DatasetListQuery,
  type PublisherListQuery,
  parseAttribution,
  type ResourceListQuery,
} from "./schemas.ts"
import type {
  CategoryListItem,
  DatasetDetail,
  DatasetListItem,
  PaginationInfo,
  Publisher,
  Resource,
  Stats,
} from "./types.ts"
import { calculatePagination, sanitizeFTSQuery } from "./utils.ts"

/**
 * Data access shared by the REST routes and the MCP server, so both always
 * return the same results. Inputs are expected to be already validated
 * against the matching schema in schemas.ts.
 */

interface Page<T> {
  data: T[]
  pagination: PaginationInfo
}

/** The dataset columns common to list items and the detail record. */
const datasetFields = (row: any) => ({
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
})

export const listDatasets = async ({
  search,
  category_id,
  publisher_id,
  format,
  sort,
  dir,
  limit,
  offset,
}: DatasetListQuery): Promise<Page<DatasetListItem>> => {
  const conditions: string[] = ["1=1"]
  const params: any[] = []

  if (search) {
    const sanitizedSearch = sanitizeFTSQuery(search)
    if (sanitizedSearch) {
      conditions.push("d.id IN (SELECT rowid FROM datasets_fts WHERE datasets_fts MATCH ?)")
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
    conditions.push("EXISTS (SELECT 1 FROM resources r WHERE r.dataset_id = d.id AND r.mime_type LIKE ?)")
    params.push(`%${format}%`)
  }

  const whereClause = conditions.join(" AND ")

  const countSql = `
    SELECT COUNT(*) as total
    FROM datasets d
    WHERE ${whereClause}
  `

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

  const [countResult, datasets] = await Promise.all([
    queryOne<{ total: number }>(countSql, params),
    query<any>(dataSql, [...params, limit, offset]),
  ])
  const total = countResult?.total || 0

  const data: DatasetListItem[] = datasets.map((row: any) => ({
    ...datasetFields(row),
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

  return { data, pagination: calculatePagination(total, limit, offset) }
}

export const getDataset = async (id: number): Promise<DatasetDetail | null> => {
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
  if (!dataset) return null

  return {
    ...datasetFields(dataset),
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
}

export const listPublishers = async ({ search, limit, offset }: PublisherListQuery): Promise<Page<Publisher>> => {
  const params: any[] = []
  let whereClause = "1=1"

  if (search) {
    whereClause = "p.name LIKE ?"
    params.push(`%${search}%`)
  }

  const countSql = `SELECT COUNT(*) as total FROM publishers p WHERE ${whereClause}`
  const dataSql = `
    SELECT p.*
    FROM publishers p
    WHERE ${whereClause}
    ORDER BY p.name ASC
    LIMIT ? OFFSET ?
  `

  const [countResult, data] = await Promise.all([
    queryOne<{ total: number }>(countSql, params),
    query<Publisher>(dataSql, [...params, limit, offset]),
  ])
  const total = countResult?.total || 0

  return { data, pagination: calculatePagination(total, limit, offset) }
}

export const listCategories = async ({ search }: CategoryListQuery): Promise<CategoryListItem[]> => {
  const params: any[] = []
  let whereClause = "1=1"

  if (search) {
    whereClause = "c.name LIKE ?"
    params.push(`%${search}%`)
  }

  const dataSql = `
    SELECT
      c.*,
      (SELECT COUNT(*) FROM datasets d WHERE d.category_id = c.id) as dataset_count,
      (SELECT COUNT(*) FROM resources r
       INNER JOIN datasets d ON r.dataset_id = d.id
       WHERE d.category_id = c.id) as resource_count
    FROM categories c
    WHERE ${whereClause}
    ORDER BY c.name ASC
  `

  return query<CategoryListItem>(dataSql, params)
}

export const listResources = async ({ dataset_id, limit, offset }: ResourceListQuery): Promise<Page<Resource>> => {
  const countSql = `
    SELECT COUNT(*) as total
    FROM resources
    WHERE dataset_id = ?
  `
  const dataSql = `
    SELECT *
    FROM resources
    WHERE dataset_id = ?
    ORDER BY id DESC
    LIMIT ? OFFSET ?
  `

  const [countResult, data] = await Promise.all([
    queryOne<{ total: number }>(countSql, [dataset_id]),
    query<Resource>(dataSql, [dataset_id, limit, offset]),
  ])
  const total = countResult?.total || 0

  return { data, pagination: calculatePagination(total, limit, offset) }
}

export const getResource = async (id: number): Promise<Resource | null> =>
  queryOne<Resource>(
    `
    SELECT *
    FROM resources
    WHERE id = ?
  `,
    [id],
  )

export const getStats = async (): Promise<Stats | null> =>
  queryOne<Stats>(
    `
    SELECT
      (SELECT COUNT(*) FROM datasets) as total_datasets,
      (SELECT COUNT(*) FROM resources) as total_resources,
      (SELECT COUNT(*) FROM publishers) as total_publishers,
      (SELECT COUNT(*) FROM categories) as total_categories,
      (SELECT COALESCE(SUM(size_bytes), 0) FROM datasets) as total_size_bytes
  `,
    [],
  )
