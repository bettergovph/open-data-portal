import { html } from 'hono/html';

export interface LoadingSkeletonProps {
  variant: 'stat-card' | 'dataset-card' | 'generic' | 'resource-row';
  count?: number;
}

/**
 * Server-side JSX component for rendering loading skeletons
 */
export function LoadingSkeleton({ variant, count = 1 }: LoadingSkeletonProps) {
  const skeletons = Array(count).fill(null);

  if (variant === 'stat-card') {
    return html`
      ${skeletons.map(() => html`
        <div class="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 animate-pulse">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div class="h-10 bg-neutral-200 rounded w-24 mb-3"></div>
              <div class="h-4 bg-neutral-200 rounded w-32"></div>
            </div>
            <div class="bg-neutral-200 p-3 rounded-lg w-14 h-14"></div>
          </div>
        </div>
      `)}
    `;
  }

  if (variant === 'dataset-card') {
    return html`
      ${skeletons.map(() => html`
        <div class="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 animate-pulse">
          <div class="h-6 bg-neutral-200 rounded w-3/4 mb-4"></div>
          <div class="space-y-2 mb-4">
            <div class="h-4 bg-neutral-200 rounded w-full"></div>
            <div class="h-4 bg-neutral-200 rounded w-2/3"></div>
          </div>
          <div class="flex gap-2 mb-4">
            <div class="h-6 bg-neutral-200 rounded-full w-24"></div>
            <div class="h-6 bg-neutral-200 rounded-full w-20"></div>
          </div>
          <div class="flex justify-between pt-4 border-t border-neutral-100">
            <div class="h-4 bg-neutral-200 rounded w-32"></div>
            <div class="h-4 bg-neutral-200 rounded w-24"></div>
          </div>
        </div>
      `)}
    `;
  }

  if (variant === 'resource-row') {
    return html`
      ${skeletons.map(() => html`
        <tr class="animate-pulse">
          <td class="px-6 py-4">
            <div class="h-4 bg-neutral-200 rounded w-48"></div>
          </td>
          <td class="px-6 py-4">
            <div class="h-4 bg-neutral-200 rounded w-20"></div>
          </td>
          <td class="px-6 py-4">
            <div class="h-4 bg-neutral-200 rounded w-16"></div>
          </td>
          <td class="px-6 py-4">
            <div class="h-4 bg-neutral-200 rounded w-24"></div>
          </td>
          <td class="px-6 py-4">
            <div class="h-8 bg-neutral-200 rounded w-20"></div>
          </td>
        </tr>
      `)}
    `;
  }

  // Generic variant
  return html`
    ${skeletons.map(() => html`
      <div class="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 animate-pulse">
        <div class="space-y-4">
          <div class="h-6 bg-neutral-200 rounded w-3/4"></div>
          <div class="h-4 bg-neutral-200 rounded w-full"></div>
          <div class="h-4 bg-neutral-200 rounded w-5/6"></div>
        </div>
      </div>
    `)}
  `;
}

/**
 * Client-side compatible function that returns HTML string
 * Used for dynamic rendering in browser JavaScript
 */
LoadingSkeleton.toHTML = function({ variant, count = 1 }: LoadingSkeletonProps): string {
  const skeletons = Array(count).fill(null);

  if (variant === 'stat-card') {
    return skeletons.map(() => `
      <div class="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 animate-pulse">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="h-10 bg-neutral-200 rounded w-24 mb-3"></div>
            <div class="h-4 bg-neutral-200 rounded w-32"></div>
          </div>
          <div class="bg-neutral-200 p-3 rounded-lg w-14 h-14"></div>
        </div>
      </div>
    `).join('');
  }

  if (variant === 'dataset-card') {
    return skeletons.map(() => `
      <div class="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 animate-pulse">
        <div class="h-6 bg-neutral-200 rounded w-3/4 mb-4"></div>
        <div class="space-y-2 mb-4">
          <div class="h-4 bg-neutral-200 rounded w-full"></div>
          <div class="h-4 bg-neutral-200 rounded w-2/3"></div>
        </div>
        <div class="flex gap-2 mb-4">
          <div class="h-6 bg-neutral-200 rounded-full w-24"></div>
          <div class="h-6 bg-neutral-200 rounded-full w-20"></div>
        </div>
        <div class="flex justify-between pt-4 border-t border-neutral-100">
          <div class="h-4 bg-neutral-200 rounded w-32"></div>
          <div class="h-4 bg-neutral-200 rounded w-24"></div>
        </div>
      </div>
    `).join('');
  }

  if (variant === 'resource-row') {
    return skeletons.map(() => `
      <tr class="animate-pulse">
        <td class="px-6 py-4">
          <div class="h-4 bg-neutral-200 rounded w-48"></div>
        </td>
        <td class="px-6 py-4">
          <div class="h-4 bg-neutral-200 rounded w-20"></div>
        </td>
        <td class="px-6 py-4">
          <div class="h-4 bg-neutral-200 rounded w-16"></div>
        </td>
        <td class="px-6 py-4">
          <div class="h-4 bg-neutral-200 rounded w-24"></div>
        </td>
        <td class="px-6 py-4">
          <div class="h-8 bg-neutral-200 rounded w-20"></div>
        </td>
      </tr>
    `).join('');
  }

  // Generic variant
  return skeletons.map(() => `
    <div class="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 animate-pulse">
      <div class="space-y-4">
        <div class="h-6 bg-neutral-200 rounded w-3/4"></div>
        <div class="h-4 bg-neutral-200 rounded w-full"></div>
        <div class="h-4 bg-neutral-200 rounded w-5/6"></div>
      </div>
    </div>
  `).join('');
};
