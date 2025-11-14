import { html } from 'hono/html';
import { formatBytes, formatDate } from '@/lib/utils.ts';

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
       class="block bg-white rounded-lg shadow-sm border border-neutral-200 hover:shadow-md hover:border-primary-500 transition-all p-6 group">
      <div class="flex items-start justify-between mb-3">
        <h3 class="text-lg font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors flex-1">${name}</h3>
        <i data-lucide="chevron-right" class="w-5 h-5 text-neutral-400 group-hover:text-primary-600 transition-colors ml-2 flex-shrink-0"></i>
      </div>
      ${description ? html`
        <p class="text-sm text-neutral-600 mb-4 line-clamp-2 leading-relaxed">${description}</p>
      ` : ''}
      <div class="flex flex-wrap gap-2 mb-4">
        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
          <i data-lucide="building-2" class="w-3 h-3 mr-1"></i>
          ${publisher}
        </span>
        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-success-100 text-success-700">
          <i data-lucide="tag" class="w-3 h-3 mr-1"></i>
          ${category}
        </span>
      </div>
      <div class="flex items-center justify-between text-xs text-neutral-500 pt-4 border-t border-neutral-100">
        <div class="flex items-center space-x-4">
          ${resourceCount ? html`
            <span class="flex items-center font-medium">
              <i data-lucide="file-text" class="w-4 h-4 mr-1.5 text-primary-500"></i>
              ${resourceCount} resource${resourceCount !== 1 ? 's' : ''}
            </span>
          ` : ''}
          <span class="font-medium">${formatBytes(sizeBytes)}</span>
        </div>
        ${latestVersionDate ? html`
          <span class="text-neutral-600">Updated ${formatDate(latestVersionDate)}</span>
        ` : ''}
      </div>
    </a>
  `;
}

/**
 * Client-side compatible function that returns HTML string
 * Used for dynamic rendering in browser JavaScript
 * NOTE: Requires formatBytes and formatDate to be available in the client scope
 */
DatasetCard.toHTML = function(props: DatasetCardProps): string {
  const { id, name, description, publisher, category, resourceCount, sizeBytes, latestVersionDate } = props;

  // Note: formatBytes and formatDate must be defined in the client-side scope
  return `
    <a href="/datasets/${id}"
       class="block bg-white rounded-lg shadow-sm border border-neutral-200 hover:shadow-md hover:border-primary-500 transition-all p-6 group">
      <div class="flex items-start justify-between mb-3">
        <h3 class="text-lg font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors flex-1">${name}</h3>
        <i data-lucide="chevron-right" class="w-5 h-5 text-neutral-400 group-hover:text-primary-600 transition-colors ml-2 flex-shrink-0"></i>
      </div>
      ${description ? `<p class="text-sm text-neutral-600 mb-4 line-clamp-2 leading-relaxed">${description}</p>` : ''}
      <div class="flex flex-wrap gap-2 mb-4">
        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
          <i data-lucide="building-2" class="w-3 h-3 mr-1"></i>
          ${publisher}
        </span>
        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-success-100 text-success-700">
          <i data-lucide="tag" class="w-3 h-3 mr-1"></i>
          ${category}
        </span>
      </div>
      <div class="flex items-center justify-between text-xs text-neutral-500 pt-4 border-t border-neutral-100">
        <div class="flex items-center space-x-4">
          ${resourceCount ? `
            <span class="flex items-center font-medium">
              <i data-lucide="file-text" class="w-4 h-4 mr-1.5 text-primary-500"></i>
              ${resourceCount} resource${resourceCount !== 1 ? 's' : ''}
            </span>
          ` : ''}
          <span class="font-medium">${typeof formatBytes === 'function' ? formatBytes(sizeBytes) : sizeBytes + ' B'}</span>
        </div>
        ${latestVersionDate ? `<span class="text-neutral-600">Updated ${typeof formatDate === 'function' ? formatDate(latestVersionDate) : latestVersionDate}</span>` : ''}
      </div>
    </a>
  `.trim();
};
