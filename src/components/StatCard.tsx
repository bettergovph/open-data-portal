import { html } from 'hono/html';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: string;
  color?: 'primary' | 'success' | 'warning' | 'gray';
}

export function StatCard({ label, value, icon, color = 'primary' }: StatCardProps) {
  const colorClasses = {
    primary: 'bg-primary-100 text-primary-600',
    success: 'bg-green-100 text-green-600',
    warning: 'bg-civictech-100 text-civictech-700',
    gray: 'bg-neutral-100 text-neutral-600',
  };

  return html`
    <div class="card group hover:scale-105 transition-all-smooth">
      <div class="card-body">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <p class="text-4xl font-bold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors">${value}</p>
            <p class="text-sm font-medium text-neutral-600 uppercase tracking-wide">${label}</p>
          </div>
          ${icon ? html`
            <div class="${colorClasses[color]} p-4 rounded-xl group-hover:scale-110 transition-transform">
              <span class="text-3xl">${icon}</span>
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}
