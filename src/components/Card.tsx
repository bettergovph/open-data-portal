import { html } from 'hono/html';

interface CardProps {
  children: any;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = true }: CardProps) {
  return html`
    <div class="card ${hover ? 'hover:shadow-xl' : ''} ${className}">
      ${children}
    </div>
  `;
}

interface CardHeaderProps {
  children: any;
  className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return html`
    <div class="card-header ${className}">
      ${children}
    </div>
  `;
}

interface CardBodyProps {
  children: any;
  className?: string;
}

export function CardBody({ children, className = '' }: CardBodyProps) {
  return html`
    <div class="card-body ${className}">
      ${children}
    </div>
  `;
}

interface CardFooterProps {
  children: any;
  className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return html`
    <div class="card-footer ${className}">
      ${children}
    </div>
  `;
}
