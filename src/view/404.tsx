import { Hono } from "hono";
import { PageLayout } from "@/components/Layout.tsx";
import { html } from "hono/html";

export const notFoundRouter = new Hono();

notFoundRouter.notFound((c) => {
  const content = html`
      <div class="container mx-auto px-4 py-16">
          <div class="max-w-2xl mx-auto text-center">
              <!-- 404 Illustration -->
              <div class="mb-8">
                  <svg class="w-64 h-64 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
              </div>

              <!-- Error Message -->
              <h1 class="text-6xl font-bold text-gray-900 mb-4">404</h1>
              <h2 class="text-3xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
              <p class="text-lg text-gray-600 mb-8">
                  The page you're looking for doesn't exist or has been moved.
              </p>

              <!-- Quick Links -->
              <div class="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                  <a
                          href="/public"
                          class="inline-block bg-primary-600 text-white hover:bg-primary-700 font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200"
                  >
                      Go Home
                  </a>
                  <a
                          href="/src/view/congresses"
                          class="inline-block bg-white text-primary-600 hover:bg-gray-50 border-2 border-primary-600 font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                  >
                      Browse Congresses
                  </a>
              </div>

              <!-- Helpful Links -->
              <div class="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 class="text-lg font-semibold text-gray-900 mb-4">Helpful Links</h3>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                      <a href="/src/view/documents" class="text-primary-600 hover:text-primary-700 transition-colors">
                          → Legislative Documents
                      </a>
                      <a href="/src/view/people" class="text-primary-600 hover:text-primary-700 transition-colors">
                          → Senators & Representatives
                      </a>
                      <a href="/api/scalar" class="text-primary-600 hover:text-primary-700 transition-colors">
                          → API Documentation
                      </a>
                      <a href="/api/stats" class="text-primary-600 hover:text-primary-700 transition-colors">
                          → Database Statistics
                      </a>
                  </div>
              </div>
          </div>
      </div>
  `;

  return c.html(PageLayout({ title: "404 Not Found - Open Congress API", children: content }));
});
