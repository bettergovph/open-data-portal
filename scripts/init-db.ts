/**
 * Seed script for D1 database
 *
 * This script reads init-db-data.json and generates SQL statements to seed the database.
 *
 * Usage:
 * 1. Run this script: pnpm tsx scripts/init-db.ts
 * 2. Execute the generated SQL:
 *    - Local: npx wrangler d1 execute open-data-db --local --file=./scripts/init.sql
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface SampleData {
  publishers: Array<{
    name: string;
    description?: string;
    website?: string;
  }>;
  categories: Array<{
    name: string;
    description?: string;
    icon?: string;
  }>;
  datasets: Array<{
    name: string;
    description: string;
    tags: string[];
    publisher_name: string;
    category_name: string;
    latest_version_date?: string;
    resources: Array<{
      name: string;
      description: string;
      url: string;
      size: number;
      mime_type: string;
    }>;
  }>;
}

// Escape single quotes in SQL strings
function escapeSql(value: string): string {
  return value.replace(/'/g, "''");
}

// Read sample data
const data: SampleData = JSON.parse(
  readFileSync(join(__dirname, "init-db-data.json"), "utf-8"),
);

// Generate SQL statements
const statements: string[] = [];

statements.push("-- Seed script generated at " + new Date().toISOString());
statements.push("");

// Optional: Clear existing data (comment out if you want to keep existing data)
statements.push("-- Clear existing data");
statements.push("DELETE FROM resources;");
statements.push("DELETE FROM datasets;");
statements.push("DELETE FROM categories;");
statements.push("DELETE FROM publishers;");
statements.push("");

// Track publisher and category IDs by name for foreign key references
const publisherIds = new Map<string, number>();
const categoryIds = new Map<string, number>();

// Insert publishers
statements.push("-- Insert publishers");
let publisherId = 1;
for (const publisher of data.publishers) {
  const values = [
    publisherId.toString(),
    `'${escapeSql(publisher.name)}'`,
    publisher.website ? `'${escapeSql(publisher.website)}'` : "NULL",
  ];

  statements.push(
    `INSERT INTO publishers (id, name, website_url) VALUES (${values.join(", ")});`,
  );

  publisherIds.set(publisher.name, publisherId);
  publisherId++;
}
statements.push("");

// Insert categories
statements.push("-- Insert categories");
let categoryId = 1;
for (const category of data.categories) {
  const values = [
    categoryId.toString(),
    `'${escapeSql(category.name)}'`,
    category.description ? `'${escapeSql(category.description)}'` : "NULL",
  ];

  statements.push(
    `INSERT INTO categories (id, name, description) VALUES (${values.join(", ")});`,
  );

  categoryIds.set(category.name, categoryId);
  categoryId++;
}
statements.push("");

// Insert datasets
statements.push("-- Insert datasets");
let datasetId = 1;
let resourceId = 1;

for (const dataset of data.datasets) {
  // Calculate total size from resources
  const totalSize = dataset.resources.reduce((sum, r) => sum + r.size, 0);

  // Get publisher and category IDs
  const pubId = publisherIds.get(dataset.publisher_name);
  const catId = categoryIds.get(dataset.category_name);

  if (!pubId || !catId) {
    console.error(`Missing publisher or category for dataset: ${dataset.name}`);
    continue;
  }

  const values = [
    datasetId.toString(),
    `'${escapeSql(dataset.name)}'`,
    dataset.description ? `'${escapeSql(dataset.description)}'` : "NULL",
    pubId.toString(),
    catId.toString(),
    dataset.tags ? `'${escapeSql(JSON.stringify(dataset.tags))}'` : "NULL",
    totalSize.toString(),
    dataset.latest_version_date
      ? `'${escapeSql(dataset.latest_version_date)}'`
      : "NULL",
  ];

  statements.push(
    `INSERT INTO datasets (id, name, description, publisher_id, category_id, tags, size_bytes, latest_version_date) VALUES (${values.join(", ")});`,
  );

  // Insert resources
  for (const resource of dataset.resources) {
    const resourceValues = [
      resourceId.toString(),
      datasetId.toString(),
      `'${escapeSql(resource.name)}'`,
      resource.description ? `'${escapeSql(resource.description)}'` : "NULL",
      `'${escapeSql(resource.mime_type)}'`,
      resource.size.toString(),
      `'${escapeSql(resource.url)}'`,
    ];

    statements.push(
      `INSERT INTO resources (id, dataset_id, name, description, mime_type, size_bytes, download_url) VALUES (${resourceValues.join(", ")});`,
    );

    resourceId++;
  }
  statements.push("");
  datasetId++;
}

// Write SQL file
const sql = statements.join("\n");
writeFileSync(join(__dirname, "init.sql"), sql);

console.log("✅ Generated init.sql");
console.log("");
console.log("To seed your database, run:");
console.log("");
console.log(
  "  pnpx wrangler d1 execute open-data-db --local --file=./scripts/init.sql",
);
