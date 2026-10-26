import { describe, expect, it } from "vitest"
import app from "../index.ts"

const dataset = {
  id: 1,
  name: "Political Dynasties",
  description: null,
  publisher_id: 2,
  category_id: 3,
  tags: null,
  size_bytes: 100,
  latest_version_date: "2024-11-20",
  attribution: JSON.stringify([
    {
      authors: ["Ateneo School of Government", "BetterGov.PH"],
      source_url: null,
      attribution_text: null,
      license: null,
      license_url: null,
    },
  ]),
  license: null,
  license_url: null,
  publisher_name: "Ateneo",
  publisher_website_url: null,
  category_name: "Government",
  category_description: null,
  resource_count: 1,
}

/** Minimal D1 stand-in that answers by matching on the SQL text. */
const fakeDB = {
  prepare: (sql: string) => {
    const result = (rows: unknown[]) => {
      const first = rows[0] ?? null
      return {
        all: async () => ({ results: rows }),
        first: async () => first,
      }
    }
    const answer = (): ReturnType<typeof result> => {
      if (sql.includes("FROM datasets_fts")) return result([])
      if (sql.includes("as total")) return result([{ total: 1 }])
      if (sql.includes("WHERE d.id = ?")) return result([dataset])
      if (sql.includes("FROM datasets d")) return result([dataset])
      if (sql.includes("FROM resources")) return result([])
      throw new Error(`unexpected query: ${sql}`)
    }
    return { bind: () => answer() }
  },
}

const ASSETS = { fetch: async () => new Response("<html>app shell</html>") }

const env = { DB: fakeDB, ASSETS, ENVIRONMENT: "development" }

const post = (body: unknown, testEnv: object = env) =>
  app.request(
    "/mcp",
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    },
    testEnv,
  )

// biome-ignore lint/suspicious/noExplicitAny: test response body structure
const json = async (res: Response) => (await res.json()) as any

const call = async (name: string, args: unknown = {}, testEnv?: object) => {
  const res = await post(
    {
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: { name, arguments: args },
    },
    testEnv,
  )
  return json(res)
}

describe("MCP server", () => {
  it("negotiates the protocol version on initialize", async () => {
    const res = await post({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: { protocolVersion: "2025-03-26" },
    })
    const body = await json(res)
    expect(res.status).toBe(200)
    expect(body.result.protocolVersion).toBe("2025-03-26")
    expect(body.result.serverInfo.name).toBe("open-data-portal")
    expect(body.result.capabilities.tools).toBeDefined()
  })

  it("lists tools with JSON Schema input schemas", async () => {
    const res = await post({ jsonrpc: "2.0", id: 1, method: "tools/list" })
    const { result } = await json(res)
    const names = result.tools.map((t: { name: string }) => t.name)
    expect(names).toEqual([
      "get_stats",
      "list_categories",
      "list_publishers",
      "search_datasets",
      "get_dataset",
      "list_resources",
      "get_resource",
    ])

    const search = result.tools.find(
      (t: { name: string }) => t.name === "search_datasets",
    )
    expect(search.inputSchema.$schema).toBeUndefined()
    expect(search.inputSchema.type).toBe("object")
    expect(search.inputSchema.properties.limit.type).toBe("integer")
    expect(search.inputSchema.properties.dir.enum).toEqual(["asc", "desc"])
    expect(search.inputSchema.properties.search.description).toBeTruthy()
  })

  it("returns the same data as the REST route", async () => {
    const body = await call("search_datasets", { limit: 10 })
    const mcp = JSON.parse(body.result.content[0].text)

    const rest = await json(await app.request("/api/v1/datasets", {}, env))
    expect(mcp).toEqual({ data: rest.data, pagination: rest.pagination })
    expect(mcp.data[0].attribution[0].authors).toEqual([
      "Ateneo School of Government",
      "BetterGov.PH",
    ])
  })

  it("coerces numeric string arguments like the REST API", async () => {
    const body = await call("get_dataset", { id: "1" })
    expect(body.result.isError).toBeUndefined()
    expect(JSON.parse(body.result.content[0].text).name).toBe(
      "Political Dynasties",
    )
  })

  it("reports a missing record as a tool error", async () => {
    const res = await post({
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: { name: "get_resource", arguments: { id: 99 } },
    })
    const { result } = await json(res)
    expect(result.isError).toBe(true)
    expect(result.content[0].text).toContain("Resource 99 not found")
  })

  it("reports invalid arguments as a tool error", async () => {
    const body = await call("search_datasets", { limit: 5 })
    expect(body.result.isError).toBe(true)
    expect(body.result.content[0].text).toContain("limit")
  })

  it("does not leak database errors", async () => {
    const brokenDB = {
      prepare: () => {
        throw new Error("D1_ERROR: no such table: secrets")
      },
    }
    const body = await call("get_stats", {}, { ...env, DB: brokenDB })
    expect(body.result.isError).toBe(true)
    expect(body.result.content[0].text).toBe("Error — Internal error")
  })

  it("rejects unknown tools and methods", async () => {
    expect((await call("nope")).error.code).toBe(-32602)
    const res = await post({ jsonrpc: "2.0", id: 1, method: "nope" })
    expect((await json(res)).error.code).toBe(-32601)
  })

  it("acknowledges notifications with 202 and no body", async () => {
    const res = await post({
      jsonrpc: "2.0",
      method: "notifications/initialized",
    })
    expect(res.status).toBe(202)
    expect(await res.text()).toBe("")
  })

  it("answers batches and caps their size", async () => {
    const ok = await post([
      { jsonrpc: "2.0", id: 1, method: "ping" },
      { jsonrpc: "2.0", id: 2, method: "ping" },
    ])
    expect(await json(ok)).toHaveLength(2)

    const tooMany = await post(
      Array.from({ length: 11 }, (_, i) => ({
        jsonrpc: "2.0",
        id: i,
        method: "ping",
      })),
    )
    expect(tooMany.status).toBe(400)
  })

  it("rejects malformed JSON and non-POST methods", async () => {
    const bad = await app.request(
      "/mcp",
      { method: "POST", body: "{nope" },
      env,
    )
    expect(bad.status).toBe(400)
    expect((await json(bad)).error.code).toBe(-32700)

    const get = await app.request("/mcp", {}, env)
    expect(get.status).toBe(405)
    expect(get.headers.get("allow")).toBe("POST, OPTIONS")
  })

  it("answers CORS preflight", async () => {
    const res = await app.request(
      "/mcp",
      {
        method: "OPTIONS",
        headers: {
          origin: "https://example.com",
          "access-control-request-method": "POST",
          "access-control-request-headers": "content-type,mcp-protocol-version",
        },
      },
      env,
    )
    expect(res.status).toBe(204)
    expect(res.headers.get("access-control-allow-origin")).toBe("*")
    expect(res.headers.get("access-control-allow-headers")).toContain(
      "mcp-protocol-version",
    )
  })

  it("serves the setup page to browsers and the server to MCP clients", async () => {
    const page = await app.request(
      "/mcp",
      { headers: { accept: "text/html,application/xhtml+xml" } },
      env,
    )
    expect(page.status).toBe(200)
    expect(await page.text()).toContain("app shell")

    const stream = await app.request(
      "/mcp",
      { headers: { accept: "text/event-stream" } },
      env,
    )
    expect(stream.status).toBe(405)
  })
})
