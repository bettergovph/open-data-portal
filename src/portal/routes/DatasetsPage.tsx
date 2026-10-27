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
  const [categoryId, setCategoryId] = useState(searchParams.get("category_id") || "")
  const [publisherId, setPublisherId] = useState(searchParams.get("publisher_id") || "")
  const [sortValue, setSortValue] = useState(searchParams.get("sort") || "name_asc")
  const [limit, setLimit] = useState(parseInt(searchParams.get("limit") || "10", 10))

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

  const currentPage = pagination ? Math.floor(pagination.offset / pagination.limit) + 1 : 1
  const totalPages = pagination ? Math.ceil(pagination.total / pagination.limit) : 1

  const resultSummary = isLoading
    ? "Loading datasets"
    : pagination
      ? pagination.total === 0
        ? "No datasets match these filters"
        : `Showing ${pagination.offset + 1}–${Math.min(pagination.offset + pagination.limit, pagination.total)} of ${pagination.total.toLocaleString()} datasets`
      : ""

  return (
    <div className="container-custom pt-8 md:pt-10">
      <div className="page-head">
        <h1 className="page-title">Browse datasets</h1>
        <p className="page-dek">Search by keyword, then narrow by category or publisher.</p>
      </div>

      <form
        onSubmit={handleFilterSubmit}
        aria-label="Filter datasets"
        className="bg-paper-2 border border-rule rounded-sm p-4 md:p-5"
      >
        <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))]">
          <div>
            <label htmlFor="search" className="field-label">
              Search
            </label>
            <input
              type="search"
              id="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Name, description or tag"
              className="field"
            />
          </div>

          <div>
            <label htmlFor="category_id" className="field-label">
              Category
            </label>
            <select
              id="category_id"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="field"
            >
              <option value="">All categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="publisher_id" className="field-label">
              Publisher
            </label>
            <select
              id="publisher_id"
              value={publisherId}
              onChange={(e) => setPublisherId(e.target.value)}
              className="field"
            >
              <option value="">All publishers</option>
              {publishers.map((pub) => (
                <option key={pub.id} value={pub.id}>
                  {pub.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="sort" className="field-label">
              Sort by
            </label>
            <select id="sort" value={sortValue} onChange={(e) => setSortValue(e.target.value)} className="field">
              <option value="name_asc">Name (A–Z)</option>
              <option value="name_desc">Name (Z–A)</option>
              <option value="latest_version_date_desc">Recently updated</option>
              <option value="latest_version_date_asc">Oldest first</option>
              <option value="size_bytes_desc">Largest first</option>
              <option value="size_bytes_asc">Smallest first</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button type="submit" className="btn-primary">
            Apply filters
          </button>
          <button type="button" onClick={resetFilters} className="btn-secondary">
            Reset
          </button>
        </div>
      </form>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-b border-ink pb-3">
        <output className="text-sm font-semibold text-ink">{resultSummary}</output>
        <div className="flex items-center gap-2">
          <label htmlFor="per-page" className="text-sm text-neutral-600">
            Per page
          </label>
          <select
            id="per-page"
            value={limit}
            onChange={(e) => {
              const newLimit = parseInt(e.target.value, 10)
              setLimit(newLimit)
              const newParams = new URLSearchParams(searchParams)
              newParams.set("limit", String(newLimit))
              newParams.set("offset", "0")
              setSearchParams(newParams)
            }}
            className="field !w-auto !py-1.5"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

      <div>
        {isLoading ? (
          <LoadingSkeleton variant="dataset-card" count={5} />
        ) : isError ? (
          <div className="py-12" role="alert">
            <p className="font-display font-bold text-lg text-negative-700">Datasets didn’t load</p>
            <p className="mt-1 text-neutral-700">
              Check your connection and try again. If it keeps happening, tell us on GitHub.
            </p>
            <button type="button" onClick={() => window.location.reload()} className="btn-secondary mt-4">
              Reload the page
            </button>
          </div>
        ) : datasets.length === 0 ? (
          <div className="py-12">
            <p className="font-display font-bold text-lg text-ink">No datasets found</p>
            <p className="mt-1 text-neutral-600">Try fewer filters or a different keyword.</p>
            <button onClick={resetFilters} className="btn-secondary mt-4" type="button">
              Clear all filters
            </button>
          </div>
        ) : (
          datasets.map((dataset) => (
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

      {pagination && pagination.total > 0 && (
        <nav aria-label="Pagination" className="mt-6 flex items-center justify-between gap-3">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={pagination.offset === 0}
            className="btn-secondary"
            type="button"
          >
            Previous
          </button>
          <span className="meta">
            Page {currentPage} of {totalPages.toLocaleString()}
          </span>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={!pagination.has_more}
            className="btn-secondary"
            type="button"
          >
            Next
          </button>
        </nav>
      )}
    </div>
  )
}
