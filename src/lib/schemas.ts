import { z } from "zod";

export const AttributionAuthorSchema = z
  .object({
    author: z
      .string()
      .min(1)
      .openapi({ example: "Ateneo School of Government" }),
    source_url: z.string().url().nullable().openapi({
      example: "https://www.inclusivedemocracy.ph/data-and-infographics",
    }),
    attribution_text: z.string().nullable().openapi({
      example:
        "This dataset has been made public to encourage academics, development practitioners, leaders and the youth to examine and engage in our democracy.",
    }),
    license: z.string().nullable().openapi({
      example: "CC-BY 4.0",
    }),
    license_url: z.string().url().nullable().openapi({
      example: "https://creativecommons.org/licenses/by/4.0/",
    }),
  })
  .openapi("AttributionAuthor");

export const PublisherSchema = z
  .object({
    id: z.number().int().positive().openapi({ example: 1 }),
    name: z.string().min(1).openapi({ example: "Ateneo School of Government" }),
    website_url: z.string().url().nullable().openapi({
      example: "https://www.ateneo.edu/asog",
    }),
  })
  .openapi("Publisher");

export const CategorySchema = z
  .object({
    id: z.number().int().positive().openapi({ example: 7 }),
    name: z.string().min(1).openapi({ example: "Government" }),
    description: z.string().nullable().openapi({
      example: "Government operations, budgets, and administrative data",
    }),
  })
  .openapi("Category");

export const CategoryListItemSchema = CategorySchema.extend({
  dataset_count: z.number().int().min(0).openapi({ example: 5 }),
}).openapi("CategoryListItem");

export const ResourceSchema = z
  .object({
    id: z.number().int().positive().openapi({ example: 9 }),
    dataset_id: z.number().int().positive().openapi({ example: 3 }),
    name: z.string().min(1).openapi({
      example: "Ateneo Policy Center (APC) Political Dynasties Dataset",
    }),
    description: z.string().nullable().openapi({
      example:
        "The Ateneo Policy Center Political Dynasties Dataset tracks leadership patterns at the local government level in the Philippines.",
    }),
    mime_type: z.string().min(1).openapi({
      example:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    size_bytes: z.number().int().min(0).openapi({ example: 4300000 }),
    download_url: z.string().url().openapi({
      example:
        "https://www.inclusivedemocracy.ph/_files/ugd/393b52_c5e0228bb5ab493e9c36b1e8daba705b.xlsx?dn=ASoG-POLITICAL-DYNASTIES-DATASET-V2016.xlsx",
    }),
    source_url: z.string().url().nullable().openapi({
      example: "https://www.inclusivedemocracy.ph/data-and-infographics",
    }),
  })
  .openapi("Resource");
z.object({
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
  attribution: z.string().nullable(),
  license: z.string().nullable(),
  license_url: z.string().nullable(),
});

export const DatasetApiSchema = z
  .object({
    id: z.number().int().positive().openapi({ example: 3 }),
    name: z.string().min(1).openapi({
      example: "Ateneo Policy Center (APC) Political Dynasties Dataset",
    }),
    description: z.string().nullable().openapi({
      example:
        "The Ateneo Policy Center Political Dynasties Dataset tracks leadership patterns at the local government level in the Philippines, tracing the presence and extent of political clans.",
    }),
    publisher_id: z.number().int().positive().openapi({ example: 1 }),
    category_id: z.number().int().positive().openapi({ example: 7 }),
    tags: z.string().nullable().openapi({
      example:
        '["political dynasties","local government","politicians","research"]',
      description: "JSON array of tag strings",
    }),
    size_bytes: z.number().int().min(0).openapi({ example: 4300000 }),
    latest_version_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .nullable()
      .openapi({ example: "2024-11-20" }),
    attribution: z
      .array(AttributionAuthorSchema)
      .nullable()
      .openapi({
        description: "Array of attribution authors with their details",
        example: [
          {
            author: "Ateneo School of Government",
            source_url:
              "https://www.inclusivedemocracy.ph/data-and-infographics",
            attribution_text:
              "This dataset has been made public to encourage academics, development practitioners, leaders and the youth to examine and engage in our democracy.",
            license: null,
            license_url: null,
          },
        ],
      }),
    license: z.string().nullable().openapi({
      description:
        "Dataset-level license information (e.g., 'Public Domain', 'CC-BY-4.0')",
      example: null,
    }),
    license_url: z.string().url().nullable().openapi({
      description: "Dataset-level URL linking to full license text",
      example: null,
    }),
  })
  .openapi("Dataset");

export const DatasetListItemSchema = DatasetApiSchema.extend({
  publisher: z.object({
    id: z.number().int().positive().openapi({ example: 1 }),
    name: z.string().openapi({ example: "Ateneo School of Government" }),
  }),
  category: z.object({
    id: z.number().int().positive().openapi({ example: 7 }),
    name: z.string().openapi({ example: "Government" }),
  }),
  resource_count: z.number().int().min(0).openapi({ example: 1 }),
}).openapi("DatasetListItem");

export const DatasetDetailSchema = DatasetApiSchema.extend({
  publisher: PublisherSchema,
  category: CategorySchema,
}).openapi("DatasetDetail");

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

export const PaginationInfoSchema = z
  .object({
    total: z.number().int().min(0).openapi({ example: 7 }),
    limit: z.number().int().positive().openapi({ example: 10 }),
    offset: z.number().int().min(0).openapi({ example: 0 }),
    has_more: z.boolean().openapi({ example: false }),
    current_page: z.number().int().positive().openapi({ example: 1 }),
    total_pages: z.number().int().min(0).openapi({ example: 1 }),
  })
  .openapi("PaginationInfo");

export const StatsSchema = z
  .object({
    total_datasets: z.number().int().min(0).openapi({ example: 7 }),
    total_resources: z.number().int().min(0).openapi({ example: 30 }),
    total_publishers: z.number().int().min(0).openapi({ example: 3 }),
    total_categories: z.number().int().min(0).openapi({ example: 12 }),
    total_size_bytes: z.number().int().min(0).openapi({ example: 3000000000 }),
  })
  .openapi("Stats");

export const ErrorSchema = z
  .object({
    code: z.string().openapi({
      example: "RESOURCE_NOT_FOUND",
      description: "Application-specific error code (not HTTP status code)",
    }),
    message: z.string().openapi({
      example: "The requested resource could not be found",
      description: "Human-readable error message",
    }),
    details: z.any().optional().openapi({
      description: "Additional error details (optional)",
    }),
  })
  .openapi("Error");

export const ErrorResponseSchema = z
  .object({
    success: z.literal(false),
    error: ErrorSchema,
  })
  .openapi("ErrorResponse");

export const createApiResponseSchema = <T extends z.ZodTypeAny>(
  dataSchema: T,
) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    pagination: PaginationInfoSchema.optional(),
    error: ErrorSchema.optional(),
  });

export const parseAttribution = (
  attribution: string | null,
): AttributionAuthor[] => {
  if (!attribution) return [];
  try {
    const parsed = JSON.parse(attribution);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export type AttributionAuthor = z.infer<typeof AttributionAuthorSchema>;
