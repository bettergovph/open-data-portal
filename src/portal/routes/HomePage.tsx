import { ArrowRight, Search } from "lucide-react"
import { type FormEvent, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { DatasetCard } from "../components/DatasetCard.tsx"
import { LoadingSkeleton } from "../components/LoadingSkeleton.tsx"
import { StatCard } from "../components/StatCard.tsx"
import { useDatasets } from "../hooks/useDatasets.ts"
import { useStats } from "../hooks/useStats.ts"
import { formatBytes } from "../lib/utils.ts"

export const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()

  const { stats, isLoading: statsLoading } = useStats()

  const { datasets: recentDatasets, isLoading: datasetsLoading } = useDatasets({
    sort: "latest_version_date",
    limit: 10,
  })

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault()
    const query = searchQuery.trim()
    if (query) {
      navigate(`/datasets?search=${encodeURIComponent(query)}`)
    } else {
      navigate("/datasets")
    }
  }

  return (
    <>
      <section>
        <div className="container-custom pt-8 pb-6 md:pt-10 md:pb-8">
          <h1 className="font-display font-bold text-4xl md:text-5xl text-ink max-w-[28ch] text-balance leading-[1.02] tracking-[-0.03em]">
            Public data you can search, download and reuse
          </h1>
          <form
            onSubmit={handleSearchSubmit}
            aria-label="Search datasets"
            className="mt-6 flex max-w-3xl border-[1.5px] border-ink rounded-sm bg-white focus-within:border-primary-600"
          >
            <label htmlFor="home-search" className="sr-only">
              Search datasets
            </label>
            <div className="relative flex-1 min-w-0">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="home-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, description or tag"
                className="w-full h-14 pl-12 pr-4 bg-transparent text-base md:text-lg text-ink placeholder:text-neutral-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-6 md:px-8 bg-primary-600 text-white font-display font-bold hover:bg-primary-700 transition-colors focus-visible:outline-offset-0"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      <section aria-label="Portal totals">
        <div className="container-custom">
          <div className="overflow-hidden">
            <div className="flex flex-wrap -ml-5">
              {statsLoading ? (
                <LoadingSkeleton variant="stat-card" count={4} />
              ) : stats ? (
                <>
                  <StatCard
                    label="Datasets"
                    value={stats.total_datasets || 0}
                  />
                  <StatCard
                    label="Downloadable files"
                    value={stats.total_resources || 0}
                  />
                  <StatCard
                    label="Publishers"
                    value={stats.total_publishers || 0}
                  />
                  <StatCard
                    label="Combined size"
                    value={formatBytes(stats.total_size_bytes || 0)}
                  />
                </>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="container-custom pt-8">
        <div className="flex items-end justify-between gap-4 border-b border-ink pb-3">
          <div>
            <h2 className="text-2xl md:text-3xl">Recently updated</h2>
            <p className="mt-1 text-sm text-neutral-600">
              The newest versions added to the portal
            </p>
          </div>
          <Link
            to="/datasets"
            className="inline-flex items-center gap-1.5 shrink-0 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
          >
            Browse all datasets
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        <div>
          {datasetsLoading ? (
            <LoadingSkeleton variant="dataset-card" count={6} />
          ) : recentDatasets.length === 0 ? (
            <div className="py-12">
              <p className="font-display font-bold text-lg text-ink">
                No datasets yet
              </p>
              <p className="mt-1 text-neutral-600">
                Be the first to share one.{" "}
                <Link
                  to="/contribute"
                  className="font-semibold text-primary-600 hover:text-primary-700"
                >
                  Learn how to contribute
                </Link>
              </p>
            </div>
          ) : (
            recentDatasets
              .slice(0, 8)
              .map((dataset) => (
                <DatasetCard
                  key={dataset.id}
                  id={dataset.id}
                  name={dataset.name}
                  description={dataset.description || ""}
                  publisher={dataset.publisher?.name || "Unknown publisher"}
                  category={dataset.category?.name || "Uncategorized"}
                  resourceCount={dataset.resource_count}
                  sizeBytes={dataset.size_bytes}
                  latestVersionDate={dataset.latest_version_date || ""}
                />
              ))
          )}
        </div>
      </section>

      <section className="container-custom pt-12">
        <div className="bg-paper-2 border border-rule rounded-sm p-6 md:p-8 max-w-4xl">
          <h2 className="text-lg md:text-xl">About this content</h2>
          <p className="mt-2 text-sm text-neutral-700 leading-relaxed">
            This site is run entirely by volunteers. Content is in the public
            domain unless a dataset page says otherwise, so you may copy,
            distribute and modify it without permission. Attribution is
            appreciated.
          </p>
          <p className="mt-2 text-sm text-neutral-700 leading-relaxed">
            Please check figures against the original source before relying on
            them.
          </p>
          <Link
            to="/terms-of-service"
            className="mt-3 inline-block text-sm font-semibold text-primary-600 hover:text-primary-700 border-b border-primary-600"
          >
            Read the terms of service
          </Link>
        </div>
      </section>
    </>
  )
}
