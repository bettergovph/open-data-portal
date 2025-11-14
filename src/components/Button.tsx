import { html } from 'hono/html';

interface ButtonProps {
  label: string;
  href?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'civictech' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  icon?: string; // SVG icon as string
  iconPosition?: 'left' | 'right';
}

export function Button({
  label,
  href,
  variant = 'primary',
  size = 'md',
  type = 'button',
  className = '',
  icon,
  iconPosition = 'left',
}: ButtonProps) {
  const baseClasses = 'btn';
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    accent: 'btn-accent',
    civictech: 'btn-civictech',
    outline: 'btn-outline',
  };
  const sizeClasses = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  const content = icon
    ? iconPosition === 'left'
      ? html`${icon}<span class="ml-2">${label}</span>`
      : html`<span class="mr-2">${label}</span>${icon}`
    : label;

  if (href) {
    return html`<a href="${href}" class="${classes}">${content}</a>`;
  }

  return html`<button type="${type}" class="${classes}">${content}</button>`;
}
