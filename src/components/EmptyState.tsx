import { html } from 'hono/html';

export interface EmptyStateProps {
  icon?: string; // Lucide icon name
  heading: string;
  message: string;
  actionLabel?: string;
  actionHref?: string;
  secondaryActionLabel?: string;
  secondaryActionHref?: string;
}

/**
 * Server-side JSX component for rendering empty states
 */
export function EmptyState({
  icon = 'inbox',
  heading,
  message,
  actionLabel,
  actionHref,
  secondaryActionLabel,
  secondaryActionHref,
}: EmptyStateProps) {
  return html`
    <div class="text-center py-12">
      <div class="mb-6 flex justify-center">
        <div class="bg-neutral-100 rounded-full p-6">
          <i data-lucide="${icon}" class="w-16 h-16 text-neutral-400"></i>
        </div>
      </div>
      <h3 class="text-2xl font-semibold text-neutral-900 mb-3">${heading}</h3>
      <p class="text-neutral-600 mb-6 max-w-md mx-auto">${message}</p>
      ${actionLabel && actionHref ? html`
        <div class="flex justify-center gap-4">
          <a
            href="${actionHref}"
            class="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
          >
            ${actionLabel}
          </a>
          ${secondaryActionLabel && secondaryActionHref ? html`
            <a
              href="${secondaryActionHref}"
              class="inline-flex items-center px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg border-2 border-primary-600 hover:bg-primary-50 transition-colors"
            >
              ${secondaryActionLabel}
            </a>
          ` : ''}
        </div>
      ` : ''}
    </div>
  `;
}

/**
 * Client-side compatible function that returns HTML string
 * Used for dynamic rendering in browser JavaScript
 */
EmptyState.toHTML = function({
  icon = 'inbox',
  heading,
  message,
  actionLabel,
  actionHref,
  secondaryActionLabel,
  secondaryActionHref,
}: EmptyStateProps): string {
  const actionsHTML = actionLabel && actionHref ? `
    <div class="flex justify-center gap-4">
      <a
        href="${actionHref}"
        class="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
      >
        ${actionLabel}
      </a>
      ${secondaryActionLabel && secondaryActionHref ? `
        <a
          href="${secondaryActionHref}"
          class="inline-flex items-center px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg border-2 border-primary-600 hover:bg-primary-50 transition-colors"
        >
          ${secondaryActionLabel}
        </a>
      ` : ''}
    </div>
  ` : '';

  return `
    <div class="text-center py-12">
      <div class="mb-6 flex justify-center">
        <div class="bg-neutral-100 rounded-full p-6">
          <i data-lucide="${icon}" class="w-16 h-16 text-neutral-400"></i>
        </div>
      </div>
      <h3 class="text-2xl font-semibold text-neutral-900 mb-3">${heading}</h3>
      <p class="text-neutral-600 mb-6 max-w-md mx-auto">${message}</p>
      ${actionsHTML}
    </div>
  `.trim();
};
