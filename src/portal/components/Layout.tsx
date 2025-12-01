import { ChevronDown, Menu } from "lucide-react"
import { useState } from "react"
import { Link, Outlet, useLocation } from "react-router"

const navLinks = [
  { href: "/datasets", label: "Datasets", path: "/datasets" },
  { href: "/categories", label: "Categories", path: "/categories" },
  { href: "/about", label: "About", path: "/about" },
  { href: "/contribute", label: "Contribute", path: "/contribute" },
]

const projectLinks = [
  { href: "https://bettergov.ph/join-us", label: "About BetterGov.ph" },
  { href: "https://2026-budget.bettergov.ph", label: "2026 Budget" },
  { href: "https://budget.bettergov.ph", label: "Budget" },
  { href: "https://visualizations.bettergov.ph", label: "Research" },
  { href: "https://bisto.ph", label: "Bisto Proyekto" },
  {
    href: "https://bettergov.ph/flood-control-projects",
    label: "Flood Control Projects",
  },
  { href: "https://saln.bettergov.ph", label: "SALN Tracker" },
]

export const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false)
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false)
  const location = useLocation()

  const isActive = (path: string) => {
    return (
      location.pathname === path ||
      (path !== "/" && location.pathname.startsWith(path))
    )
  }

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3 group">
              <img
                src="/BetterGov_Icon-Primary.svg"
                alt="BetterGov Logo"
                className="w-12 h-12"
              />
              <div>
                <h1 className="text-base font-bold text-neutral-900">
                  Open Data Portal by BetterGov.ph
                </h1>
                <p className="text-xs text-neutral-600">
                  A community-run portal for exploring public datasets
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.href}
                  className={`font-medium transition-colors ${
                    isActive(link.path)
                      ? "text-primary-600 font-semibold"
                      : "text-neutral-700 hover:text-primary-600"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDesktopDropdownOpen(!desktopDropdownOpen)}
                  className="text-neutral-700 hover:text-primary-600 font-medium transition-colors flex items-center space-x-1"
                  aria-haspopup="true"
                  aria-expanded={desktopDropdownOpen}
                >
                  <span>Our Projects</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${desktopDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {desktopDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-neutral-200 rounded-lg shadow-lg py-2 z-50">
                    {projectLinks.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-primary-600 transition-colors"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6 text-neutral-700" />
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-neutral-200">
              <nav className="flex flex-col space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.href}
                    className={`font-medium transition-colors py-2 ${
                      isActive(link.path)
                        ? "text-primary-600 font-semibold"
                        : "text-neutral-700 hover:text-primary-600"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div>
                  <button
                    type="button"
                    onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                    className="text-neutral-700 hover:text-primary-600 font-medium transition-colors py-2 flex items-center justify-between w-full"
                  >
                    <span>Our Projects</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${mobileDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {mobileDropdownOpen && (
                    <div className="flex flex-col space-y-2 pl-4 mt-2">
                      {projectLinks.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neutral-600 hover:text-primary-600 text-sm transition-colors py-1 block"
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow mb-12 min-h-screen">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-400 mt-auto">
        <div className="container-custom py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src="/BetterGov_Icon-White.svg"
                  alt="BetterGov Logo"
                  className="w-12 h-12"
                />
                <div>
                  <h3 className="text-white font-bold text-base">
                    Open Data Portal by BetterGov.ph
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Portal and API for publicly available datasets
                  </p>
                </div>
              </div>
              <p className="text-sm text-neutral-400 mb-4 leading-relaxed">
                This service is provided by BetterGov.ph. A community portal
                providing Philippine citizens, businesses, and visitors with
                information and services.
              </p>
              <div className="flex items-center space-x-3">
                <a
                  href="https://www.facebook.com/bettergovph"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <svg
                    role="img"
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <title>Facebook</title>
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://discord.gg/bettergovph"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-white transition-colors"
                  aria-label="Discord"
                >
                  <svg
                    role="img"
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <title>Discord</title>
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                </a>
              </div>
            </div>
            <div></div>
            <div>
              <h4 className="text-white font-bold mb-4">Links</h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <a
                    href="https://github.com/bettergovph/open-data-portal"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Open Data Portal repository
                  </a>
                </li>
                <li>
                  <a
                    href="/docs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Open Data API Explorer
                  </a>
                </li>
                <li>
                  <Link
                    to="/working-with-datasets"
                    className="hover:text-white transition-colors"
                  >
                    Working with Datasets
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-8 border-t border-neutral-800">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm">
              <p className="text-neutral-400 text-sm">
                {new Date().getFullYear()} BetterGov.ph - All content is public
                domain unless otherwise specified.
              </p>
              <div className="flex items-center gap-4 mt-2 md:mt-0">
                <Link
                  to="/terms-of-service"
                  className="hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
                <a
                  href="https://github.com/bettergovph/open-data-portal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Contribute at GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
