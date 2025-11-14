import { html } from 'hono/html';

interface CategoryCardProps {
  id: number;
  name: string;
  description?: string;
  datasetCount: number;
}

export function CategoryCard({ id, name, description, datasetCount }: CategoryCardProps) {
  return html`
    <a href="/view/datasets?category_id=${id}"
       class="card group hover:border-primary-500 border-2 border-transparent transition-all-smooth">
      <div class="card-body">
        <div class="flex items-start justify-between mb-3">
          <h3 class="text-lg font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">${name}</h3>
          <span class="badge badge-primary text-base px-3 py-1">
            ${datasetCount}
          </span>
        </div>
        ${description ? html`
          <p class="text-sm text-neutral-600 line-clamp-2 leading-relaxed mb-4">${description}</p>
        ` : html`<div class="mb-4"></div>`}
        <div class="flex items-center text-primary-600 text-sm font-semibold group-hover:translate-x-1 transition-transform">
          View datasets
          <i data-lucide="arrow-right" class="w-4 h-4 ml-1"></i>
        </div>
      </div>
    </a>
  `;
}
