import { ArrowRight, Info, Search } from "lucide-react"
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
    limit: 6,
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
      <div className="bg-primary-700">
        <div className="container-custom py-20 md:py-28 text-center relative z-10">
          <h1 className="text-neutral-50 text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance">
            Open Data Portal
          </h1>
          <p className="text-sm md:text-2xl text-white mb-10 max-w-3xl mx-auto text-pretty break-words">
            Discover, explore, experiment with publicly available datasets
          </p>
          <div className="max-w-3xl mx-auto">
            <form
              onSubmit={handleSearchSubmit}
              className="flex flex-col sm:flex-row gap-3"
            >
              <div className="relative flex-1">
                <div className="absolute left-5 top-1/2 transform -translate-y-1/2">
                  <Search className="w-5 h-5 text-neutral-400" />
                </div>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search datasets by name, description, or tags..."
                  className="w-full pl-12 pr-6 py-4 rounded-xl text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-4 focus:ring-primary-300/50 shadow-xl"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-4 bg-white text-primary-700 rounded-xl font-semibold hover:bg-primary-50 transition-all-smooth shadow-xl hover:shadow-2xl hover:scale-105 whitespace-nowrap"
              >
                <span className="flex items-center justify-center">
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="bg-neutral-50 py-12">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-neutral-900 text-center mb-8">
            Statistics
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            {statsLoading ? (
              <LoadingSkeleton variant="stat-card" count={4} />
            ) : stats ? (
              <>
                <StatCard
                  label="Datasets"
                  value={stats.total_datasets || 0}
                  icon="database"
                  color="primary"
                />
                <StatCard
                  label="Resources"
                  value={stats.total_resources || 0}
                  icon="file-text"
                  color="success"
                />
                <StatCard
                  label="Publishers"
                  value={stats.total_publishers || 0}
                  icon="building-2"
                  color="warning"
                />
                <StatCard
                  label="Total Size"
                  value={formatBytes(stats.total_size_bytes || 0)}
                  icon="hard-drive"
                  color="neutral"
                />
              </>
            ) : null}
          </div>
        </div>
      </div>

      <div className="bg-white py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 text-center mb-8">
              Recently added datasets
            </h2>
            <p className="text-lg text-neutral-600">
              Explore the latest datasets added to our portal
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {datasetsLoading ? (
              <LoadingSkeleton variant="dataset-card" count={6} />
            ) : recentDatasets.length === 0 ? (
              <p className="col-span-full text-center text-neutral-500">
                No datasets available yet
              </p>
            ) : (
              recentDatasets.map((dataset) => (
                <DatasetCard
                  key={dataset.id}
                  id={dataset.id}
                  name={dataset.name}
                  description={dataset.description || ""}
                  publisher={dataset.publisher?.name || "Unknown"}
                  category={dataset.category?.name || "Unknown"}
                  resourceCount={dataset.resource_count}
                  sizeBytes={dataset.size_bytes}
                  latestVersionDate={dataset.latest_version_date || ""}
                />
              ))
            )}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/datasets"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Browse All Datasets
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-neutral-50 py-12">
        <div className="container-custom">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <Info className="w-6 h-6 text-blue-700 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-blue-900 font-bold text-base mb-2">
                  Content Notice
                </h3>
                <p className="text-blue-800 text-sm leading-relaxed mb-3">
                  This website and all its content are in the public domain and
                  operated entirely by volunteers. All information, data,
                  documents, and materials provided on this website are in the
                  public domain unless otherwise noted. Public domain content
                  may be freely used, copied, distributed, and modified without
                  permission or attribution, though attribution is appreciated.
                </p>
                <p className="text-blue-800 text-sm leading-relaxed mb-3">
                  As a volunteer-operated resource, we encourage users to
                  conduct their own independent research and verification of
                  information.
                </p>
                <Link
                  to="/terms-of-service"
                  className="text-blue-700 hover:text-blue-900 font-semibold text-sm underline"
                >
                  View Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
