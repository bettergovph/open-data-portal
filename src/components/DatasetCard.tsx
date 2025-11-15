import { html } from "hono/html";
import { formatBytes, formatDate } from "@/lib/utils";

export interface DatasetCardProps {
  id: number;
  name: string;
  description?: string;
  publisher: string;
  category: string;
  resourceCount?: number;
  sizeBytes: number;
  latestVersionDate?: string;
}

/**
 * Server-side JSX component for rendering dataset cards
 */
export function DatasetCard({
  id,
  name,
  description,
  publisher,
  category,
  resourceCount,
  sizeBytes,
  latestVersionDate,
}: DatasetCardProps) {
  return html`
    <a href="/datasets/${id}"
       class="block bg-white rounded-lg shadow-sm border border-neutral-200 hover:shadow-md hover:border-primary-500 transition-all p-6 group flex flex-col h-full">
      <!-- Fixed height title section (1 line only) -->
      <div class="flex items-start justify-between mb-2 h-7">
        <h3 class="text-lg font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors flex-1 truncate pr-2">${name}</h3>
        <i data-lucide="chevron-right" class="w-5 h-5 text-neutral-400 group-hover:text-primary-600 transition-colors flex-shrink-0"></i>
      </div>

      <!-- Fixed height description section (exactly 2 lines = 2.5rem) -->
      <div class="mb-4 h-10">
        <p class="text-sm text-neutral-600 line-clamp-2 leading-5">${description || ""}</p>
      </div>

      <!-- Fixed height tags section (exactly 1 line = 1.75rem) -->
      <div class="flex gap-2 mb-4 h-7">
        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700 truncate max-w-[50%]">
          <i data-lucide="building-2" class="w-3 h-3 mr-1 flex-shrink-0"></i>
          <span class="truncate">${publisher}</span>
        </span>
        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-success-100 text-success-700 truncate max-w-[50%]">
          <i data-lucide="tag" class="w-3 h-3 mr-1 flex-shrink-0"></i>
          <span class="truncate">${category}</span>
        </span>
      </div>

      <!-- Spacer to push footer to bottom -->
      <div class="flex-grow"></div>

      <!-- Fixed position footer -->
      <div class="flex items-center justify-between text-xs text-neutral-500 pt-4 border-t border-neutral-100 mt-auto">
        <div class="flex items-center space-x-4">
          ${
            resourceCount
              ? html`
            <span class="flex items-center font-medium whitespace-nowrap">
              <i data-lucide="file-text" class="w-4 h-4 mr-1.5 text-primary-500"></i>
              ${resourceCount} resource${resourceCount !== 1 ? "s" : ""}
            </span>
          `
              : ""
          }
          <span class="font-medium whitespace-nowrap">${formatBytes(sizeBytes)}</span>
        </div>
        ${
          latestVersionDate
            ? html`
          <span class="text-neutral-600 whitespace-nowrap">Published ${formatDate(latestVersionDate)}</span>
        `
            : ""
        }
      </div>
    </a>
  `;
}

/**
 * Client-side compatible function that returns HTML string
 * Used for dynamic rendering in browser JavaScript
 * NOTE: Requires formatBytes and formatDate to be available in the client scope
 */
DatasetCard.toHTML = (props: DatasetCardProps): string => {
  const {
    id,
    name,
    description,
    publisher,
    category,
    resourceCount,
    sizeBytes,
    latestVersionDate,
  } = props;

  // Note: formatBytes and formatDate must be defined in the client-side scope
  return `
    <a href="/datasets/${id}"
       class="block bg-white rounded-lg shadow-sm border border-neutral-200 hover:shadow-md hover:border-primary-500 transition-all p-6 group flex flex-col h-full">
      <!-- Fixed height title section (1 line only) -->
      <div class="flex items-start justify-between mb-2 h-7">
        <h3 class="text-lg font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors flex-1 truncate pr-2">${name}</h3>
        <i data-lucide="chevron-right" class="w-5 h-5 text-neutral-400 group-hover:text-primary-600 transition-colors flex-shrink-0"></i>
      </div>

      <!-- Fixed height description section (exactly 2 lines = 2.5rem) -->
      <div class="mb-4 h-10">
        <p class="text-sm text-neutral-600 line-clamp-2 leading-5">${description || ""}</p>
      </div>

      <!-- Fixed height tags section (exactly 1 line = 1.75rem) -->
      <div class="flex gap-2 mb-4 h-7">
        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700 truncate max-w-[50%]">
          <i data-lucide="building-2" class="w-3 h-3 mr-1 flex-shrink-0"></i>
          <span class="truncate">${publisher}</span>
        </span>
        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-success-100 text-success-700 truncate max-w-[50%]">
          <i data-lucide="tag" class="w-3 h-3 mr-1 flex-shrink-0"></i>
          <span class="truncate">${category}</span>
        </span>
      </div>

      <!-- Spacer to push footer to bottom -->
      <div class="flex-grow"></div>

      <!-- Fixed position footer -->
      <div class="flex items-center justify-between text-xs text-neutral-500 pt-4 border-t border-neutral-100 mt-auto">
        <div class="flex items-center space-x-4">
          ${
            resourceCount
              ? `
            <span class="flex items-center font-medium whitespace-nowrap">
              <i data-lucide="file-text" class="w-4 h-4 mr-1.5 text-primary-500"></i>
              ${resourceCount} resource${resourceCount !== 1 ? "s" : ""}
            </span>
          `
              : ""
          }
          <span class="font-medium whitespace-nowrap">${typeof formatBytes === "function" ? formatBytes(sizeBytes) : `${sizeBytes} B`}</span>
        </div>
        ${latestVersionDate ? `<span class="text-neutral-600 whitespace-nowrap">Published ${typeof formatDate === "function" ? formatDate(latestVersionDate) : latestVersionDate}</span>` : ""}
      </div>
    </a>
  `.trim();
};
