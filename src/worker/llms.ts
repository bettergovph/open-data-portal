import { mcpToolMeta } from "../../shared/mcp-tools.ts"

const SITE_URL = "https://data.bettergov.ph"

const url = (path: string) => `${SITE_URL}${path}`

const tools = Object.entries(mcpToolMeta)
  .map(([name, tool]) => `- \`${name}\`: ${tool.description}`)
  .join("\n")

/**
 * The portal's llms.txt (https://llmstxt.org). Links always point at the
 * production site, so the file reads the same from localhost and previews.
 */
export const buildLlmsTxt = () => {
  return `# Open Data Portal

> A community-run portal for exploring public datasets, maintained by BetterGov.ph volunteers. Datasets, publishers, categories and downloadable files are available through a free, read-only JSON API and an MCP server. No API key is needed.

Content is in the public domain unless a dataset page says otherwise. Each dataset carries its own attribution, authors and license, so check them before reuse. Figures should be verified against the original source before relying on them.

All API responses use the shape \`{ "success": boolean, "data": ..., "pagination": ..., "error": ... }\`. The API is rate limited per IP address and returns HTTP 429 with a \`retry-after\` header when the limit is exceeded.

## API

- [API reference](${url("/docs")}): Interactive documentation for every endpoint
- [OpenAPI spec](${url("/openapi.json")}): Machine-readable description of the API
- [Datasets](${url("/api/v1/datasets")}): Search and list datasets, with filters and pagination
- [Publishers](${url("/api/v1/publishers")}): Organizations that publish datasets
- [Categories](${url("/api/v1/categories")}): Topics datasets are filed under, with counts
- [Resources](${url("/api/v1/resources")}): Downloadable files, each linked to a dataset
- [Stats](${url("/api/v1/stats")}): Totals for datasets, files, publishers and size

## MCP server

Connect an MCP-capable client to \`${url("/mcp")}\` (stateless JSON-RPC over HTTP POST, read-only, no authentication). Tools:

${tools}

- [MCP setup guide](${url("/mcp")}): Client configuration instructions

## Portal

- [Browse datasets](${url("/datasets")}): Search and filter the catalog
- [Browse categories](${url("/categories")}): Start from a topic
- [Working with datasets](${url("/working-with-datasets")}): Guidance on using the data
- [About](${url("/about")}): What the portal is and who it is for
- [Contribute](${url("/contribute")}): How to submit a dataset

## Optional

- [Terms of service](${url("/terms-of-service")})
- [Source code](https://github.com/bettergovph/open-data-portal)
- [BetterGov.ph](https://bettergov.ph/join-us)
`
}
