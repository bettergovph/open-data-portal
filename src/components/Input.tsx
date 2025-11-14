import { html } from 'hono/html';

interface InputProps {
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  label?: string;
  error?: string;
  required?: boolean;
  className?: string;
}

export function Input({
  name,
  type = 'text',
  placeholder,
  value,
  label,
  error,
  required = false,
  className = '',
}: InputProps) {
  return html`
    <div class="mb-4 ${className}">
      ${label ? html`
        <label for="${name}" class="block text-sm font-medium text-neutral-700 mb-2">
          ${label}
          ${required ? html`<span class="text-accent-600">*</span>` : ''}
        </label>
      ` : ''}
      <input
        type="${type}"
        id="${name}"
        name="${name}"
        placeholder="${placeholder || ''}"
        value="${value || ''}"
        ${required ? 'required' : ''}
        class="input ${error ? 'input-error' : ''}"
      />
      ${error ? html`
        <p class="mt-1 text-sm text-accent-600">${error}</p>
      ` : ''}
    </div>
  `;
}

interface TextareaProps {
  name: string;
  placeholder?: string;
  value?: string;
  label?: string;
  error?: string;
  required?: boolean;
  rows?: number;
  className?: string;
}

export function Textarea({
  name,
  placeholder,
  value,
  label,
  error,
  required = false,
  rows = 4,
  className = '',
}: TextareaProps) {
  return html`
    <div class="mb-4 ${className}">
      ${label ? html`
        <label for="${name}" class="block text-sm font-medium text-neutral-700 mb-2">
          ${label}
          ${required ? html`<span class="text-accent-600">*</span>` : ''}
        </label>
      ` : ''}
      <textarea
        id="${name}"
        name="${name}"
        placeholder="${placeholder || ''}"
        ${required ? 'required' : ''}
        rows="${rows}"
        class="input ${error ? 'input-error' : ''}"
      >${value || ''}</textarea>
      ${error ? html`
        <p class="mt-1 text-sm text-accent-600">${error}</p>
      ` : ''}
    </div>
  `;
}

interface SelectProps {
  name: string;
  options: Array<{ value: string; label: string }>;
  value?: string;
  label?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

export function Select({
  name,
  options,
  value,
  label,
  error,
  required = false,
  placeholder,
  className = '',
}: SelectProps) {
  return html`
    <div class="mb-4 ${className}">
      ${label ? html`
        <label for="${name}" class="block text-sm font-medium text-neutral-700 mb-2">
          ${label}
          ${required ? html`<span class="text-accent-600">*</span>` : ''}
        </label>
      ` : ''}
      <select
        id="${name}"
        name="${name}"
        ${required ? 'required' : ''}
        class="input ${error ? 'input-error' : ''}"
      >
        ${placeholder ? html`<option value="">${placeholder}</option>` : ''}
        ${options.map(option => html`
          <option value="${option.value}" ${value === option.value ? 'selected' : ''}>
            ${option.label}
          </option>
        `)}
      </select>
      ${error ? html`
        <p class="mt-1 text-sm text-accent-600">${error}</p>
      ` : ''}
    </div>
  `;
}
