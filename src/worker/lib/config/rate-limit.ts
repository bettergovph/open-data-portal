import { MCP_RATE_LIMIT_PER_MINUTE } from "../../../../shared/mcp-tools.ts"
import type { RateLimitConfig } from "../rate-limiter.ts"

export type RateLimitTier =
  | "search"
  | "list"
  | "stats"
  | "detail"
  | "ping"
  | "mcp"
  | "default"

export const RATE_LIMIT_CONFIG: Record<RateLimitTier, RateLimitConfig> = {
  search: {
    windowMs: 60_000,
    maxRequests: 60,
  },
  list: {
    windowMs: 60_000,
    maxRequests: 60,
  },
  stats: {
    windowMs: 60_000,
    maxRequests: 60,
  },
  detail: {
    windowMs: 60_000,
    maxRequests: 100,
  },
  ping: {
    windowMs: 60_000,
    maxRequests: 1_000,
  },
  // Hosted MCP clients share egress IPs, so one address can carry many users.
  mcp: {
    windowMs: 60_000,
    maxRequests: MCP_RATE_LIMIT_PER_MINUTE,
  },
  default: {
    windowMs: 60_000,
    maxRequests: 100,
  },
}
