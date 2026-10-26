import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Link, Outlet, useLocation } from "react-router"

const navLinks = [
  { href: "/datasets", label: "Datasets", path: "/datasets" },
  { href: "/categories", label: "Categories", path: "/categories" },
  { href: "/about", label: "About", path: "/about" },
  { href: "/contribute", label: "Contribute", path: "/contribute" },
  { href: "/mcp", label: "MCP", path: "/mcp" },
  { href: "/docs", label: "API", path: "/docs", external: true },
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

type FooterLink =
  | { label: string; to: string }
  | { label: string; href: string }

const footerColumns: { title: string; links: FooterLink[] }[] = [
  {
    title: "Data",
    links: [
      { to: "/datasets", label: "Browse datasets" },
      { to: "/categories", label: "Browse categories" },
      { to: "/working-with-datasets", label: "Working with datasets" },
      { href: "/docs", label: "API reference" },
      { to: "/mcp", label: "Connect an AI client" },
    ],
  },
  {
    title: "Project",
    links: [
      { to: "/about", label: "About the portal" },
      { to: "/contribute", label: "Contribute a dataset" },
      {
        href: "https://github.com/bettergovph/open-data-portal",
        label: "Source code on GitHub",
      },
      { to: "/terms-of-service", label: "Terms of service" },
    ],
  },
  {
    title: "Community",
    links: [
      { href: "https://discord.gg/bettergovph", label: "Discord" },
      { href: "https://www.facebook.com/bettergovph", label: "Facebook" },
      { href: "https://bettergov.ph/join-us", label: "Join BetterGov.ph" },
    ],
  },
]

const footerLinkClass =
  "text-sm font-semibold text-ink border-b border-primary-600 pb-px hover:text-primary-600 transition-colors"

export const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [projectsOpen, setProjectsOpen] = useState(false)
  const projectsRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  // Close menus when the page changes.
  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname is the trigger
  useEffect(() => {
    setMobileMenuOpen(false)
    setProjectsOpen(false)
  }, [location.pathname])

  // Close the projects dropdown on outside click or Escape.
  useEffect(() => {
    if (!projectsOpen) return
    const onPointerDown = (e: PointerEvent) => {
      if (!projectsRef.current?.contains(e.target as Node)) {
        setProjectsOpen(false)
      }
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setProjectsOpen(false)
    }
    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [projectsOpen])

  const isActive = (path: string) => location.pathname.startsWith(path)

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:bg-ink focus:text-white focus:px-4 focus:py-2 focus:rounded-sm"
      >
        Skip to content
      </a>

      {/* Masthead: utility row, logo row, primary nav, one ink rule */}
      <header className="bg-white sticky top-0 z-50 border-b-[1.5px] border-ink">
        <div className="container-custom">
          <div className="hidden md:flex items-center justify-between gap-6 py-2.5 font-display text-xs text-neutral-600">
            <span>A community run portal for exploring public datasets</span>
            <div className="flex items-center gap-5">
              <a
                href="/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-neutral-700 hover:text-primary-600 transition-colors"
              >
                API
              </a>
              <Link
                to="/mcp"
                className="font-semibold text-neutral-700 hover:text-primary-600 transition-colors"
              >
                MCP
              </Link>
              <a
                href="https://github.com/bettergovph/open-data-portal"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-neutral-700 hover:text-primary-600 transition-colors"
              >
                GitHub
              </a>
              <div className="relative" ref={projectsRef}>
                <button
                  type="button"
                  onClick={() => setProjectsOpen(!projectsOpen)}
                  className="inline-flex items-center gap-1 font-semibold text-neutral-700 hover:text-primary-600 transition-colors"
                  aria-haspopup="true"
                  aria-expanded={projectsOpen}
                >
                  Our projects
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${projectsOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {projectsOpen && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-ink rounded-sm py-1 z-50">
                    {projectLinks.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-4 py-2 text-sm font-sans font-normal text-neutral-700 hover:bg-paper-2 hover:text-primary-600 transition-colors"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 py-3 md:pt-3 md:pb-3.5">
            <Link to="/" className="inline-flex items-center gap-4 min-w-0">
              <img
                src="/BetterGov_Icon-Primary.svg"
                alt="BetterGov.ph"
                className="h-9 md:h-10 w-auto shrink-0"
              />
              <span className="font-display font-bold text-base md:text-lg text-ink tracking-tight truncate">
                Open Data Portal{" "}
                <span className="text-xs md:text-sm font-normal text-neutral-500">
                  by BetterGov.ph
                </span>
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden ml-auto p-2 -mr-2 rounded-sm hover:bg-neutral-50 transition-colors"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-ink" />
              ) : (
                <Menu className="w-6 h-6 text-ink" />
              )}
            </button>
          </div>

          <nav
            className="hidden md:flex items-stretch -ml-[18px]"
            aria-label="Primary"
          >
            {navLinks.map((link) =>
              link.external ? (
                <a
                  key={link.path}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-[18px] py-3 font-display text-base font-semibold border-r border-rule-soft text-neutral-700 hover:text-primary-600 transition-colors"
                >
                  {link.label}
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              ) : (
                <Link
                  key={link.path}
                  to={link.href}
                  aria-current={isActive(link.path) ? "page" : undefined}
                  className={`px-[18px] py-3 font-display text-base font-semibold border-r border-rule-soft transition-colors ${
                    isActive(link.path)
                      ? "bg-paper-2 text-primary-600"
                      : "text-neutral-700 hover:text-primary-600"
                  }`}
                >
                  {link.label}
                </Link>
              ),
            )}
          </nav>
        </div>

        {mobileMenuOpen && (
          <nav
            id="mobile-menu"
            aria-label="Primary"
            className="md:hidden border-t border-rule bg-white"
          >
            <div className="container-custom py-2">
              {navLinks.map((link) =>
                link.external ? (
                  <a
                    key={link.path}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 py-3 font-display text-base font-semibold text-ink border-b border-rule-soft"
                  >
                    {link.label}
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                ) : (
                  <Link
                    key={link.path}
                    to={link.href}
                    aria-current={isActive(link.path) ? "page" : undefined}
                    className={`block py-3 font-display text-base font-semibold border-b border-rule-soft ${
                      isActive(link.path) ? "text-primary-600" : "text-ink"
                    }`}
                  >
                    {link.label}
                  </Link>
                ),
              )}
              <p className="pt-4 pb-1 text-xs font-semibold text-neutral-600">
                Our projects
              </p>
              {projectLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block py-2 text-sm text-neutral-700 hover:text-primary-600"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </nav>
        )}
      </header>

      <main id="main" className="min-h-screen pb-16">
        <Outlet />
      </main>

      <footer className="bg-white border-t-[1.5px] border-ink">
        <div className="container-custom py-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {footerColumns.map((col) => (
              <div key={col.title}>
                <h2 className="font-display text-sm font-bold text-ink mb-3 tracking-normal">
                  {col.title}
                </h2>
                <ul className="flex flex-col items-start gap-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      {"to" in link ? (
                        <Link to={link.to} className={footerLinkClass}>
                          {link.label}
                        </Link>
                      ) : (
                        <a
                          href={link.href}
                          target={
                            link.href.startsWith("/") ? undefined : "_blank"
                          }
                          rel="noopener noreferrer"
                          className={footerLinkClass}
                        >
                          {link.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="mt-8 pt-5 border-t border-rule-soft meta">
            © {new Date().getFullYear()} BetterGov.ph · Built and maintained by
            volunteers
          </p>
        </div>
      </footer>
    </>
  )
}
