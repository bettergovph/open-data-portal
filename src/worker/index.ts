import { swaggerUI } from "@hono/swagger-ui"
import { OpenAPIHono } from "@hono/zod-openapi"
import { cors } from "hono/cors"
import { RATE_LIMIT_CONFIG } from "./lib/config/rate-limit.ts"
import { initDB } from "./lib/db.ts"
import { rateLimit } from "./lib/middleware/rate-limit.ts"
import type { Bindings } from "./lib/types.ts"
import { buildLlmsTxt } from "./llms.ts"
import { handleMcp } from "./mcp.ts"
import { apiV1Routes } from "./routes/v1"

const LLMS_TXT = buildLlmsTxt()

const app = new OpenAPIHono<{ Bindings: Bindings }>()

app.use("/*", async (c, next) => {
  initDB(c.env.DB)
  await next()
})

app.route("/api/v1", apiV1Routes)

// Browsers get the setup guide (a route of the SPA); MCP clients, which never
// ask for HTML, get the server below.
app.get("/mcp", async (c, next) => {
  if (c.req.header("accept")?.includes("text/html")) {
    return c.env.ASSETS.fetch(new Request(new URL("/", c.req.url), c.req.raw))
  }
  await next()
})

app.use("/mcp", cors())
app.use("/mcp", rateLimit({ config: RATE_LIMIT_CONFIG.mcp }))
app.all("/mcp", (c) => handleMcp(c.req.raw))

app.get("/llms.txt", (c) =>
  c.text(LLMS_TXT, 200, {
    "content-type": "text/plain; charset=utf-8",
    "cache-control": "public, max-age=3600",
  }),
)

app.doc("/openapi/v1.json", (c) => ({
  openapi: "3.1.0",
  info: {
    title: "Open Data Portal API",
    version: "1.0.0",
    description:
      "Public API for accessing open datasets with search, filtering, and pagination capabilities.",
  },
  servers: [
    {
      url: new URL(c.req.url).origin,
      description: "Open Data Portal API v1",
    },
  ],
}))

app.doc("/openapi.json", (c) => ({
  openapi: "3.1.0",
  info: {
    title: "Open Data Portal API",
    version: "1.0.0",
    description:
      "Public API for accessing open datasets with search, filtering, and pagination capabilities.",
  },
  servers: [
    {
      url: new URL(c.req.url).origin,
      description: "Open Data Portal API (latest: v1)",
    },
  ],
}))

app.get("/docs/v1", swaggerUI({ url: "/openapi/v1.json" }))
app.get("/docs", swaggerUI({ url: "/openapi.json" }))

app.get("*", async (c) => {
  const path = c.req.path
  // Only serve assets for non-API/docs routes
  if (
    !path.startsWith("/api/") &&
    !path.startsWith("/docs") &&
    !path.startsWith("/openapi")
  ) {
    return c.env.ASSETS.fetch(c.req.raw)
  }
  // Let API/docs routes that don't match continue to notFound handler
  return c.notFound()
})

app.notFound((c) => {
  return c.json(
    {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: "Endpoint not found",
      },
    },
    404,
  )
})

app.onError((err, c) => {
  console.error(err)
  return c.json(
    {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error",
      },
    },
    500,
  )
})

export default app
