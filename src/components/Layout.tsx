/** biome-ignore-all lint/suspicious/noExplicitAny: usages of any is acceptable here */
import { html } from "hono/html";

interface LayoutProps {
  title?: string;
  children: any;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export function Layout({
  title = "Open Data Portal",
  children,
  breadcrumbs,
}: LayoutProps) {
  return html`<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <meta name="description" content="A community-run portal for exploring public datasets">
      <link rel="preload" href="/BetterGov_Icon-Primary.svg" as="image">
      <link rel="preload" href="/BetterGov_Icon-White.svg" as="image">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600;700;800&display=swap"
            rel="stylesheet">
      <link rel="stylesheet" href="/styles.css">
      <script src="https://unpkg.com/lucide@latest"></script>
      <script src="/utils.js"></script>
  </head>
  <body class="bg-neutral-50 min-h-screen flex flex-col">
  <!-- Header -->
  <header class="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div class="container-custom py-4">
          <div class="flex items-center justify-between">
              <a href="/" class="flex items-center space-x-3 group">
                  <img src="/BetterGov_Icon-Primary.svg" alt="BetterGov Logo" class="w-12 h-12"/>
                  <div>
                      <h1 class="text-base font-bold text-neutral-900">Open Data Portal by BetterGov.ph</h1>
                      <p class="text-xs text-neutral-600">A community-run portal for exploring public datasets</p>
                  </div>
              </a>

              <!-- Desktop Navigation -->
              <nav class="hidden md:flex items-center space-x-8">
                  <a href="/datasets" class="text-neutral-700 hover:text-primary-600 font-medium transition-colors nav-link" data-path="/datasets">Datasets</a>
                  <a href="/categories" class="text-neutral-700 hover:text-primary-600 font-medium transition-colors nav-link" data-path="/categories">Categories</a>
                  <a href="/about" class="text-neutral-700 hover:text-primary-600 font-medium transition-colors nav-link" data-path="/about">About</a>
                  <a href="/contribute" class="text-neutral-700 hover:text-primary-600 font-medium transition-colors nav-link" data-path="/contribute">Contribute</a>
              </nav>

              <!-- Mobile Menu Button -->
              <button id="mobile-menu-btn" class="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors" aria-label="Toggle menu">
                  <i data-lucide="menu" class="w-6 h-6 text-neutral-700"></i>
              </button>
          </div>

          <!-- Mobile Navigation Menu -->
          <div id="mobile-menu" class="hidden md:hidden mt-4 pt-4 border-t border-neutral-200">
              <nav class="flex flex-col space-y-3">
                  <a href="/datasets" class="text-neutral-700 hover:text-primary-600 font-medium transition-colors py-2 nav-link" data-path="/datasets">Datasets</a>
                  <a href="/categories" class="text-neutral-700 hover:text-primary-600 font-medium transition-colors py-2 nav-link" data-path="/categories">Categories</a>
                  <a href="/about" class="text-neutral-700 hover:text-primary-600 font-medium transition-colors py-2 nav-link" data-path="/about">About</a>
                  <a href="/contribute" class="text-neutral-700 hover:text-primary-600 font-medium transition-colors py-2 nav-link" data-path="/contribute">Contribute</a>
              </nav>
          </div>
      </div>
  </header>

  ${
    breadcrumbs && breadcrumbs.length > 0
      ? html`
      <!-- Breadcrumbs -->
      <div>
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-0">
              <nav class="flex items-center space-x-2 text-sm">
                  ${breadcrumbs.map((crumb, index) => {
                    const isLast = index === breadcrumbs.length - 1;
                    if (isLast) {
                      return html`<span class="text-neutral-600 font-medium">${crumb.label}</span>`;
                    }
                    return html`
                          <a href="${crumb.href}"
                             class="text-primary-600 hover:text-primary-700 font-medium transition-colors">${crumb.label}</a>
                          <i data-lucide="chevron-right" class="w-4 h-4 text-neutral-400"></i>
                      `;
                  })}
              </nav>
          </div>
      </div>
  `
      : ""
  }

  <!-- Main Content -->
  <main class="flex-grow mb-12">
      ${children}
  </main>

  <!-- Footer -->
  <footer class="bg-neutral-900 text-neutral-400 mt-auto">
      <div class="container-custom py-12">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div>
                  <div class="flex items-center space-x-3 mb-4">
                      <img src="/BetterGov_Icon-White.svg" alt="BetterGov Logo" class="w-12 h-12"/>
                      <div>
                          <h3 class="text-white font-bold text-base">Open Data Portal by BetterGov.ph</h3>
                          <p class="text-xs text-neutral-400">Portal and API for publicly available datasets</p>
                      </div>
                  </div>
                  <p class="text-sm text-neutral-400 mb-4 leading-relaxed">This service is provided by BetterGov.ph. A
                      community portal providing Philippine citizens, businesses, and visitors with information and
                      services.</p>
                  <div class="flex items-center space-x-3">
                      <a href="https://www.facebook.com/bettergovph" target="_blank"
                         class="text-neutral-400 hover:text-white transition-colors"
                         aria-label="Facebook">
                          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                      </a>
                      <a href="https://discord.gg/bettergovph" target="_blank"
                         class="text-neutral-400 hover:text-white transition-colors"
                         aria-label="Discord">
                          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                          </svg>
                      </a>
                  </div>
              </div>
              <div></div>
              <div>
                  <h4 class="text-white font-bold mb-4">Links</h4>
                  <ul class="space-y-2.5 text-sm">
                      <li><a href="https://github.com/bettergovph/open-data-portal" target="_blank"
                             class="hover:text-white transition-colors">Open Data Portal repository</a></li>
                      <li><a href="https://data.bettergov.ph/docs" target="_blank"
                             class="hover:text-white transition-colors">Open Data API Explorer</a></li>
                  </ul>
              </div>
          </div>
          <div class="mt-10 pt-8 border-t border-neutral-800">
              <div class="flex flex-col md:flex-row justify-between items-center text-sm">
                  <p class="text-neutral-400 text-sm">${new Date().getFullYear()} BetterGov.ph - All content is public
                      domain unless otherwise specified.</p>
                  <div class="flex items-center gap-4 mt-2 md:mt-0">
                      <a href="/terms-of-service" class="hover:text-white transition-colors">Terms of Service</a>
                      <a href="https://github.com/bettergovph/open-data-portal"
                         class="hover:text-white transition-colors">Contribute at GitHub</a>
                  </div>
              </div>
          </div>
      </div>
  </footer>

  <script>
      // Mobile menu toggle
      const mobileMenuBtn = document.getElementById('mobile-menu-btn');
      const mobileMenu = document.getElementById('mobile-menu');
      if (mobileMenuBtn && mobileMenu) {
          mobileMenuBtn.addEventListener('click', () => {
              mobileMenu.classList.toggle('hidden');
          });
      }

      // Highlight active navigation link
      const currentPath = window.location.pathname;
      const navLinks = document.querySelectorAll('.nav-link');
      navLinks.forEach(link => {
          const linkPath = link.getAttribute('data-path');
          if (linkPath === currentPath || (linkPath !== '/' && currentPath.startsWith(linkPath))) {
              link.classList.remove('text-neutral-700');
              link.classList.add('text-primary-600', 'font-semibold');
          }
      });

      // Initialize Lucide icons
      if (typeof lucide !== 'undefined') {
          lucide.createIcons();
      }
  </script>
  </body>
  </html>`;
}
