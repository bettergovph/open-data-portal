import { Hono } from 'hono';
import { Layout } from '../components/Layout';
import { html } from 'hono/html';

const app = new Hono();

app.get('/:resourceId', async (c) => {
  const datasetId = c.req.param('datasetId');
  const resourceId = c.req.param('resourceId');

  const content = html`
    <div class="container-custom pt-4 pb-8">
      <div id="loading" class="animate-pulse">
        <div class="h-8 bg-gray-200 rounded w-2/3 mb-4"></div>
        <div class="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
        <div class="h-48 bg-gray-200 rounded"></div>
      </div>

      <div id="content" class="hidden">
        <!-- Resource Header -->
        <div class="bg-white border border-neutral-200 rounded-lg p-8 mb-6">
          <h1 id="resource-name" class="text-3xl font-bold text-gray-900 mb-4"></h1>

          <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <div class="flex items-center">
              <i data-lucide="info" class="w-5 h-5 text-blue-500 mr-2"></i>
              <p class="text-sm text-blue-700">
                Part of dataset: <a id="dataset-link" href="#" class="font-medium underline hover:text-blue-800"></a>
              </p>
            </div>
          </div>

          <p id="resource-description" class="text-gray-700 mb-6"></p>

          <!-- Metadata Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="bg-gray-50 rounded-lg p-4">
              <p class="text-sm text-gray-500 mb-1">Type</p>
              <p id="resource-type" class="text-lg font-semibold text-gray-900"></p>
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <p class="text-sm text-gray-500 mb-1">Size</p>
              <p id="resource-size" class="text-lg font-semibold text-gray-900"></p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-wrap gap-3">
            <a
              id="download-button"
              href="#"
              target="_blank"
              class="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium"
            >
              <i data-lucide="download" class="w-5 h-5 mr-2"></i>
              Download Resource
            </a>
          </div>
        </div>
      </div>

      <div id="error" class="hidden text-center py-12">
        <i data-lucide="alert-circle" class="w-16 h-16 text-gray-400 mx-auto mb-4"></i>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Resource Not Found</h2>
        <p class="text-gray-600 mb-6">The resource you're looking for doesn't exist.</p>
        <a href="/datasets" class="text-primary-600 hover:text-primary-700 font-medium">
          Browse all datasets →
        </a>
      </div>
    </div>

    <script>
      const datasetId = '${datasetId}';
      const resourceId = '${resourceId}';

      function formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
      }


      async function loadResource() {
        try {
          // Fetch resource details directly
          const resourceResponse = await fetch(\`/api/resources/\${resourceId}\`);
          const resourceData = await resourceResponse.json();

          if (!resourceData.success || !resourceData.data) {
            showError();
            return;
          }

          const resource = resourceData.data;

          // Fetch parent dataset details
          const datasetResponse = await fetch(\`/api/datasets/\${resource.dataset_id}\`);
          const datasetData = await datasetResponse.json();

          if (!datasetData.success || !datasetData.data) {
            showError();
            return;
          }

          const dataset = datasetData.data;

          renderResource(resource, dataset);
        } catch (error) {
          console.error('Failed to load resource:', error);
          showError();
        }
      }

      function renderResource(resource, dataset) {
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('content').classList.remove('hidden');

        document.getElementById('resource-name').textContent = resource.name;
        document.getElementById('resource-description').textContent = resource.description || 'No description available';
        document.getElementById('resource-type').textContent = resource.mime_type;
        document.getElementById('resource-size').textContent = formatBytes(resource.size_bytes);
        document.getElementById('download-button').href = resource.download_url;

        const datasetLink = document.getElementById('dataset-link');
        datasetLink.textContent = dataset.name;
        datasetLink.href = \`/datasets/\${dataset.id}\`;
      }

      function showError() {
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('error').classList.remove('hidden');
      }

      document.addEventListener('DOMContentLoaded', loadResource);
    </script>
  `;

  return c.html(Layout({
    title: 'Resource Details - Open Data Portal',
    children: content,
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Datasets', href: '/datasets' },
      { label: 'Dataset', href: `/datasets/${datasetId}` },
      { label: 'Resource Details' },
    ],
  }));
});

export default app;
