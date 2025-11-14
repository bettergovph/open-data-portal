import { html } from 'hono/html';

export interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'neutral' | 'info';
  icon?: string; // Lucide icon name
  className?: string;
}

const variantClasses = {
  primary: 'bg-primary-100 text-primary-700',
  success: 'bg-success-100 text-success-700',
  warning: 'bg-warning-100 text-warning-700',
  error: 'bg-error-100 text-error-700',
  neutral: 'bg-neutral-100 text-neutral-700',
  info: 'bg-blue-100 text-blue-700',
};

/**
 * Server-side JSX component for rendering badges
 */
export function Badge({ label, variant = 'primary', icon, className = '' }: BadgeProps) {
  return html`
    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}">
      ${icon ? html`<i data-lucide="${icon}" class="w-3 h-3 mr-1"></i>` : ''}
      ${label}
    </span>
  `;
}

/**
 * Client-side compatible function that returns HTML string
 * Used for dynamic rendering in browser JavaScript
 */
Badge.toHTML = function({ label, variant = 'primary', icon, className = '' }: BadgeProps): string {
  const classes = variantClasses[variant] || variantClasses.primary;
  const iconHTML = icon ? `<i data-lucide="${icon}" class="w-3 h-3 mr-1"></i>` : '';

  return `<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${classes} ${className}">${iconHTML}${label}</span>`;
};
