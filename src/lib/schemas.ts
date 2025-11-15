import { z } from "zod";

export const PublisherSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  website_url: z.string().url().nullable(),
});

export const CategorySchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  description: z.string().nullable(),
});

export const CategoryListItemSchema = CategorySchema.extend({
  dataset_count: z.number().int().min(0),
});

export const ResourceSchema = z.object({
  id: z.number().int().positive(),
  dataset_id: z.number().int().positive(),
  name: z.string().min(1),
  description: z.string().nullable(),
  mime_type: z.string().min(1),
  size_bytes: z.number().int().min(0),
  download_url: z.string().url(),
  source_url: z.string().url().nullable(),
});

export const DatasetSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  description: z.string().nullable(),
  publisher_id: z.number().int().positive(),
  category_id: z.number().int().positive(),
  tags: z.string().nullable(),
  size_bytes: z.number().int().min(0),
  latest_version_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable(),
});

export const DatasetListItemSchema = DatasetSchema.extend({
  publisher: z.object({
    id: z.number().int().positive(),
    name: z.string(),
  }),
  category: z.object({
    id: z.number().int().positive(),
    name: z.string(),
  }),
  resource_count: z.number().int().min(0),
});

export const DatasetDetailSchema = DatasetSchema.extend({
  publisher: PublisherSchema,
  category: CategorySchema,
});

export const PaginationQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  offset: z.coerce.number().int().min(0).optional().default(0),
});

export const DatasetListQuerySchema = PaginationQuerySchema.extend({
  search: z.string().optional(),
  category_id: z.coerce.number().int().positive().optional(),
  publisher_id: z.coerce.number().int().positive().optional(),
  format: z.string().optional(),
  sort: z
    .enum(["name", "latest_version_date", "size_bytes"])
    .optional()
    .default("latest_version_date"),
  dir: z.enum(["asc", "desc"]).optional().default("desc"),
});

export const PublisherListQuerySchema = PaginationQuerySchema.extend({
  search: z.string().optional(),
});

export const PaginationInfoSchema = z.object({
  total: z.number().int().min(0),
  limit: z.number().int().positive(),
  offset: z.number().int().min(0),
  has_more: z.boolean(),
  current_page: z.number().int().positive(),
  total_pages: z.number().int().min(0),
});

export const StatsSchema = z.object({
  total_datasets: z.number().int().min(0),
  total_resources: z.number().int().min(0),
  total_publishers: z.number().int().min(0),
  total_categories: z.number().int().min(0),
  total_size_bytes: z.number().int().min(0),
});

export const ErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.any().optional(),
});

export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  error: ErrorSchema,
});

// Generic API response wrapper
export const createApiResponseSchema = <T extends z.ZodTypeAny>(
  dataSchema: T,
) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    pagination: PaginationInfoSchema.optional(),
    error: ErrorSchema.optional(),
  });
