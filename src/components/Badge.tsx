import { html } from 'hono/html';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'neutral';
  className?: string;
}

export function Badge({ label, variant = 'primary', className = '' }: BadgeProps) {
  const variantClasses = {
    primary: 'badge-primary',
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    neutral: 'badge-neutral',
  };

  return html`
    <span class="badge ${variantClasses[variant]} ${className}">
      ${label}
    </span>
  `;
}
