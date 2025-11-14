import { Hono } from 'hono';
import { Layout } from '../components/Layout';
import { StatCard } from '../components/StatCard';
import { CategoryCard } from '../components/CategoryCard';
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
          <div class="bg-primary-100 rounded-lg p-6 min-w-[140px] animate-pulse">
            <div class="h-8 bg-primary-200 rounded w-20 mx-auto mb-2"></div>
            <div class="h-4 bg-primary-200 rounded w-24 mx-auto"></div>
          </div>
          <div class="bg-green-100 rounded-lg p-6 min-w-[140px] animate-pulse">
            <div class="h-8 bg-green-200 rounded w-20 mx-auto mb-2"></div>
            <div class="h-4 bg-green-200 rounded w-24 mx-auto"></div>
          </div>
          <div class="bg-accent-100 rounded-lg p-6 min-w-[140px] animate-pulse">
            <div class="h-8 bg-accent-200 rounded w-20 mx-auto mb-2"></div>
            <div class="h-4 bg-accent-200 rounded w-24 mx-auto"></div>
          </div>
          <div class="bg-neutral-200 rounded-lg p-6 min-w-[140px] animate-pulse">
            <div class="h-8 bg-neutral-300 rounded w-20 mx-auto mb-2"></div>
            <div class="h-4 bg-neutral-300 rounded w-24 mx-auto"></div>
          </div>
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
          <div class="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 animate-pulse">
            <div class="h-6 bg-neutral-200 rounded w-3/4 mb-3"></div>
            <div class="h-4 bg-neutral-200 rounded w-full mb-2"></div>
            <div class="h-4 bg-neutral-200 rounded w-5/6 mb-4"></div>
            <div class="flex gap-2 mb-4">
              <div class="h-6 bg-neutral-200 rounded w-20"></div>
              <div class="h-6 bg-neutral-200 rounded w-24"></div>
            </div>
            <div class="h-4 bg-neutral-200 rounded w-32"></div>
          </div>
          <div class="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 animate-pulse">
            <div class="h-6 bg-neutral-200 rounded w-3/4 mb-3"></div>
            <div class="h-4 bg-neutral-200 rounded w-full mb-2"></div>
            <div class="h-4 bg-neutral-200 rounded w-5/6 mb-4"></div>
            <div class="flex gap-2 mb-4">
              <div class="h-6 bg-neutral-200 rounded w-20"></div>
              <div class="h-6 bg-neutral-200 rounded w-24"></div>
            </div>
            <div class="h-4 bg-neutral-200 rounded w-32"></div>
          </div>
          <div class="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 animate-pulse">
            <div class="h-6 bg-neutral-200 rounded w-3/4 mb-3"></div>
            <div class="h-4 bg-neutral-200 rounded w-full mb-2"></div>
            <div class="h-4 bg-neutral-200 rounded w-5/6 mb-4"></div>
            <div class="flex gap-2 mb-4">
              <div class="h-6 bg-neutral-200 rounded w-20"></div>
              <div class="h-6 bg-neutral-200 rounded w-24"></div>
            </div>
            <div class="h-4 bg-neutral-200 rounded w-32"></div>
          </div>
          <div class="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 animate-pulse">
            <div class="h-6 bg-neutral-200 rounded w-3/4 mb-3"></div>
            <div class="h-4 bg-neutral-200 rounded w-full mb-2"></div>
            <div class="h-4 bg-neutral-200 rounded w-5/6 mb-4"></div>
            <div class="flex gap-2 mb-4">
              <div class="h-6 bg-neutral-200 rounded w-20"></div>
              <div class="h-6 bg-neutral-200 rounded w-24"></div>
            </div>
            <div class="h-4 bg-neutral-200 rounded w-32"></div>
          </div>
          <div class="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 animate-pulse">
            <div class="h-6 bg-neutral-200 rounded w-3/4 mb-3"></div>
            <div class="h-4 bg-neutral-200 rounded w-full mb-2"></div>
            <div class="h-4 bg-neutral-200 rounded w-5/6 mb-4"></div>
            <div class="flex gap-2 mb-4">
              <div class="h-6 bg-neutral-200 rounded w-20"></div>
              <div class="h-6 bg-neutral-200 rounded w-24"></div>
            </div>
            <div class="h-4 bg-neutral-200 rounded w-32"></div>
          </div>
          <div class="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 animate-pulse">
            <div class="h-6 bg-neutral-200 rounded w-3/4 mb-3"></div>
            <div class="h-4 bg-neutral-200 rounded w-full mb-2"></div>
            <div class="h-4 bg-neutral-200 rounded w-5/6 mb-4"></div>
            <div class="flex gap-2 mb-4">
              <div class="h-6 bg-neutral-200 rounded w-20"></div>
              <div class="h-6 bg-neutral-200 rounded w-24"></div>
            </div>
            <div class="h-4 bg-neutral-200 rounded w-32"></div>
          </div>
        </div>
        <div class="text-center mt-8">
          <a href="/datasets" class="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl">
            Browse All Datasets
            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
            </svg>
          </a>
        </div>
      </div>
    </div>

    <script>
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

      // Format file size
      function formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      }

      // Format number with commas
      function formatNumber(num) {
        return num.toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',');
      }

      // Load statistics
      async function loadStats() {
        try {
          const response = await fetch('/api/stats');
          const data = await response.json();

          if (data.success && data.data) {
            const stats = data.data;
            const container = document.getElementById('stats-container');

            container.innerHTML = \`
              <div class="bg-primary-100 rounded-lg p-6 w-[180px] h-[160px] flex flex-col items-center justify-center text-center">
                <i data-lucide="database" class="w-8 h-8 text-primary-700 mb-2"></i>
                <p class="text-3xl font-bold text-primary-700">\${formatNumber(stats.total_datasets || 0)}</p>
                <p class="text-sm text-neutral-600 mt-2">Datasets</p>
              </div>
              <div class="bg-green-100 rounded-lg p-6 w-[180px] h-[160px] flex flex-col items-center justify-center text-center">
                <i data-lucide="file-text" class="w-8 h-8 text-green-700 mb-2"></i>
                <p class="text-3xl font-bold text-green-700">\${formatNumber(stats.total_resources || 0)}</p>
                <p class="text-sm text-neutral-600 mt-2">Resources</p>
              </div>
              <div class="bg-accent-200 rounded-lg p-6 w-[180px] h-[160px] flex flex-col items-center justify-center text-center">
                <i data-lucide="building-2" class="w-8 h-8 text-accent-700 mb-2"></i>
                <p class="text-3xl font-bold text-accent-700">\${formatNumber(stats.total_publishers || 0)}</p>
                <p class="text-sm text-accent-600 mt-2">Publishers</p>
              </div>
              <div class="bg-neutral-200 rounded-lg p-6 w-[180px] h-[160px] flex flex-col items-center justify-center text-center">
                <i data-lucide="hard-drive" class="w-8 h-8 text-neutral-700 mb-2"></i>
                <p class="text-3xl font-bold text-neutral-700">\${formatFileSize(stats.total_size_bytes || 0)}</p>
                <p class="text-sm text-neutral-600 mt-2">Total Size</p>
              </div>
            \`;

            // Initialize Lucide icons for stats
            if (typeof lucide !== 'undefined') {
              lucide.createIcons();
            }
          }
        } catch (error) {
          console.error('Failed to load stats:', error);
        }
      }

      // Format date for display
      function formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
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

            container.innerHTML = datasets.map(dataset => '<a href="/datasets/' + dataset.id + '"' +
                 ' class="block bg-white rounded-lg shadow-sm border border-neutral-200 hover:shadow-md hover:border-primary-500 transition-all p-6 group">' +
                '<h3 class="text-lg font-semibold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors">' +
                  dataset.name +
                '</h3>' +
                '<p class="text-sm text-neutral-600 mb-4 line-clamp-2">' +
                  (dataset.description || 'No description available') +
                '</p>' +
                '<div class="flex flex-wrap gap-2 mb-4">' +
                  '<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">' +
                    (dataset.publisher?.name || 'Unknown Publisher') +
                  '</span>' +
                  '<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">' +
                    (dataset.category?.name || 'Unknown Category') +
                  '</span>' +
                '</div>' +
                '<div class="flex items-center justify-between text-xs text-neutral-500">' +
                  '<span class="flex items-center">' +
                    '<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">' +
                      '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>' +
                    '</svg>' +
                    (dataset.resource_count || 0) + ' resource' + (dataset.resource_count !== 1 ? 's' : '') +
                  '</span>' +
                  (dataset.latest_version_date ? '<span>Published ' + formatDate(dataset.latest_version_date) + '</span>' : '') +
                '</div>' +
              '</a>').join('');
          }
        } catch (error) {
          console.error('Failed to load recent datasets:', error);
          const container = document.getElementById('recent-datasets-container');
          container.innerHTML = '<p class="col-span-full text-center text-accent-600">Failed to load recent datasets</p>';
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
