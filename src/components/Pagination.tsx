import { html } from 'hono/html';

export interface PaginationProps {
  total: number;
  limit: number;
  offset: number;
  showSummary?: boolean;
  position?: 'top' | 'bottom' | 'both';
}

export function Pagination({ total, limit, offset, showSummary = true }: PaginationProps) {
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);
  const hasMore = offset + limit < total;
  const hasPrevious = offset > 0;

  // Calculate page numbers to display (show 5 pages around current)
  const pages: number[] = [];
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return html`
    <div class="bg-white border-t border-neutral-200 px-2 sm:px-4 py-3 sm:py-4 flex items-center justify-between rounded-b-lg">
      ${showSummary ? html`
        <!-- Mobile view -->
        <div class="flex sm:hidden flex-1 flex-col gap-3">
          <div class="flex justify-center">
            <span class="text-sm text-neutral-700">
              Page ${currentPage} of ${totalPages}
            </span>
          </div>
          <div class="flex justify-between gap-2">
            <button
              data-page="${currentPage - 1}"
              ${!hasPrevious ? 'disabled' : ''}
              class="flex-1 inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 hover:bg-primary-50 hover:text-primary-600 transition-colors ${!hasPrevious ? 'cursor-not-allowed opacity-50' : ''}">
              <i data-lucide="chevron-left" class="h-4 w-4 mr-1"></i>
              Prev
            </button>
            <button
              data-page="${currentPage + 1}"
              ${!hasMore ? 'disabled' : ''}
              class="flex-1 inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 hover:bg-primary-50 hover:text-primary-600 transition-colors ${!hasMore ? 'cursor-not-allowed opacity-50' : ''}">
              Next
              <i data-lucide="chevron-right" class="h-4 w-4 ml-1"></i>
            </button>
          </div>
        </div>

        <!-- Desktop view -->
        <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-neutral-700">
              Showing
              <span class="font-semibold text-neutral-900">${Math.min(offset + 1, total)}</span>
              to
              <span class="font-semibold text-neutral-900">${Math.min(offset + limit, total)}</span>
              of
              <span class="font-semibold text-neutral-900">${total}</span>
              results
            </p>
          </div>
          <div>
            <nav class="isolate inline-flex -space-x-px rounded-lg shadow-sm" aria-label="Pagination">
              ${renderPaginationButtons(hasPrevious, hasMore, pages, currentPage, totalPages)}
            </nav>
          </div>
        </div>
      ` : html`
        <nav class="flex-1 flex justify-center">
          <div class="isolate inline-flex -space-x-px rounded-lg shadow-sm">
            ${renderPaginationButtons(hasPrevious, hasMore, pages, currentPage, totalPages)}
          </div>
        </nav>
      `}
    </div>
  `;
}

function renderPaginationButtons(hasPrevious: boolean, hasMore: boolean, pages: number[], currentPage: number, totalPages: number) {
  return html`
    <!-- Prev button -->
    <button
      data-page="${currentPage - 1}"
      ${!hasPrevious ? 'disabled' : ''}
      class="relative inline-flex items-center rounded-l-lg px-3 py-2 text-neutral-500 ring-1 ring-inset ring-neutral-300 hover:bg-primary-50 hover:text-primary-600 focus:z-20 transition-colors ${!hasPrevious ? 'cursor-not-allowed opacity-50' : ''}">
      <span class="sr-only">Prev</span>
      <i data-lucide="chevron-left" class="h-5 w-5"></i>
    </button>

    <!-- First page if not in range -->
    ${pages[0] > 1 ? html`
      <button data-page="1" class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-neutral-900 ring-1 ring-inset ring-neutral-300 hover:bg-primary-50 hover:text-primary-600 focus:z-20 transition-colors">
        1
      </button>
      ${pages[0] > 2 ? html`
        <span class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-neutral-500 ring-1 ring-inset ring-neutral-300">
          ...
        </span>
      ` : ''}
    ` : ''}

    <!-- Page numbers -->
    ${pages.map(page => html`
      <button
        data-page="${page}"
        class="relative inline-flex items-center px-4 py-2 text-sm font-semibold transition-colors ${
          page === currentPage
            ? 'z-10 bg-primary-600 text-white hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
            : 'text-neutral-900 ring-1 ring-inset ring-neutral-300 hover:bg-primary-50 hover:text-primary-600 focus:z-20'
        }">
        ${page}
      </button>
    `)}

    <!-- Last page if not in range -->
    ${pages[pages.length - 1] < totalPages ? html`
      ${pages[pages.length - 1] < totalPages - 1 ? html`
        <span class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-neutral-500 ring-1 ring-inset ring-neutral-300">
          ...
        </span>
      ` : ''}
      <button data-page="${totalPages}" class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-neutral-900 ring-1 ring-inset ring-neutral-300 hover:bg-primary-50 hover:text-primary-600 focus:z-20 transition-colors">
        ${totalPages}
      </button>
    ` : ''}

    <!-- Next button -->
    <button
      data-page="${currentPage + 1}"
      ${!hasMore ? 'disabled' : ''}
      class="relative inline-flex items-center rounded-r-lg px-3 py-2 text-neutral-500 ring-1 ring-inset ring-neutral-300 hover:bg-primary-50 hover:text-primary-600 focus:z-20 transition-colors ${!hasMore ? 'cursor-not-allowed opacity-50' : ''}">
      <span class="sr-only">Next</span>
      <i data-lucide="chevron-right" class="h-5 w-5"></i>
    </button>
  `;
}

/**
 * Client-side compatible function that returns HTML string
 * Used for dynamic rendering in browser JavaScript
 */
Pagination.toHTML = function({ total, limit, offset, showSummary = true }: PaginationProps): string {
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);
  const hasMore = offset + limit < total;
  const hasPrevious = offset > 0;

  // Calculate page numbers to display (show 5 pages around current)
  const pages: number[] = [];
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  const renderButtonsHTML = () => {
    let html = '';

    // Prev button
    html += `
      <button
        data-page="${currentPage - 1}"
        ${!hasPrevious ? 'disabled' : ''}
        class="relative inline-flex items-center rounded-l-lg px-3 py-2 text-neutral-500 ring-1 ring-inset ring-neutral-300 hover:bg-primary-50 hover:text-primary-600 focus:z-20 transition-colors ${!hasPrevious ? 'cursor-not-allowed opacity-50' : ''}">
        <span class="sr-only">Prev</span>
        <i data-lucide="chevron-left" class="h-5 w-5"></i>
      </button>
    `;

    // First page if not in range
    if (pages[0] > 1) {
      html += `<button data-page="1" class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-neutral-900 ring-1 ring-inset ring-neutral-300 hover:bg-primary-50 hover:text-primary-600 focus:z-20 transition-colors">1</button>`;
      if (pages[0] > 2) {
        html += `<span class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-neutral-500 ring-1 ring-inset ring-neutral-300">...</span>`;
      }
    }

    // Page numbers
    pages.forEach(page => {
      const isActive = page === currentPage;
      html += `
        <button
          data-page="${page}"
          class="relative inline-flex items-center px-4 py-2 text-sm font-semibold transition-colors ${
            isActive
              ? 'z-10 bg-primary-600 text-white hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
              : 'text-neutral-900 ring-1 ring-inset ring-neutral-300 hover:bg-primary-50 hover:text-primary-600 focus:z-20'
          }">
          ${page}
        </button>
      `;
    });

    // Last page if not in range
    if (pages[pages.length - 1] < totalPages) {
      if (pages[pages.length - 1] < totalPages - 1) {
        html += `<span class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-neutral-500 ring-1 ring-inset ring-neutral-300">...</span>`;
      }
      html += `<button data-page="${totalPages}" class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-neutral-900 ring-1 ring-inset ring-neutral-300 hover:bg-primary-50 hover:text-primary-600 focus:z-20 transition-colors">${totalPages}</button>`;
    }

    // Next button
    html += `
      <button
        data-page="${currentPage + 1}"
        ${!hasMore ? 'disabled' : ''}
        class="relative inline-flex items-center rounded-r-lg px-3 py-2 text-neutral-500 ring-1 ring-inset ring-neutral-300 hover:bg-primary-50 hover:text-primary-600 focus:z-20 transition-colors ${!hasMore ? 'cursor-not-allowed opacity-50' : ''}">
        <span class="sr-only">Next</span>
        <i data-lucide="chevron-right" class="h-5 w-5"></i>
      </button>
    `;

    return html;
  };

  if (showSummary) {
    return `
      <div class="bg-white border-t border-neutral-200 px-2 sm:px-4 py-3 sm:py-4 flex items-center justify-between rounded-b-lg">
        <!-- Mobile view -->
        <div class="flex sm:hidden flex-1 flex-col gap-3">
          <div class="flex justify-center">
            <span class="text-sm text-neutral-700">
              Page ${currentPage} of ${totalPages}
            </span>
          </div>
          <div class="flex justify-between gap-2">
            <button
              data-page="${currentPage - 1}"
              ${!hasPrevious ? 'disabled' : ''}
              class="flex-1 inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 hover:bg-primary-50 hover:text-primary-600 transition-colors ${!hasPrevious ? 'cursor-not-allowed opacity-50' : ''}">
              <i data-lucide="chevron-left" class="h-4 w-4 mr-1"></i>
              Prev
            </button>
            <button
              data-page="${currentPage + 1}"
              ${!hasMore ? 'disabled' : ''}
              class="flex-1 inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 hover:bg-primary-50 hover:text-primary-600 transition-colors ${!hasMore ? 'cursor-not-allowed opacity-50' : ''}">
              Next
              <i data-lucide="chevron-right" class="h-4 w-4 ml-1"></i>
            </button>
          </div>
        </div>

        <!-- Desktop view -->
        <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-neutral-700">
              Showing
              <span class="font-semibold text-neutral-900">${Math.min(offset + 1, total)}</span>
              to
              <span class="font-semibold text-neutral-900">${Math.min(offset + limit, total)}</span>
              of
              <span class="font-semibold text-neutral-900">${total}</span>
              results
            </p>
          </div>
          <div>
            <nav class="isolate inline-flex -space-x-px rounded-lg shadow-sm" aria-label="Pagination">
              ${renderButtonsHTML()}
            </nav>
          </div>
        </div>
      </div>
    `.trim();
  } else {
    return `
      <div class="bg-white border-t border-neutral-200 px-2 sm:px-4 py-3 sm:py-4 flex items-center justify-between rounded-b-lg">
        <nav class="flex-1 flex justify-center">
          <div class="isolate inline-flex -space-x-px rounded-lg shadow-sm">
            ${renderButtonsHTML()}
          </div>
        </nav>
      </div>
    `.trim();
  }
};
