import { html } from 'hono/html';
import { formatNumber } from '@/lib/utils';

export interface StatCardProps {
  label: string;
  value: string | number;
  icon?: string; // Lucide icon name
  color?: 'primary' | 'success' | 'warning' | 'info' | 'neutral';
}

const colorClasses = {
  primary: 'bg-primary-100 text-primary-600',
  success: 'bg-success-100 text-success-600',
  warning: 'bg-warning-100 text-warning-600',
  info: 'bg-blue-100 text-blue-600',
  neutral: 'bg-neutral-100 text-neutral-600',
};

/**
 * Server-side JSX component for rendering statistics cards
 */
export function StatCard({ label, value, icon, color = 'primary' }: StatCardProps) {
  const displayValue = typeof value === 'number' ? formatNumber(value) : value;

  return html`
    <div class="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow group">
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <p class="text-3xl font-bold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors">${displayValue}</p>
          <p class="text-sm font-medium text-neutral-600 uppercase tracking-wide">${label}</p>
        </div>
        ${icon ? html`
          <div class="${colorClasses[color]} p-3 rounded-lg">
            <i data-lucide="${icon}" class="w-8 h-8"></i>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

/**
 * Client-side compatible function that returns HTML string
 * Used for dynamic rendering in browser JavaScript
 * NOTE: Requires formatNumber to be available in the client scope
 */
StatCard.toHTML = function({ label, value, icon, color = 'primary' }: StatCardProps): string {
  const displayValue = typeof value === 'number' && typeof formatNumber === 'function'
    ? formatNumber(value)
    : value.toString();
  const classes = colorClasses[color] || colorClasses.primary;
  const iconHTML = icon
    ? `<div class="${classes} p-3 rounded-lg"><i data-lucide="${icon}" class="w-8 h-8"></i></div>`
    : '';

  return `
    <div class="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow group">
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <p class="text-3xl font-bold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors">${displayValue}</p>
          <p class="text-sm font-medium text-neutral-600 uppercase tracking-wide">${label}</p>
        </div>
        ${iconHTML}
      </div>
    </div>
  `.trim();
};
