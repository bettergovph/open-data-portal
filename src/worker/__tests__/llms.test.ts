import { describe, expect, it } from "vitest"
import { mcpToolMeta } from "../../../shared/mcp-tools.ts"
import app from "../index.ts"

const env = {
  DB: {},
  ASSETS: { fetch: async () => new Response("<html>app shell</html>") },
  ENVIRONMENT: "development",
}

const get = () => app.request("http://localhost:5173/llms.txt", {}, env)

describe("llms.txt", () => {
  it("is served as plain text", async () => {
    const res = await get()
    expect(res.status).toBe(200)
    expect(res.headers.get("content-type")).toContain("text/plain")
  })

  it("follows the llms.txt structure", async () => {
    const text = await (await get()).text()
    const lines = text.split("\n")
    expect(lines[0]).toBe("# Open Data Portal")
    expect(lines.filter((line) => line.startsWith("# "))).toHaveLength(1)
    expect(lines[2]).toMatch(/^> /)
    expect(text).toContain("\n## Optional\n")
  })

  it("links to the production site", async () => {
    const text = await (await get()).text()
    expect(text).toContain("(https://data.bettergov.ph/docs)")
    expect(text).toContain("`https://data.bettergov.ph/mcp`")
  })

  it("lists every MCP tool", async () => {
    const text = await (await get()).text()
    for (const name of Object.keys(mcpToolMeta))
      expect(text).toContain(`\`${name}\``)
  })
})
