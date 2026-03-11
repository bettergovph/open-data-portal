# Open Data Portal

A community-run portal (and API) for exploring publicly available datasets.

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

- `GET /api/v1/datasets` - List datasets with search and filters
- `GET /api/v1/datasets/:id` - Get dataset details
- `GET /api/v1/publishers` - List publishers
- `GET /api/v1/categories` - List categories
- `GET /api/v1/stats` - Platform statistics
- `GET /api/v1/ping` - Health check

### API Documentation

- **OpenAPI Schema:** `/openapi.json`
- **Swagger UI:** `/docs`

## License

This project is released under the [Creative Commons CC0](https://creativecommons.org/publicdomain/zero/1.0/) dedication. This means the work is dedicated to the public domain and can be freely used by anyone for any purpose without restriction under copyright law.
