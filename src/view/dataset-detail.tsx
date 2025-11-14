import { Hono } from 'hono';
import { Layout } from '../components/Layout';
import { html } from 'hono/html';

const app = new Hono();

app.get('/:id', async (c) => {
  const id = c.req.param('id');

  const content = html`
    <div class="container-custom pt-4 pb-8">
      <!-- Loading State -->
      <div id="loading" class="animate-pulse">
        <div class="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div class="h-4 bg-gray-200 rounded w-5/6 mb-8"></div>
        <div class="grid grid-cols-3 gap-4 mb-8">
          <div class="h-24 bg-gray-200 rounded"></div>
          <div class="h-24 bg-gray-200 rounded"></div>
          <div class="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>

      <!-- Content (hidden initially) -->
      <div id="content" class="hidden">
        <!-- Breadcrumbs will be set dynamically -->

        <!-- Header -->
        <div class="bg-white border border-neutral-200 rounded-lg shadow-sm p-8 mb-6">
          <h1 id="dataset-name" class="text-3xl font-bold text-gray-900 mb-4"></h1>
          <p id="dataset-description" class="text-gray-700 mb-6"></p>

          <!-- Metadata: Publisher, Category, Tags -->
          <div id="metadata-container" class="flex flex-col gap-2 mb-6"></div>

          <!-- Statistics -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p id="resource-count" class="text-2xl font-bold text-gray-900">0</p>
                  <p class="text-sm text-gray-600">Resources</p>
                </div>
                <svg class="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
            </div>

            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p id="total-size" class="text-2xl font-bold text-gray-900">0 B</p>
                  <p class="text-sm text-gray-600">Total Size</p>
                </div>
                <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"></path>
                </svg>
              </div>
            </div>

            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p id="version-date" class="text-2xl font-bold text-gray-900">N/A</p>
                  <p class="text-sm text-gray-600">Latest Version</p>
                </div>
                <svg class="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Resources Section -->
        <div class="bg-white border border-neutral-200 rounded-lg shadow-sm p-6 mb-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Resources</h2>

          <!-- Results Summary and Items Per Page -->
          <div class="mb-4 flex items-center justify-between">
            <div id="resource-results-summary" class="text-sm text-neutral-600">
              Loading resources...
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm text-neutral-600">Items per page:</span>
              <select
                id="resources-per-page-select"
                class="px-3 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="10" selected>10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>

          <div id="resources-container" class="overflow-x-auto">
            <!-- Resources table will be loaded here -->
          </div>

          <!-- Pagination Controls -->
          <div class="mt-6 flex items-center justify-start gap-3">
            <button
              id="prev-resource-page-btn"
              onclick="goToPreviousResourcePage()"
              disabled
              class="px-4 py-2 border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span id="resource-page-info" class="text-sm text-neutral-600">Loading...</span>
            <button
              id="next-resource-page-btn"
              onclick="goToNextResourcePage()"
              disabled
              class="px-4 py-2 border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div id="error" class="hidden text-center py-12">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Dataset Not Found</h2>
        <p class="text-gray-600 mb-6">The dataset you're looking for doesn't exist or has been removed.</p>
        <a href="/datasets" class="text-primary-600 hover:text-primary-700 font-medium">
          Browse all datasets →
        </a>
      </div>
    </div>

    <script>
      const datasetId = '${id}';
      let allResources = [];
      let resourcesPagination = null;

      // State management for resource pagination
      let currentResourceFilters = {
        limit: 10,
        offset: 0
      };

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
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
      }

      // Update breadcrumbs dynamically
      function updateBreadcrumbs(categoryName, datasetName) {
        // This would require server-side rendering or a more complex client-side solution
        // For now, we'll skip this as it requires modifying the Layout component
      }

      // Load dataset and resources
      async function loadDataset() {
        try {
          // Fetch dataset details
          const datasetResponse = await fetch(\`/api/datasets/\${datasetId}\`);
          const datasetData = await datasetResponse.json();

          if (!datasetData.success || !datasetData.data) {
            showError();
            return;
          }

          const dataset = datasetData.data;

          // Fetch resources for this dataset with pagination
          await loadResources(dataset);
        } catch (error) {
          console.error('Failed to load dataset:', error);
          showError();
        }
      }

      // Load resources with pagination
      async function loadResources(dataset) {
        await loadResourcesWithFilters(dataset);
      }

      async function loadResourcesWithFilters(dataset) {
        try {
          if (!dataset) {
            // Fetch dataset if not provided
            const datasetResponse = await fetch(\`/api/datasets/\${datasetId}\`);
            const datasetData = await datasetResponse.json();
            if (!datasetData.success || !datasetData.data) {
              return;
            }
            dataset = datasetData.data;
          }

          const params = new URLSearchParams();
          params.set('dataset_id', datasetId);
          params.set('limit', currentResourceFilters.limit);
          params.set('offset', currentResourceFilters.offset);

          const resourcesResponse = await fetch(\`/api/resources?\` + params.toString());
          const resourcesData = await resourcesResponse.json();

          if (resourcesData.success) {
            allResources = resourcesData.data || [];
            resourcesPagination = resourcesData.pagination;
            renderDataset(dataset, allResources);
            updateResourcePaginationControls();
          } else {
            renderDataset(dataset, []);
          }
        } catch (error) {
          console.error('Failed to load resources:', error);
          if (dataset) {
            renderDataset(dataset, []);
          }
        }
      }

      // Update resource pagination controls
      function updateResourcePaginationControls() {
        if (!resourcesPagination) return;

        const currentPage = Math.floor(resourcesPagination.offset / resourcesPagination.limit) + 1;
        const totalPages = Math.ceil(resourcesPagination.total / resourcesPagination.limit);

        // Update page info
        const pageInfo = document.getElementById('resource-page-info');
        if (pageInfo) {
          pageInfo.textContent = resourcesPagination.total === 0 ? 'No pages' : \`Page \${currentPage} of \${totalPages.toLocaleString()}\`;
        }

        // Update results summary
        const summaryEl = document.getElementById('resource-results-summary');
        if (summaryEl) {
          if (resourcesPagination.total === 0) {
            summaryEl.textContent = 'No resources found';
          } else {
            const start = resourcesPagination.offset + 1;
            const end = Math.min(resourcesPagination.offset + resourcesPagination.limit, resourcesPagination.total);
            summaryEl.textContent = \`Showing \${start}-\${end} of \${resourcesPagination.total} resources\`;
          }
        }

        // Update button states
        const prevBtn = document.getElementById('prev-resource-page-btn');
        const nextBtn = document.getElementById('next-resource-page-btn');

        if (prevBtn) {
          prevBtn.disabled = resourcesPagination.offset === 0 || resourcesPagination.total === 0;
        }

        if (nextBtn) {
          nextBtn.disabled = !resourcesPagination.has_more || resourcesPagination.total === 0;
        }
      }

      // Go to previous resource page
      function goToPreviousResourcePage() {
        if (resourcesPagination && resourcesPagination.offset > 0) {
          const currentPage = Math.floor(resourcesPagination.offset / resourcesPagination.limit) + 1;
          goToResourcePage(currentPage - 1);
        }
      }

      // Go to next resource page
      function goToNextResourcePage() {
        if (resourcesPagination && resourcesPagination.has_more) {
          const currentPage = Math.floor(resourcesPagination.offset / resourcesPagination.limit) + 1;
          goToResourcePage(currentPage + 1);
        }
      }


      // Render dataset
      function renderDataset(dataset, resources) {
        // Hide loading, show content
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('content').classList.remove('hidden');

        // Set basic info
        document.getElementById('dataset-name').textContent = dataset.name;
        document.getElementById('dataset-description').textContent = dataset.description || 'No description available';

        // Render metadata: Publisher, Category, Tags
        const metadataContainer = document.getElementById('metadata-container');
        const metadataParts = [];

        // Publisher badge
        if (dataset.publisher?.name) {
          metadataParts.push(\`
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-600 font-medium">Publisher:</span>
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                \${dataset.publisher.name}
              </span>
            </div>
          \`);
        }

        // Category badge
        if (dataset.category?.name) {
          metadataParts.push(\`
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-600 font-medium">Category:</span>
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                \${dataset.category.name}
              </span>
            </div>
          \`);
        }

        // Tags badges
        let tags = [];
        if (dataset.tags) {
          try {
            tags = typeof dataset.tags === 'string' ? JSON.parse(dataset.tags) : dataset.tags;
          } catch (e) {
            console.error('Failed to parse tags:', e);
          }
        }

        if (tags && tags.length > 0) {
          const tagBadges = tags.map(tag => \`
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
              \${tag}
            </span>
          \`).join('');

          metadataParts.push(\`
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-600 font-medium">Tags:</span>
              <div class="flex flex-wrap gap-2">
                \${tagBadges}
              </div>
            </div>
          \`);
        }

        metadataContainer.innerHTML = metadataParts.join('');


        // Set statistics
        const resourceCount = resourcesPagination ? resourcesPagination.total : (resources ? resources.length : 0);
        document.getElementById('resource-count').textContent = resourceCount;
        document.getElementById('total-size').textContent = formatBytes(dataset.size_bytes || 0);
        document.getElementById('version-date').textContent = formatDate(dataset.latest_version_date);

        // Render resources
        renderResources(resources || []);
      }

      // Render resources pagination
      function renderResourcesPagination() {
        const container = document.getElementById('resources-pagination');

        if (!resourcesPagination || resourcesPagination.total <= resourcesPerPage) {
          container.innerHTML = '';
          return;
        }

        const currentPage = Math.floor(resourcesPagination.offset / resourcesPagination.limit) + 1;
        const totalPages = Math.ceil(resourcesPagination.total / resourcesPagination.limit);
        const hasPrevious = resourcesPagination.offset > 0;
        const hasNext = resourcesPagination.has_more;

        // Calculate page numbers to show
        const pages = [];
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);

        for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
        }

        let html = '<div class="bg-white border-t border-neutral-200 px-4 py-3 flex items-center justify-between sm:px-6 rounded-lg">';
        html += '<div class="flex-1 flex justify-center"><nav class="isolate inline-flex -space-x-px rounded-md shadow-sm">';

        // Previous button
        html += \`
          <button
            onclick="goToResourcePage(\${currentPage - 1})"
            \${!hasPrevious ? 'disabled' : ''}
            class="relative inline-flex items-center rounded-l-md px-2 py-2 text-neutral-400 ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50 focus:z-20 \${!hasPrevious ? 'cursor-not-allowed opacity-50' : ''}"
          >
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
            </svg>
          </button>
        \`;

        // First page if not in range
        if (pages[0] > 1) {
          html += \`<button onclick="goToResourcePage(1)" class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-neutral-900 ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50">1</button>\`;
          if (pages[0] > 2) {
            html += '<span class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-neutral-700 ring-1 ring-inset ring-neutral-300">...</span>';
          }
        }

        // Page numbers
        pages.forEach(page => {
          const isActive = page === currentPage;
          html += \`
            <button
              onclick="goToResourcePage(\${page})"
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
          html += \`<button onclick="goToResourcePage(\${totalPages})" class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-neutral-900 ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50">\${totalPages}</button>\`;
        }

        // Next button
        html += \`
          <button
            onclick="goToResourcePage(\${currentPage + 1})"
            \${!hasNext ? 'disabled' : ''}
            class="relative inline-flex items-center rounded-r-md px-2 py-2 text-neutral-400 ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50 focus:z-20 \${!hasNext ? 'cursor-not-allowed opacity-50' : ''}"
          >
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
            </svg>
          </button>
        \`;

        html += '</nav></div></div>';
        container.innerHTML = html;
      }

      // Go to resource page
      async function goToResourcePage(page) {
        currentResourceFilters.offset = (page - 1) * currentResourceFilters.limit;
        await loadResourcesWithFilters();
        // Scroll to resources section
        document.getElementById('resources-container').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      // Render resources
      function renderResources(resources) {
        const container = document.getElementById('resources-container');

        if (resources.length === 0) {
          container.innerHTML = '<p class="text-gray-500 text-center py-8">No resources available for this dataset</p>';
          return;
        }

        container.innerHTML = \`
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              \${resources.map(resource => \`
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <a href="/datasets/\${datasetId}/resources/\${resource.id}" class="text-sm font-medium text-primary-600 hover:text-primary-700">
                      \${resource.name}
                    </a>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm text-gray-900">\${resource.mime_type.split('/').pop().toUpperCase()}</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    \${formatBytes(resource.size_bytes)}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500 max-w-md truncate">
                    \${resource.description || 'N/A'}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a href="\${resource.download_url}" target="_blank" class="text-primary-600 hover:text-primary-900">
                      <svg class="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                      </svg>
                    </a>
                  </td>
                </tr>
              \`).join('')}
            </tbody>
          </table>
        \`;
      }

      // Show error
      function showError() {
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('error').classList.remove('hidden');
      }

      // Resources per page change handler
      document.getElementById('resources-per-page-select')?.addEventListener('change', async (e) => {
        currentResourceFilters.limit = parseInt(e.target.value);
        currentResourceFilters.offset = 0; // Reset to first page
        await loadResourcesWithFilters();
      });

      // Initialize and load on DOMContentLoaded
      document.addEventListener('DOMContentLoaded', () => {
        loadDataset();
      });
    </script>
  `;

  return c.html(Layout({
    title: 'Dataset Details - Open Data Portal',
    children: content,
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Datasets', href: '/datasets' },
      { label: 'Dataset Details' },
    ],
  }));
});

export default app;
