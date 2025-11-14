import { Hono } from 'hono';
import { Layout } from '../components/Layout';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { html } from 'hono/html';

const app = new Hono();

app.get('/', async (c) => {
  const content = html`
    <!-- Hero Section -->
    <div class="bg-primary-700">
      <div class="container-custom py-20 md:py-28 text-center relative z-10">
        <h1 class="text-neutral-50 text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance">Open Data Portal</h1>
        <p class="text-sm md:text-2xl text-white mb-10 max-w-3xl mx-auto text-pretty break-words">Discover, explore, experiment with publicly available datasets</p>
        <div class="max-w-3xl mx-auto">
          <form id="hero-search-form" class="flex flex-col sm:flex-row gap-3">
            <div class="relative flex-1">
              <div class="absolute left-5 top-1/2 transform -translate-y-1/2">
                <i data-lucide="search" class="w-5 h-5 text-neutral-400"></i>
              </div>
              <input
                type="search"
                id="hero-search"
                placeholder="Search datasets by name, description, or tags..."
                class="w-full pl-12 pr-6 py-4 rounded-xl text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-4 focus:ring-primary-300/50 shadow-xl"
              />
            </div>
            <button
              type="submit"
              class="px-8 py-4 bg-white text-primary-700 rounded-xl font-semibold hover:bg-primary-50 transition-all-smooth shadow-xl hover:shadow-2xl hover:scale-105 whitespace-nowrap">
              <span class="flex items-center justify-center">
                <i data-lucide="search" class="w-5 h-5 mr-2"></i>
                Search
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- Statistics Section -->
    <div class="bg-neutral-50 py-12">
      <div class="container-custom">
        <h2 class="text-3xl font-bold text-neutral-900 text-center mb-8">Statistics</h2>
        <div id="stats-container" class="flex flex-wrap justify-center gap-6">
          <!-- Stats will be loaded here -->
          ${LoadingSkeleton({ variant: 'stat-card', count: 4 })}
        </div>
      </div>
    </div>

    <!-- Recently Added Datasets Section -->
    <div class="bg-white py-16">
      <div class="container-custom">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-neutral-900 text-center mb-8">Recently added datasets</h2>
          <p class="text-lg text-neutral-600">Explore the latest datasets added to our portal</p>
        </div>
        <div id="recent-datasets-container" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Recent datasets will be loaded here -->
          ${LoadingSkeleton({ variant: 'dataset-card', count: 6 })}
        </div>
        <div class="text-center mt-8">
          <a href="/datasets" class="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl">
            Browse All Datasets
            <i data-lucide="arrow-right" class="w-5 h-5 ml-2"></i>
          </a>
        </div>
      </div>
    </div>

    <script>
      // Utility functions (shared across client-side code)
      function formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
      }

      function formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
      }

      function formatNumber(num) {
        return num.toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',');
      }

      // Hero search form handler
      document.getElementById('hero-search-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchInput = document.getElementById('hero-search');
        const query = searchInput.value.trim();
        if (query) {
          window.location.href = '/datasets?search=' + encodeURIComponent(query);
        } else {
          window.location.href = '/datasets';
        }
      });

      // Render stat card HTML (matches StatCard component)
      function renderStatCard({ label, value, icon, color = 'primary' }) {
        const colorClasses = {
          primary: 'bg-primary-100 text-primary-600',
          civictech: 'bg-civictech-100 text-civictech-600',
          accent: 'bg-accent-100 text-accent-600',
          neutral: 'bg-neutral-200 text-neutral-600',
        };
        const classes = colorClasses[color] || colorClasses.primary;
        const displayValue = typeof value === 'number' ? formatNumber(value) : value;

        return \`
          <div class="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow group">
            <div class="flex items-center justify-between gap-4">
              <div class="flex-1">
                <p class="text-3xl font-bold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors">\${displayValue}</p>
                <p class="text-sm font-medium text-neutral-600 uppercase tracking-wide">\${label}</p>
              </div>
              \${icon ? \`<div class="\${classes} p-3 rounded-lg"><i data-lucide="\${icon}" class="w-8 h-8"></i></div>\` : ''}
            </div>
          </div>
        \`;
      }

      // Load statistics
      async function loadStats() {
        try {
          const response = await fetch('/api/stats');
          const data = await response.json();

          if (data.success && data.data) {
            const stats = data.data;
            const container = document.getElementById('stats-container');

            const statsHTML = [
              renderStatCard({ label: 'Datasets', value: stats.total_datasets || 0, icon: 'database', color: 'primary' }),
              renderStatCard({ label: 'Resources', value: stats.total_resources || 0, icon: 'file-text', color: 'civictech' }),
              renderStatCard({ label: 'Publishers', value: stats.total_publishers || 0, icon: 'building-2', color: 'accent' }),
              renderStatCard({ label: 'Total Size', value: formatBytes(stats.total_size_bytes || 0), icon: 'hard-drive', color: 'neutral' }),
            ].join('');

            container.innerHTML = statsHTML;

            // Initialize Lucide icons for stats
            if (typeof lucide !== 'undefined') {
              lucide.createIcons();
            }
          }
        } catch (error) {
          console.error('Failed to load stats:', error);
        }
      }

      // Render dataset card HTML (matches DatasetCard component)
      function renderDatasetCard({ id, name, description, publisher, category, resourceCount, sizeBytes, latestVersionDate }) {
        return \`
          <a href="/datasets/\${id}"
             class="block bg-white rounded-lg shadow-sm border border-neutral-200 hover:shadow-md hover:border-primary-500 transition-all p-6 group">
            <div class="flex items-start justify-between mb-3">
              <h3 class="text-lg font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors flex-1">\${name}</h3>
              <i data-lucide="chevron-right" class="w-5 h-5 text-neutral-400 group-hover:text-primary-600 transition-colors ml-2 flex-shrink-0"></i>
            </div>
            \${description ? \`<p class="text-sm text-neutral-600 mb-4 line-clamp-2 leading-relaxed">\${description}</p>\` : ''}
            <div class="flex flex-wrap gap-2 mb-4">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                \${publisher}
              </span>
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                \${category}
              </span>
            </div>
            <div class="flex items-center justify-between text-xs text-neutral-500 pt-4 border-t border-neutral-100">
              <div class="flex items-center space-x-4">
                \${resourceCount ? \`
                  <span class="flex items-center font-medium">
                    <i data-lucide="file-text" class="w-4 h-4 mr-1.5 text-neutral-500"></i>
                    \${resourceCount} resource\${resourceCount !== 1 ? 's' : ''}
                  </span>
                \` : ''}
                <span class="flex items-center font-medium">
                  <i data-lucide="package" class="w-4 h-4 mr-1.5 text-neutral-500"></i>
                  \${formatBytes(sizeBytes)}
                </span>
                <span class="flex items-center font-medium">
                  <i data-lucide="calendar" class="w-4 h-4 mr-1.5 text-neutral-500"></i>
                  \${latestVersionDate ? \`<span class="text-neutral-600">\${formatDate(latestVersionDate)}</span>\` : ''}
                </span>
              </div>
            </div>
          </a>
        \`;
      }

      // Load recent datasets
      async function loadRecentDatasets() {
        try {
          const response = await fetch('/api/datasets?sort=latest_version_date&dir=desc&limit=6');
          const data = await response.json();

          if (data.success && data.data) {
            const datasets = data.data;
            const container = document.getElementById('recent-datasets-container');

            if (datasets.length === 0) {
              container.innerHTML = '<p class="col-span-full text-center text-neutral-500">No datasets available yet</p>';
              return;
            }

            const datasetsHTML = datasets.map(dataset => renderDatasetCard({
              id: dataset.id,
              name: dataset.name,
              description: dataset.description,
              publisher: dataset.publisher?.name || 'Unknown',
              category: dataset.category?.name || 'Unknown',
              resourceCount: dataset.resource_count,
              sizeBytes: dataset.size_bytes,
              latestVersionDate: dataset.latest_version_date
            })).join('');

            container.innerHTML = datasetsHTML;

            // Initialize Lucide icons for dataset cards
            if (typeof lucide !== 'undefined') {
              lucide.createIcons();
            }
          }
        } catch (error) {
          console.error('Failed to load recent datasets:', error);
          const container = document.getElementById('recent-datasets-container');
          container.innerHTML = '<p class="col-span-full text-center text-error-600">Failed to load recent datasets</p>';
        }
      }

      // Load data on page load
      document.addEventListener('DOMContentLoaded', () => {
        loadStats();
        loadRecentDatasets();
      });
    </script>
  `;

  return c.html(Layout({ title: 'Open Data Portal - A community-run portal for exploring public datasets', children: content }));
});

export default app;
