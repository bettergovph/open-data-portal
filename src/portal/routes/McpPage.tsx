import type { ReactNode } from "react"
import {
  MCP_PROTOCOL_VERSIONS,
  MCP_RATE_LIMIT_PER_MINUTE,
  MCP_SERVER_NAME,
  mcpToolMeta,
} from "../../../shared/mcp-tools.ts"
import { CodeBlock } from "../components/CodeBlock.tsx"
import { mcpExamplePrompts } from "../lib/mcp-prompts.ts"

const mcpTools = Object.entries(mcpToolMeta)

interface ClientGuide {
  name: string
  intro: string
  body: ReactNode
}

const Note = ({ children }: { children: ReactNode }) => (
  <p className="mt-4 mb-2 text-sm text-neutral-600">{children}</p>
)

const buildClients = (url: string): ClientGuide[] => [
  {
    name: "Claude Code",
    intro: "Run one command in your terminal.",
    body: (
      <CodeBlock
        label="Claude Code command"
        code={`claude mcp add --transport http ${MCP_SERVER_NAME} ${url}`}
      />
    ),
  },
  {
    name: "Claude.ai and Claude Desktop",
    intro: "Add the portal as a custom connector.",
    body: (
      <ol className="list-decimal pl-5 space-y-1.5 text-sm text-neutral-700 marker:text-neutral-500">
        <li>
          Open <strong className="text-ink">Settings → Connectors</strong>
        </li>
        <li>
          Choose <strong className="text-ink">Add custom connector</strong>
        </li>
        <li>Name it Open Data Portal and paste the server URL above</li>
      </ol>
    ),
  },
  {
    name: "OpenAI Codex",
    intro: "Add the server to ~/.codex/config.toml.",
    body: (
      <>
        <CodeBlock
          label="Codex config"
          code={`[mcp_servers.${MCP_SERVER_NAME}]\nurl = "${url}"`}
        />
        <Note>
          If your Codex version can’t connect to remote servers, bridge through
          mcp-remote instead:
        </Note>
        <CodeBlock
          label="Codex bridge command"
          code={`codex mcp add ${MCP_SERVER_NAME} -- npx -y mcp-remote ${url}`}
        />
      </>
    ),
  },
  {
    name: "Cursor",
    intro: "Add to .cursor/mcp.json (project) or ~/.cursor/mcp.json (global).",
    body: (
      <CodeBlock
        label="Cursor config"
        code={`{\n  "mcpServers": {\n    "${MCP_SERVER_NAME}": { "url": "${url}" }\n  }\n}`}
      />
    ),
  },
  {
    name: "VS Code (Copilot)",
    intro: "Add to .vscode/mcp.json, or run the command below.",
    body: (
      <>
        <CodeBlock
          label="VS Code config"
          code={`{\n  "servers": {\n    "${MCP_SERVER_NAME}": { "type": "http", "url": "${url}" }\n  }\n}`}
        />
        <div className="mt-3">
          <CodeBlock
            label="VS Code command"
            code={`code --add-mcp '{"name":"${MCP_SERVER_NAME}","type":"http","url":"${url}"}'`}
          />
        </div>
      </>
    ),
  },
  {
    name: "Other MCP clients",
    intro:
      "Any client that speaks Streamable HTTP can connect directly. For clients that only support stdio, use the mcp-remote bridge.",
    body: (
      <>
        <CodeBlock
          label="mcp-remote command"
          code={`npx -y mcp-remote ${url}`}
        />
        <p className="mt-3 text-xs text-neutral-600 leading-relaxed">
          The server is stateless JSON-RPC over POST: no sessions, no streaming,
          no authentication. Supported protocol versions:{" "}
          {MCP_PROTOCOL_VERSIONS.join(", ")}.
        </p>
      </>
    ),
  },
]

export const McpPage = () => {
  const serverUrl = `${window.location.origin}/mcp`
  const clients = buildClients(serverUrl)

  return (
    <>
      <section>
        <div className="container-custom pt-8 md:pt-10 pb-10 md:pb-12">
          <h1 className="page-title">Open data, inside your AI</h1>
          <p className="page-dek">
            Connect Claude, Codex, Cursor or any MCP-capable client to the Open
            Data Portal, then search datasets, publishers and files from your
            conversation. It’s free and public, and needs no API key.
          </p>

          <div className="mt-8 max-w-2xl">
            <p className="field-label">Server URL</p>
            <CodeBlock label="server URL" code={serverUrl} />
            <p className="mt-2 text-sm text-neutral-600">
              Limited to {MCP_RATE_LIMIT_PER_MINUTE} requests per minute per IP
              address. Read-only.
            </p>
          </div>
        </div>
      </section>

      <section className="container-custom pt-12 pb-12">
        <div className="page-head">
          <h2 className="text-2xl md:text-3xl">Set up in your client</h2>
          <p className="page-dek">
            Pick your tool. Most take a single command or a small config entry.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {clients.map((client) => (
            <article
              key={client.name}
              className="border border-rule rounded-sm p-5 md:p-6"
            >
              <h3 className="text-lg md:text-xl">{client.name}</h3>
              <p className="mt-1 mb-4 text-sm text-neutral-600">
                {client.intro}
              </p>
              {client.body}
            </article>
          ))}
        </div>
      </section>

      <section className="container-custom pt-12 pb-12">
        <div className="page-head">
          <h2 className="text-2xl md:text-3xl">What your AI can do with it</h2>
          <p className="page-dek">
            {mcpTools.length} read-only tools, backed by the same data as the
            REST API.
          </p>
        </div>

        <ul className="grid md:grid-cols-2 gap-x-10 border-t border-ink">
          {mcpTools.map(([name, tool]) => (
            <li key={name} className="py-4 border-b border-rule-soft">
              <code className="font-mono text-sm font-medium text-primary-700">
                {name}
              </code>
              <p className="mt-1 text-sm text-neutral-600">
                {tool.description}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-custom pt-12">
        <h2 className="text-2xl md:text-3xl">Try asking</h2>
        <ul className="mt-5 max-w-3xl border-t border-ink">
          {mcpExamplePrompts.map((prompt) => (
            <li
              key={prompt}
              className="py-3 border-b border-rule-soft text-base text-ink"
            >
              {prompt}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-neutral-600">
          Prefer plain HTTP?{" "}
          <a
            href="/docs"
            className="font-semibold text-primary-600 border-b border-primary-600 hover:text-primary-700"
          >
            Read the API reference
          </a>
        </p>
      </section>
    </>
  )
}
