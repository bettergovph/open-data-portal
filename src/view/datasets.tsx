import { Hono } from "hono";
import { html } from "hono/html";
import { Layout } from "../components/Layout";
import { LoadingSkeleton } from "../components/LoadingSkeleton";

const app = new Hono();

app.get("/", async (c) => {
  const breadcrumbs = [{ label: "Home", href: "/" }, { label: "Datasets" }];

  const content = html`
      <div class="container-custom pt-4 pb-8">
          <h1 class="text-3xl font-bold text-neutral-900 mb-8">Browse Datasets</h1>

          <!-- Search and Filters -->
          <div class="bg-white border border-neutral-200 rounded-lg shadow-sm p-6 mb-6">
              <form id="filter-form" class="space-y-4">
                  <!-- Search -->
                  <div>
                      <label for="search" class="block text-sm font-medium text-neutral-700 mb-2">Search</label>
                      <input
                              type="search"
                              id="search"
                              name="search"
                              placeholder="Search by name, description, or tags..."
                              class="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      />
                  </div>

                  <!-- Filters Row -->
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                          <label for="category_id"
                                 class="block text-sm font-medium text-neutral-700 mb-2">Category</label>
                          <select
                                  id="category_id"
                                  name="category_id"
                                  class="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                          >
                              <option value="">All Categories</option>
                          </select>
                      </div>

                      <div>
                          <label for="publisher_id"
                                 class="block text-sm font-medium text-neutral-700 mb-2">Publisher</label>
                          <select
                                  id="publisher_id"
                                  name="publisher_id"
                                  class="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                          >
                              <option value="">All Publishers</option>
                          </select>
                      </div>

                      <div>
                          <label for="sort" class="block text-sm font-medium text-neutral-700 mb-2">Sort By</label>
                          <select
                                  id="sort"
                                  name="sort"
                                  class="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                          >
                              <option value="name_asc">Name (A-Z)</option>
                              <option value="name_desc">Name (Z-A)</option>
                              <option value="latest_version_date_desc">Recently Updated</option>
                              <option value="latest_version_date_asc">Oldest First</option>
                              <option value="size_bytes_desc">Largest First</option>
                              <option value="size_bytes_asc">Smallest First</option>
                          </select>
                      </div>
                  </div>

                  <!-- Action Buttons -->
                  <div class="flex gap-2">
                      <button
                              type="submit"
                              class="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                      >
                          Apply Filters
                      </button>
                      <button
                              type="button"
                              id="reset-filters"
                              class="px-6 py-2 bg-neutral-200 text-neutral-700 rounded-md hover:bg-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-500 transition-colors"
                      >
                          Reset
                      </button>
                  </div>
              </form>

              <!-- Active Filters -->
              <div id="active-filters" class="mt-4 hidden">
                  <div class="flex items-center gap-2 flex-wrap">
                      <span class="text-sm font-medium text-neutral-700">Active filters:</span>
                      <div id="filter-chips" class="flex gap-2 flex-wrap"></div>
                  </div>
              </div>

              <!-- Pagination Controls -->
              <div class="mt-4 pt-4 border-t border-neutral-200 flex items-center justify-between">
                  <div class="flex items-center gap-3">
                      <button
                              id="prev-page-btn"
                              onclick="goToPreviousPage()"
                              disabled
                              class="px-4 py-2 border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                          Prev
                      </button>
                      <span id="page-info" class="text-sm text-neutral-600">Loading...</span>
                      <button
                              id="next-page-btn"
                              onclick="goToNextPage()"
                              disabled
                              class="px-4 py-2 border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                          Next
                      </button>
                  </div>
                  <div class="flex items-center gap-2">
                      <span class="text-sm text-neutral-600">Items per page:</span>
                      <select
                              id="per-page-select"
                              class="px-3 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      >
                          <option value="10" selected>10</option>
                          <option value="20">20</option>
                          <option value="50">50</option>
                      </select>
                  </div>
              </div>
          </div>

          <!-- Results Summary -->
          <div id="results-summary" class="mb-4 text-sm text-neutral-600">
              Loading datasets...
          </div>

          <!-- Datasets List -->
          <div id="datasets-container" class="space-y-4">
              <!-- Loading skeletons -->
              ${LoadingSkeleton({ variant: "dataset-card", count: 5 })}
          </div>

          <!-- Bottom Pagination Controls -->
          <div class="mt-6 flex items-center justify-center gap-3">
              <button
                      id="prev-page-btn-bottom"
                      onclick="goToPreviousPage()"
                      disabled
                      class="px-4 py-2 border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                  Previous
              </button>
              <span id="page-info-bottom" class="text-sm text-neutral-600">Loading...</span>
              <button
                      id="next-page-btn-bottom"
                      onclick="goToNextPage()"
                      disabled
                      class="px-4 py-2 border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                  Next
              </button>
          </div>
      </div>

      <script>
          // State management
          let currentFilters = {
              search: '',
              category_id: '',
              publisher_id: '',
              sort: 'name_asc',
              limit: 10,
              offset: 0
          };

          let currentPagination = null;

          let categories = [];
          let publishers = [];

          // Initialize from URL params
          function initFromURL() {
              const params = new URLSearchParams(window.location.search);
              currentFilters.search = params.get('search') || '';
              currentFilters.category_id = params.get('category_id') || '';
              currentFilters.publisher_id = params.get('publisher_id') || '';
              currentFilters.sort = params.get('sort') || 'name_asc';
              currentFilters.limit = parseInt(params.get('limit') || '10');
              currentFilters.offset = parseInt(params.get('offset') || '0');

              // Update form fields
              document.getElementById('search').value = currentFilters.search;
              document.getElementById('sort').value = currentFilters.sort;
              document.getElementById('per-page-select').value = currentFilters.limit.toString();
          }

          // Update URL without reload
          function updateURL() {
              const params = new URLSearchParams();
              Object.keys(currentFilters).forEach(key => {
                  if (currentFilters[key] && currentFilters[key] !== '') {
                      params.set(key, currentFilters[key]);
                  }
              });
              const newURL = window.location.pathname + '?' + params.toString();
              window.history.pushState({}, '', newURL);
          }

          // Load categories and publishers for filters
          async function loadFilters() {
              try {
                  const [catResponse, pubResponse] = await Promise.all([
                      fetch('/api/categories'),
                      fetch('/api/publishers')
                  ]);

                  const catData = await catResponse.json();
                  const pubData = await pubResponse.json();

                  if (catData.success) {
                      categories = catData.data;
                      const catSelect = document.getElementById('category_id');
                      categories.forEach(cat => {
                          const option = document.createElement('option');
                          option.value = cat.id;
                          option.textContent = cat.name;
                          if (cat.id === currentFilters.category_id) {
                              option.selected = true;
                          }
                          catSelect.appendChild(option);
                      });
                  }

                  if (pubData.success) {
                      publishers = pubData.data;
                      const pubSelect = document.getElementById('publisher_id');
                      publishers.forEach(pub => {
                          const option = document.createElement('option');
                          option.value = pub.id;
                          option.textContent = pub.name;
                          if (pub.id === currentFilters.publisher_id) {
                              option.selected = true;
                          }
                          pubSelect.appendChild(option);
                      });
                  }

                  updateActiveFilters();
              } catch (error) {
                  console.error('Failed to load filters:', error);
              }
          }

          // Update active filter chips
          function updateActiveFilters() {
              const container = document.getElementById('active-filters');
              const chipsContainer = document.getElementById('filter-chips');
              const chips = [];

              if (currentFilters.search) {
                  chips.push({
                      key: 'search',
                      label: \`Search: "\${currentFilters.search}"\`,
                      value: currentFilters.search
                  });
              }

              if (currentFilters.category_id) {
                  const cat = categories.find(c => c.id === currentFilters.category_id);
                  if (cat) {
                      chips.push({
                          key: 'category_id',
                          label: \`Category: \${cat.name}\`,
                          value: currentFilters.category_id
                      });
                  }
              }

              if (currentFilters.publisher_id) {
                  const pub = publishers.find(p => p.id === currentFilters.publisher_id);
                  if (pub) {
                      chips.push({
                          key: 'publisher_id',
                          label: \`Publisher: \${pub.name}\`,
                          value: currentFilters.publisher_id
                      });
                  }
              }

              if (chips.length > 0) {
                  container.classList.remove('hidden');
                  chipsContainer.innerHTML = chips.map(chip => \`
            <button
              data-filter-key="\${chip.key}"
              class="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm hover:bg-primary-200 transition-colors"
            >
              \${chip.label}
              <i data-lucide="x" class="w-4 h-4"></i>
            </button>
          \`).join('') + \`
            <button
              id="clear-all-filters"
              class="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Clear all
            </button>
          \`;

                  // Add event listeners to chips
                  chipsContainer.querySelectorAll('[data-filter-key]').forEach(btn => {
                      btn.addEventListener('click', () => {
                          const key = btn.dataset.filterKey;
                          currentFilters[key] = '';
                          document.getElementById(key).value = '';
                          currentFilters.offset = 0;
                          updateURL();
                          updateActiveFilters();
                          loadDatasets();
                      });
                  });

                  document.getElementById('clear-all-filters')?.addEventListener('click', resetFilters);
              } else {
                  container.classList.add('hidden');
              }
          }

          // Format bytes
          function formatBytes(bytes) {
              if (bytes === 0) return '0 B';
              const k = 1024;
              const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
              const i = Math.floor(Math.log(bytes) / Math.log(k));
              return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
          }

          // Format date
          function formatDate(dateString) {
              if (!dateString) return 'N/A';
              const date = new Date(dateString);
              return date.toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: 'numeric'});
          }

          // Load datasets
          async function loadDatasets() {
              try {
                  const params = new URLSearchParams();

                  // Parse sort - split from the end to handle multi-underscore field names
                  const sortParts = currentFilters.sort.split('_');
                  const sortDir = sortParts[sortParts.length - 1];
                  const sortField = sortParts.slice(0, -1).join('_');

                  if (currentFilters.search) params.set('search', currentFilters.search);
                  if (currentFilters.category_id) params.set('category_id', currentFilters.category_id);
                  if (currentFilters.publisher_id) params.set('publisher_id', currentFilters.publisher_id);
                  params.set('sort', sortField);
                  params.set('dir', sortDir);
                  params.set('limit', currentFilters.limit);
                  params.set('offset', currentFilters.offset);

                  const response = await fetch('/api/datasets?' + params.toString());
                  const data = await response.json();

                  if (data.success && data.data) {
                      renderDatasets(data.data, data.pagination);
                  } else {
                      renderError('Failed to load datasets');
                  }
              } catch (error) {
                  console.error('Failed to load datasets:', error);
                  renderError('Failed to load datasets. Please try again.');
              }
          }

          // Render datasets
          function renderDatasets(datasets, pagination) {
              const container = document.getElementById('datasets-container');
              const summaryEl = document.getElementById('results-summary');
              currentPagination = pagination;

              if (datasets.length === 0) {
                  container.innerHTML = \`
            <div class="bg-white rounded-lg shadow-sm p-12 text-center">
              <i data-lucide="frown" class="w-16 h-16 text-neutral-400 mx-auto mb-4"></i>
              <h3 class="text-lg font-medium text-neutral-900 mb-2">No datasets found</h3>
              <p class="text-neutral-600 mb-4">Try adjusting your filters or search terms.</p>
              <button onclick="resetFilters()" class="text-primary-600 hover:text-primary-700 font-medium">
                Clear all filters
              </button>
            </div>
          \`;
                  summaryEl.textContent = 'No results found';
                  updatePaginationControls();
                  return;
              }

              // Render summary
              const start = pagination.offset + 1;
              const end = Math.min(pagination.offset + pagination.limit, pagination.total);
              summaryEl.textContent = \`Showing \${start}-\${end} of \${pagination.total} datasets\`;

              // Render dataset cards
              container.innerHTML = datasets.map(dataset => \`
          <a href="/datasets/\${dataset.id}"
             class="block bg-white rounded-lg shadow-sm border border-neutral-200 hover:shadow-md hover:border-primary-500 transition-all p-6 group flex flex-col h-full">
            <!-- Fixed height title section (1 line only) -->
            <div class="flex items-start justify-between mb-2 h-7">
              <h3 class="text-lg font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors flex-1 truncate pr-2">\${dataset.name}</h3>
              <i data-lucide="chevron-right" class="w-5 h-5 text-neutral-400 group-hover:text-primary-600 transition-colors flex-shrink-0"></i>
            </div>

            <!-- Fixed height description section (exactly 2 lines = 2.5rem) -->
            <div class="mb-4 h-10">
              <p class="text-sm text-neutral-600 line-clamp-2 leading-5">\${dataset.description || ''}</p>
            </div>

            <!-- Fixed height tags section (exactly 1 line = 1.75rem) -->
            <div class="flex gap-2 mb-4 h-7">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700 truncate max-w-[50%]">
                <i data-lucide="building-2" class="w-3 h-3 mr-1 flex-shrink-0"></i>
                <span class="truncate">\${dataset.publisher?.name || 'Unknown Publisher'}</span>
              </span>
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-success-100 text-success-700 truncate max-w-[50%]">
                <i data-lucide="tag" class="w-3 h-3 mr-1 flex-shrink-0"></i>
                <span class="truncate">\${dataset.category?.name || 'Unknown Category'}</span>
              </span>
            </div>

            <!-- Spacer to push footer to bottom -->
            <div class="flex-grow"></div>

            <!-- Fixed position footer -->
            <div class="flex items-center justify-between text-xs text-neutral-500 pt-4 border-t border-neutral-100 mt-auto">
              <div class="flex items-center space-x-4">
                <span class="flex items-center font-medium whitespace-nowrap">
                  <i data-lucide="file-text" class="w-4 h-4 mr-1.5 text-primary-500"></i>
                  \${dataset.resource_count || 0} resource\${dataset.resource_count !== 1 ? 's' : ''}
                </span>
                <span class="font-medium whitespace-nowrap">\${formatBytes(dataset.size_bytes || 0)}</span>
              </div>
              \${dataset.latest_version_date ? \`<span class="text-neutral-600 whitespace-nowrap">Published \${formatDate(dataset.latest_version_date)}</span>\` : ''}
            </div>
          </a>
        \`).join('');

              // Update pagination controls
              updatePaginationControls();

              // Initialize Lucide icons
              if (typeof lucide !== 'undefined') {
                  lucide.createIcons();
              }
          }

          // Update pagination controls
          function updatePaginationControls() {
              if (!currentPagination) return;

              const currentPage = Math.floor(currentPagination.offset / currentPagination.limit) + 1;
              const totalPages = Math.ceil(currentPagination.total / currentPagination.limit);

              // Update page info (top and bottom)
              const pageInfoText = currentPagination.total === 0 ? 'No pages' : \`Page \${currentPage} of \${totalPages.toLocaleString()}\`;
              document.getElementById('page-info').textContent = pageInfoText;
              document.getElementById('page-info-bottom').textContent = pageInfoText;

              // Update button states (top and bottom)
              const prevBtn = document.getElementById('prev-page-btn');
              const nextBtn = document.getElementById('next-page-btn');
              const prevBtnBottom = document.getElementById('prev-page-btn-bottom');
              const nextBtnBottom = document.getElementById('next-page-btn-bottom');

              if (currentPagination.offset === 0 || currentPagination.total === 0) {
                  prevBtn.disabled = true;
                  prevBtnBottom.disabled = true;
              } else {
                  prevBtn.disabled = false;
                  prevBtnBottom.disabled = false;
              }

              if (!currentPagination.has_more || currentPagination.total === 0) {
                  nextBtn.disabled = true;
                  nextBtnBottom.disabled = true;
              } else {
                  nextBtn.disabled = false;
                  nextBtnBottom.disabled = false;
              }
          }

          // Go to previous page
          function goToPreviousPage() {
              if (currentPagination && currentPagination.offset > 0) {
                  const currentPage = Math.floor(currentPagination.offset / currentPagination.limit) + 1;
                  goToPage(currentPage - 1);
              }
          }

          // Go to next page
          function goToNextPage() {
              if (currentPagination && currentPagination.has_more) {
                  const currentPage = Math.floor(currentPagination.offset / currentPagination.limit) + 1;
                  goToPage(currentPage + 1);
              }
          }

          // Old pagination rendering function (keeping for compatibility)
          function renderPagination(pagination) {
              const container = document.getElementById('pagination-container');
              const currentPage = Math.floor(pagination.offset / pagination.limit) + 1;
              const totalPages = Math.ceil(pagination.total / pagination.limit);

              if (totalPages <= 1) {
                  container.innerHTML = '';
                  return;
              }

              const hasPrevious = pagination.offset > 0;
              const hasNext = pagination.has_more;

              // Calculate page numbers to show
              const pages = [];
              const startPage = Math.max(1, currentPage - 2);
              const endPage = Math.min(totalPages, currentPage + 2);

              for (let i = startPage; i <= endPage; i++) {
                  pages.push(i);
              }

              let html = '<div class="bg-white border-t border-neutral-200 px-4 py-3 flex items-center justify-between sm:px-6 rounded-lg shadow-sm">';
              html += '<div class="flex-1 flex justify-center"><nav class="isolate inline-flex -space-x-px rounded-md shadow-sm">';

              // Previous button
              html += \`
          <button
            onclick="goToPage(\${currentPage - 1})"
            \${!hasPrevious ? 'disabled' : ''}
            class="relative inline-flex items-center rounded-l-md px-2 py-2 text-neutral-400 ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50 focus:z-20 \${!hasPrevious ? 'cursor-not-allowed opacity-50' : ''}"
          >
            <i data-lucide="chevron-left" class="h-5 w-5"></i>
          </button>
        \`;

              // First page if not in range
              if (pages[0] > 1) {
                  html += \`<button onclick="goToPage(1)" class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-neutral-900 ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50">1</button>\`;
                  if (pages[0] > 2) {
                      html += '<span class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-neutral-700 ring-1 ring-inset ring-neutral-300">...</span>';
                  }
              }

              // Page numbers
              pages.forEach(page => {
                  const isActive = page === currentPage;
                  html += \`
            <button
              onclick="goToPage(\${page})"
              class="relative inline-flex items-center px-4 py-2 text-sm font-semibold \${
                          isActive
                                  ? 'z-10 bg-primary-600 text-white'
                                  : 'text-neutral-900 ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50'
                  }"
            >
              \${page}
            </button>
          \`;
              });

              // Last page if not in range
              if (pages[pages.length - 1] < totalPages) {
                  if (pages[pages.length - 1] < totalPages - 1) {
                      html += '<span class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-neutral-700 ring-1 ring-inset ring-neutral-300">...</span>';
                  }
                  html += \`<button onclick="goToPage(\${totalPages})" class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-neutral-900 ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50">\${totalPages}</button>\`;
              }

              // Next button
              html += \`
          <button
            onclick="goToPage(\${currentPage + 1})"
            \${!hasNext ? 'disabled' : ''}
            class="relative inline-flex items-center rounded-r-md px-2 py-2 text-neutral-400 ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50 focus:z-20 \${!hasNext ? 'cursor-not-allowed opacity-50' : ''}"
          >
            <i data-lucide="chevron-right" class="h-5 w-5"></i>
          </button>
        \`;

              html += '</nav></div></div>';
              container.innerHTML = html;
          }

          // Go to page
          function goToPage(page) {
              currentFilters.offset = (page - 1) * currentFilters.limit;
              updateURL();
              loadDatasets();
              window.scrollTo({top: 0, behavior: 'smooth'});
          }

          // Render error
          function renderError(message) {
              const container = document.getElementById('datasets-container');
              container.innerHTML = \`
          <div class="bg-accent-50 border border-accent-200 rounded-lg p-4 text-center">
            <p class="text-accent-700">\${message}</p>
          </div>
        \`;
          }

          // Reset filters
          function resetFilters() {
              currentFilters = {
                  search: '',
                  category_id: '',
                  publisher_id: '',
                  sort: 'name_asc',
                  limit: 10,
                  offset: 0
              };

              document.getElementById('search').value = '';
              document.getElementById('category_id').value = '';
              document.getElementById('publisher_id').value = '';
              document.getElementById('sort').value = 'name_asc';

              updateURL();
              updateActiveFilters();
              loadDatasets();
          }

          // Form submit handler
          document.getElementById('filter-form').addEventListener('submit', (e) => {
              e.preventDefault();
              currentFilters.search = document.getElementById('search').value.trim();
              currentFilters.category_id = document.getElementById('category_id').value;
              currentFilters.publisher_id = document.getElementById('publisher_id').value;
              currentFilters.sort = document.getElementById('sort').value;
              currentFilters.offset = 0; // Reset to first page

              updateURL();
              updateActiveFilters();
              loadDatasets();
          });

          // Reset button handler
          document.getElementById('reset-filters').addEventListener('click', resetFilters);

          // Per page change handler
          document.getElementById('per-page-select')?.addEventListener('change', (e) => {
              currentFilters.limit = parseInt(e.target.value);
              currentFilters.offset = 0; // Reset to first page
              updateURL();
              loadDatasets();
          });

          // Initialize on page load
          document.addEventListener('DOMContentLoaded', () => {
              initFromURL();
              loadFilters();
              loadDatasets();
          });

          // Debounced search
          let searchTimeout;
          document.getElementById('search').addEventListener('input', (e) => {
              clearTimeout(searchTimeout);
              searchTimeout = setTimeout(() => {
                  currentFilters.search = e.target.value.trim();
                  currentFilters.offset = 0;
                  updateURL();
                  updateActiveFilters();
                  loadDatasets();
              }, 500);
          });
      </script>
  `;

  return c.html(
    Layout({
      title: "Browse Datasets - Open Data Portal",
      children: content,
      breadcrumbs,
    }),
  );
});

export default app;
