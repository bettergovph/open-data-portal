/**
 * MCP (Model Context Protocol) server at /mcp.
 *
 * Stateless Streamable HTTP transport: every JSON-RPC message arrives as a
 * POST and gets a plain application/json reply — no sessions, no SSE stream,
 * no server-initiated messages. That is all a read-only data server needs.
 * GET/DELETE return 405 as the spec allows for servers that never open a
 * stream.
 *
 * Every tool delegates to the same data functions the public REST API uses
 * (src/worker/lib/data.ts) and validates its arguments with the same Zod
 * schemas, so tool results and REST responses can never disagree.
 *
 * Connect with any MCP client, e.g.:
 *   claude mcp add --transport http open-data-portal https://<host>/mcp
 */

import { z } from "@hono/zod-openapi"
import { MCP_PROTOCOL_VERSIONS, MCP_SERVER_NAME, type McpToolName, mcpToolMeta } from "../../shared/mcp-tools.ts"
import {
  getDataset,
  getResource,
  getStats,
  listCategories,
  listDatasets,
  listPublishers,
  listResources,
} from "./lib/data.ts"
import {
  CategoryListQuerySchema,
  DatasetListQuerySchema,
  IdParamSchema,
  PublisherListQuerySchema,
  ResourceListQuerySchema,
} from "./lib/schemas.ts"

const SERVER_INFO = {
  name: MCP_SERVER_NAME,
  title: "Open Data Portal",
  version: "1.0.0",
}

const LATEST_PROTOCOL = MCP_PROTOCOL_VERSIONS[0]

/** Each message in a batch can hit the database, so keep batches small. */
const MAX_BATCH_SIZE = 10

const INSTRUCTIONS = `Read-only access to the Open Data Portal catalog of open datasets.

Model: a dataset has one publisher and one category and holds one or more resources
(the downloadable files). Datasets carry an 'attribution' list — each entry names its
'authors', original source, and license — plus dataset-level license fields.

Start with get_stats for a sense of scale, list_categories / list_publishers to discover
ids, then search_datasets (filter by search text, category_id, publisher_id or file
format). Use get_dataset for one dataset's full details, and list_resources to see its
files — each resource has a 'download_url' to fetch the data itself.

List tools are paginated with limit/offset; the response 'pagination' says whether
'has_more' results remain. When presenting a dataset, keep its attribution and license
with it.`

// ---------------------------------------------------------------------------
// Tool registry
// ---------------------------------------------------------------------------

interface Tool {
  name: string
  title: string
  description: string
  inputSchema: Record<string, unknown>
  /** Validates the raw arguments, then runs the tool. */
  run: (args: unknown) => Promise<unknown>
}

/** A failure the model should see and be able to correct. */
class ToolError extends Error {}

const defineTool = <S extends z.ZodType>(tool: {
  name: McpToolName
  schema: S
  handler: (args: z.output<S>) => Promise<unknown>
}): Tool => {
  const { $schema: _, ...inputSchema } = z.toJSONSchema(tool.schema, {
    io: "input",
  })
  return {
    name: tool.name,
    ...mcpToolMeta[tool.name],
    inputSchema,
    run: (args) => tool.handler(tool.schema.parse(args)),
  }
}

const found = <T>(value: T | null, what: string, id: number): T => {
  if (value === null) throw new ToolError(`${what} ${id} not found`)
  return value
}

const TOOLS: Tool[] = [
  defineTool({
    name: "get_stats",
    schema: z.object({}),
    handler: () => getStats(),
  }),
  defineTool({
    name: "list_categories",
    schema: CategoryListQuerySchema,
    handler: (args) => listCategories(args),
  }),
  defineTool({
    name: "list_publishers",
    schema: PublisherListQuerySchema,
    handler: (args) => listPublishers(args),
  }),
  defineTool({
    name: "search_datasets",
    schema: DatasetListQuerySchema,
    handler: (args) => listDatasets(args),
  }),
  defineTool({
    name: "get_dataset",
    schema: IdParamSchema,
    handler: async ({ id }) => found(await getDataset(id), "Dataset", id),
  }),
  defineTool({
    name: "list_resources",
    schema: ResourceListQuerySchema,
    handler: (args) => listResources(args),
  }),
  defineTool({
    name: "get_resource",
    schema: IdParamSchema,
    handler: async ({ id }) => found(await getResource(id), "Resource", id),
  }),
]

const TOOL_MAP = new Map(TOOLS.map((t) => [t.name, t]))

// ---------------------------------------------------------------------------
// JSON-RPC plumbing
// ---------------------------------------------------------------------------

interface RpcMessage {
  jsonrpc?: string
  id?: number | string | null
  method?: string
  params?: Record<string, unknown>
}

const rpcResult = (id: number | string, result: unknown) => ({
  jsonrpc: "2.0" as const,
  id,
  result,
})

const rpcError = (id: number | string | null, code: number, message: string) => ({
  jsonrpc: "2.0" as const,
  id,
  error: { code, message },
})

const describeError = (e: unknown): string => {
  if (e instanceof z.ZodError) {
    const issues = e.issues.map((i) => `${i.path.join(".") || "arguments"}: ${i.message}`).join("; ")
    return `Invalid arguments — ${issues}`
  }
  if (e instanceof ToolError) return e.message
  // Anything else (e.g. a D1 failure) is not for the model to see.
  console.error("MCP tool error:", e)
  return "Internal error"
}

const callTool = async (tool: Tool, args: unknown) => {
  try {
    const result = await tool.run(args)
    return { content: [{ type: "text", text: JSON.stringify(result) }] }
  } catch (e) {
    // Tool execution failures are results (isError), not protocol errors —
    // the model should see them and correct its inputs.
    return {
      content: [{ type: "text", text: `Error — ${describeError(e)}` }],
      isError: true,
    }
  }
}

const handleMessage = async (msg: RpcMessage): Promise<object | null> => {
  if (msg.jsonrpc !== "2.0" || typeof msg.method !== "string") {
    return rpcError(msg.id ?? null, -32600, "Invalid Request")
  }
  const isNotification = msg.id === undefined || msg.id === null
  const id = msg.id as number | string
  const params = msg.params ?? {}

  switch (msg.method) {
    case "initialize": {
      const requested = typeof params.protocolVersion === "string" ? params.protocolVersion : ""
      const protocolVersion = MCP_PROTOCOL_VERSIONS.includes(requested) ? requested : LATEST_PROTOCOL
      return rpcResult(id, {
        protocolVersion,
        capabilities: { tools: { listChanged: false } },
        serverInfo: SERVER_INFO,
        instructions: INSTRUCTIONS,
      })
    }
    case "notifications/initialized":
    case "notifications/cancelled":
      return null
    case "ping":
      return rpcResult(id, {})
    case "tools/list":
      return rpcResult(id, {
        tools: TOOLS.map(({ name, title, description, inputSchema }) => ({
          name,
          title,
          description,
          inputSchema,
        })),
      })
    case "tools/call": {
      if (isNotification) return null
      const tool = TOOL_MAP.get(String(params.name))
      return tool
        ? rpcResult(id, await callTool(tool, params.arguments ?? {}))
        : rpcError(id, -32602, `Unknown tool: ${params.name}`)
    }
    default:
      if (isNotification) return null
      return rpcError(id, -32601, `Method not found: ${msg.method}`)
  }
}

// ---------------------------------------------------------------------------
// HTTP entry point
// ---------------------------------------------------------------------------

/** CORS and rate limiting are applied by the router in index.ts. */
export const handleMcp = async (request: Request): Promise<Response> => {
  if (request.method !== "POST") {
    // Stateless server: no SSE stream to open (GET) and no session to end
    // (DELETE). 405 with Allow is what the Streamable HTTP spec prescribes.
    return Response.json(rpcError(null, -32000, "This MCP server is stateless — send JSON-RPC messages via POST"), {
      status: 405,
      headers: { Allow: "POST, OPTIONS" },
    })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json(rpcError(null, -32700, "Parse error: body is not valid JSON"), { status: 400 })
  }

  // Older protocol revisions allow JSON-RPC batches; answer them too.
  const messages: RpcMessage[] = Array.isArray(body) ? body : [body as RpcMessage]
  if (messages.length === 0 || messages.length > MAX_BATCH_SIZE) {
    return Response.json(rpcError(null, -32600, `Invalid Request: batch must contain 1-${MAX_BATCH_SIZE} messages`), {
      status: 400,
    })
  }

  const responses = (await Promise.all(messages.map(handleMessage))).filter((r): r is object => r !== null)

  // Notifications only — acknowledge with 202 and no body.
  if (responses.length === 0) return new Response(null, { status: 202 })

  return Response.json(Array.isArray(body) ? responses : responses[0])
}
