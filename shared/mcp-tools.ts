/**
 * MCP server facts shared by the worker (tools/list, llms.txt, rate limit) and
 * the setup page, so the wording the models see is the wording people read.
 * Keep this module free of worker and portal imports.
 */

export const MCP_SERVER_NAME = "open-data-portal"

export const MCP_PROTOCOL_VERSIONS = ["2025-06-18", "2025-03-26", "2024-11-05"]

export const MCP_RATE_LIMIT_PER_MINUTE = 300

export const mcpToolMeta = {
  get_stats: {
    title: "Portal statistics",
    description:
      "Platform-wide totals: number of datasets, resources, publishers and categories, and the total size of all datasets in bytes.",
  },
  list_categories: {
    title: "List categories",
    description:
      "All dataset categories with their dataset and resource counts. Use this to discover valid category_id values for search_datasets.",
  },
  list_publishers: {
    title: "List publishers",
    description:
      "Paginated list of dataset publishers, sorted by name. Use this to discover valid publisher_id values for search_datasets.",
  },
  search_datasets: {
    title: "Search datasets",
    description:
      "Paginated list of datasets with optional full-text search and filters by category, publisher and file format. Each item has its publisher, category, attribution, license and resource count. Use get_dataset for the full record.",
  },
  get_dataset: {
    title: "Dataset details",
    description:
      "Full details of one dataset: description, tags, size, latest version date, attribution (authors, source, license), dataset-level license, and its publisher and category. Use list_resources for its files.",
  },
  list_resources: {
    title: "List a dataset's resources",
    description:
      "Paginated list of the resources (downloadable files) of one dataset, newest first, each with its MIME type, size and download_url.",
  },
  get_resource: {
    title: "Resource details",
    description:
      "Full details of one resource: name, description, MIME type, size, download_url and source_url.",
  },
} as const

export type McpToolName = keyof typeof mcpToolMeta
