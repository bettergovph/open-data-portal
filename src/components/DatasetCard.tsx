import { html } from 'hono/html';

interface DatasetCardProps {
  id: number;
  name: string;
  description?: string;
  publisher: string;
  category: string;
  resourceCount?: number;
  sizeBytes: number;
  latestVersionDate?: string;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

function formatDate(dateString: string | undefined): string {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

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
    <a href="/view/datasets/${id}"
       class="block bg-white rounded-lg shadow-md p-6 hover:shadow-xl border border-neutral-200 hover:border-primary-500 transition-all-smooth group">
      <div class="flex items-start justify-between mb-3">
        <h3 class="text-lg font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors flex-1">${name}</h3>
        <i data-lucide="chevron-right" class="w-5 h-5 text-neutral-400 group-hover:text-primary-600 transition-colors ml-2 flex-shrink-0"></i>
      </div>
      ${description ? html`
        <p class="text-sm text-neutral-600 mb-4 line-clamp-2 leading-relaxed">${description}</p>
      ` : ''}
      <div class="flex flex-wrap gap-2 mb-4">
        <span class="badge badge-primary inline-flex items-center">
          <i data-lucide="building-2" class="w-3 h-3 mr-1"></i>
          ${publisher}
        </span>
        <span class="badge badge-success inline-flex items-center">
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
