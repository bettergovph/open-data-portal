import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { initDB } from "./lib/db";
import type { Bindings } from "./lib/types";
import { apiV1Routes } from "./routes/v1";

// Import view routes
import viewIndexRoute from "./view";
import { notFoundRouter } from "./view/404";
import viewAboutRoute from "./view/about";
import viewCategoriesRoute from "./view/categories";
import viewContributeRoute from "./view/contribute";
import viewDatasetDetailRoute from "./view/dataset-detail";
import viewDatasetsRoute from "./view/datasets";
import viewResourceDetailRoute from "./view/resource-detail";
import viewTermsOfServiceRoute from "./view/terms-of-service";

const app = new OpenAPIHono<{ Bindings: Bindings }>();

// Middleware
app.use("/*", cors());

// Database initialization middleware
app.use("/*", async (c, next) => {
  initDB(c.env.DB);
  await next();
});

// View routes (mount before API routes to give them priority)
// Mount nested resource routes under datasets (must come before dataset detail route)
app.route("/datasets/:datasetId/resources", viewResourceDetailRoute);
app.route("/datasets", viewDatasetDetailRoute);
app.route("/datasets", viewDatasetsRoute);
app.route("/categories", viewCategoriesRoute);
app.route("/about", viewAboutRoute);
app.route("/contribute", viewContributeRoute);
app.route("/terms-of-service", viewTermsOfServiceRoute);
app.route("/", viewIndexRoute);

// API routes
app.route("/api/v1", apiV1Routes);

// OpenAPI documentation for v1
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
}));

// Default OpenAPI (points to latest version)
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
}));

// Swagger UI for v1
app.get("/docs/v1", swaggerUI({ url: "/openapi/v1.json" }));

// Default Swagger UI (points to latest)
app.get("/docs", swaggerUI({ url: "/openapi.json" }));

// Scalar API Reference for v1
app.get("/reference/v1", (c) => {
  return c.html(`
    <!doctype html>
    <html>
      <head>
        <title>API Reference - Open Data API v1</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <script
          id="api-reference"
          data-url="/openapi/v1.json"
          data-configuration='{"theme":"purple"}'
          src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
      </body>
    </html>
  `);
});

// Default Scalar API Reference (points to latest)
app.get("/reference", (c) => {
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
  // Check if the request is for an API endpoint
  const isApiRequest = c.req.url.includes("/api/");
  const acceptsHtml = c.req.header("accept")?.includes("text/html");

  // Return JSON for API requests, HTML for others
  if (isApiRequest || !acceptsHtml) {
    return c.json(
      {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Endpoint not found",
        },
      },
      404,
    );
  }

  // Use the custom 404 view for HTML requests
  return notFoundRouter.fetch(c.req.raw, c.env);
});

// Error handler
app.onError((err, c) => {
  console.error(err);
  return c.json(
    {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error",
      },
    },
    500,
  );
});

export default app;
