import { OpenAPIHono } from '@hono/zod-openapi';
import { swaggerUI } from '@hono/swagger-ui';
import { cors } from 'hono/cors';
import { initDB } from './lib/db';
import type { Bindings } from './lib/types';

// Import API routes
import datasetsRoutes from './routes/datasets';
import publishersRoutes from './routes/publishers';
import categoriesRoutes from './routes/categories';
import resourcesRoutes from './routes/resources';
import statsRoutes from './routes/stats';
import pingRoutes from './routes/ping';

// Import view routes
import viewIndexRoute from './view';
import viewDatasetsRoute from './view/datasets';
import viewDatasetDetailRoute from './view/dataset-detail';
import viewResourceDetailRoute from './view/resource-detail';

const app = new OpenAPIHono<{ Bindings: Bindings }>();

// Middleware
app.use('/*', cors());

// Database initialization middleware
app.use('/*', async (c, next) => {
  initDB(c.env.DB);
  await next();
});

// View routes (mount before API routes to give them priority)
// Mount nested resource routes under datasets (must come before dataset detail route)
app.route('/datasets/:datasetId/resources', viewResourceDetailRoute);
app.route('/datasets', viewDatasetDetailRoute);
app.route('/datasets', viewDatasetsRoute);
app.route('/', viewIndexRoute);

// API routes
app.route('/api/datasets', datasetsRoutes);
app.route('/api/publishers', publishersRoutes);
app.route('/api/categories', categoriesRoutes);
app.route('/api/resources', resourcesRoutes);
app.route('/api/stats', statsRoutes);
app.route('/api/ping', pingRoutes);

// OpenAPI documentation
app.doc('/openapi.json', (c) => ({
  openapi: '3.1.0',
  info: {
    title: 'Open Data Portal API',
    version: '1.0.0',
    description: 'Public API for accessing open datasets with search, filtering, and pagination capabilities.',
  },
  servers: [
    {
      url: new URL(c.req.url).origin,
      description: 'Open Data Portal API',
    },
  ],
}));

// Swagger UI
app.get('/docs', swaggerUI({ url: '/openapi.json' }));

// Scalar API Reference (modern, beautiful alternative to Swagger)
app.get('/reference', (c) => {
  return c.html(`
    <!doctype html>
    <html>
      <head>
        <title>API Reference - Open Data API</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <script
          id="api-reference"
          data-url="/openapi.json"
          data-configuration='{"theme":"purple"}'
          src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
      </body>
    </html>
  `);
});

// 404 handler
app.notFound((c) => {
  return c.json(
    {
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Endpoint not found',
      },
    },
    404
  );
});

// Error handler
app.onError((err, c) => {
  console.error(err);
  return c.json(
    {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
      },
    },
    500
  );
});

export default app;
