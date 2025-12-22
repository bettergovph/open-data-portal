import { Frown } from "lucide-react"
import { type FormEvent, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { DatasetCard } from "../components/DatasetCard.tsx"
import { LoadingSkeleton } from "../components/LoadingSkeleton.tsx"
import { useCategories } from "../hooks/useCategories.ts"
import { useDatasets } from "../hooks/useDatasets.ts"
import { usePublishers } from "../hooks/usePublishers.ts"

export const DatasetsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [categoryId, setCategoryId] = useState(
    searchParams.get("category_id") || "",
  )
  const [publisherId, setPublisherId] = useState(
    searchParams.get("publisher_id") || "",
  )
  const [sortValue, setSortValue] = useState(
    searchParams.get("sort") || "name_asc",
  )
  const [limit, setLimit] = useState(
    parseInt(searchParams.get("limit") || "10", 10),
  )

  const { categories } = useCategories()
  const { publishers } = usePublishers()

  const urlSearch = searchParams.get("search") || undefined
  const urlCategoryId = searchParams.get("category_id") || undefined
  const urlPublisherId = searchParams.get("publisher_id") || undefined
  const urlSort = searchParams.get("sort") || "name_asc"
  const urlLimit = parseInt(searchParams.get("limit") || "10", 10)
  const urlOffset = parseInt(searchParams.get("offset") || "0", 10)

  const urlSortParts = urlSort.split("_")
  const urlSortField = urlSortParts.slice(0, -1).join("_")

  const { datasets, pagination, isLoading, isError } = useDatasets({
    search: urlSearch,
    category_id: urlCategoryId,
    publisher_id: urlPublisherId,
    sort: urlSortField,
    limit: urlLimit,
    offset: urlOffset,
  })

  const updateURL = (updates: Record<string, string | number>) => {
    const newParams = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== "" && value !== 0) {
        newParams.set(key, String(value))
      } else {
        newParams.delete(key)
      }
    })
    setSearchParams(newParams)
  }

  const handleFilterSubmit = (e: FormEvent) => {
    e.preventDefault()
    updateURL({
      search,
      category_id: categoryId,
      publisher_id: publisherId,
      sort: sortValue,
      limit,
      offset: 0,
    })
  }

  const resetFilters = () => {
    setSearch("")
    setCategoryId("")
    setPublisherId("")
    setSortValue("name_asc")
    setLimit(10)
    setSearchParams({})
  }

  const goToPage = (page: number) => {
    const newOffset = (page - 1) * limit
    updateURL({
      search,
      category_id: categoryId,
      publisher_id: publisherId,
      sort: sortValue,
      limit,
      offset: newOffset,
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const currentPage = pagination
    ? Math.floor(pagination.offset / pagination.limit) + 1
    : 1
  const totalPages = pagination
    ? Math.ceil(pagination.total / pagination.limit)
    : 1

  return (
    <div className="container-custom pt-4 pb-8">
      <h1 className="text-3xl font-bold text-neutral-900 mb-8">
        Browse Datasets
      </h1>

      <div className="bg-white border border-neutral-200 rounded-lg shadow-sm p-6 mb-6">
        <form onSubmit={handleFilterSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-neutral-700 mb-2"
            >
              Search
            </label>
            <input
              type="search"
              id="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, description, or tags..."
              className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="category_id"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
                Category
              </label>
              <select
                id="category_id"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="publisher_id"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
                Publisher
              </label>
              <select
                id="publisher_id"
                value={publisherId}
                onChange={(e) => setPublisherId(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Publishers</option>
                {publishers.map((pub) => (
                  <option key={pub.id} value={pub.id}>
                    {pub.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="sort"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
                Sort By
              </label>
              <select
                id="sort"
                value={sortValue}
                onChange={(e) => setSortValue(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="name_asc">Name (A-Z)</option>
                <option value="name_desc">Name (Z-A)</option>
                <option value="latest_version_date_desc">
                  Recently Updated
                </option>
                <option value="latest_version_date_asc">Oldest First</option>
                <option value="size_bytes_desc">Largest First</option>
                <option value="size_bytes_asc">Smallest First</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
            >
              Search
            </button>
            <button
              type="button"
              onClick={resetFilters}
              className="px-6 py-2 bg-neutral-200 text-neutral-700 rounded-md hover:bg-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-500 transition-colors"
            >
              Reset
            </button>
          </div>
        </form>

        <div className="mt-4 pt-4 border-t border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={!pagination || pagination.offset === 0}
              className="px-4 py-2 border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
              type={"button"}
            >
              Prev
            </button>
            <span className="text-sm text-neutral-600">
              {pagination
                ? pagination.total === 0
                  ? "No pages"
                  : `Page ${currentPage} of ${totalPages.toLocaleString()}`
                : "Loading..."}
            </span>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={!pagination || !pagination.has_more}
              className="px-4 py-2 border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
              type={"button"}
            >
              Next
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-600">Items per page:</span>
            <select
              value={limit}
              onChange={(e) => {
                const newLimit = parseInt(e.target.value, 10)
                setLimit(newLimit)
                const newParams = new URLSearchParams(searchParams)
                newParams.set("limit", String(newLimit))
                newParams.set("offset", "0")
                setSearchParams(newParams)
              }}
              className="px-3 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mb-4 text-sm text-neutral-600">
        {isLoading
          ? "Loading datasets..."
          : pagination
            ? pagination.total === 0
              ? "No results found"
              : `Showing ${pagination.offset + 1}-${Math.min(pagination.offset + pagination.limit, pagination.total)} of ${pagination.total} datasets`
            : ""}
      </div>

      {/* Datasets List */}
      <div className="space-y-4">
        {isLoading ? (
          <LoadingSkeleton variant="dataset-card" count={5} />
        ) : isError ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-700">
              Failed to load datasets. Please try again.
            </p>
          </div>
        ) : datasets.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Frown className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              No datasets found
            </h3>
            <p className="text-neutral-600 mb-4">
              Try adjusting your filters or search terms.
            </p>
            <button
              onClick={resetFilters}
              className="text-primary-600 hover:text-primary-700 font-medium"
              type={"button"}
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {datasets.map((dataset) => (
              <DatasetCard
                key={dataset.id}
                id={dataset.id}
                name={dataset.name}
                description={dataset.description || ""}
                publisher={dataset.publisher?.name || "Unknown Publisher"}
                category={dataset.category?.name || "Unknown Category"}
                resourceCount={dataset.resource_count}
                sizeBytes={dataset.size_bytes}
                latestVersionDate={dataset.latest_version_date || ""}
              />
            ))}
          </div>
        )}
      </div>

      {pagination && pagination.total > 0 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={pagination.offset === 0}
            className="px-4 py-2 border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
            type={"button"}
          >
            Previous
          </button>
          <span className="text-sm text-neutral-600">
            Page {currentPage} of {totalPages.toLocaleString()}
          </span>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={!pagination.has_more}
            className="px-4 py-2 border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
            type={"button"}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
