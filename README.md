# Open Data Portal

A community-run portal (and API) for exploring publicly available datasets.

## Tech Stack

- **Platform:** Cloudflare Workers + D1 (SQLite)
- **Framework:** Hono 4.x
- **Database:** Cloudflare D1
- **Validation:** Zod
- **API Docs:** @hono/zod-openapi with Swagger UI
- **Language:** TypeScript

## Prerequisites

- Node.js 22+
- pnpm
- Cloudflare account (free tier)

## Local Development

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Login to Cloudflare:**
   ```bash
   pnpx wrangler login
   ```

3. **Create D1 database:**
   ```bash
   pnpx wrangler d1 create open-data-db
   ```

   Copy the `database_id` from the output and update `wrangler.toml`.

4. **Run migrations (local):**
   ```bash
   pnpm run db:migrate:local
   ```

5. **Initialize the database (local):**
   ```bash
   pnpx run db:init:local
   ```

6. Start the local development server:
   ```bash
   pnpm run dev
   ```

## API

### API Endpoints

- `GET /api/datasets` - List datasets with search and filters
- `GET /api/datasets/:id` - Get dataset details
- `GET /api/publishers` - List publishers
- `GET /api/categories` - List categories
- `GET /api/stats` - Platform statistics
- `GET /api/ping` - Health check

### API Documentation

- **OpenAPI Schema:** `/openapi.json`
- **Swagger UI:** `/docs`
- **Scalar Reference:** `/reference`

## License

This project is released under the [Creative Commons CC0](https://creativecommons.org/publicdomain/zero/1.0/) dedication. This means the work is dedicated to the public domain and can be freely used by anyone for any purpose without restriction under copyright law.
