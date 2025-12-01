import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Database,
  Download,
  ExternalLink,
  FileText,
  Info,
  Scale,
  Users,
} from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { useDataset } from "../hooks/useDataset.ts"
import { useResources } from "../hooks/useResources.ts"
import {
  formatBytes,
  formatDate,
  getMimeTypeDisplay,
  parseTags,
} from "../lib/utils.ts"

export const DatasetDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const [resourceLimit, setResourceLimit] = useState(10)
  const [resourceOffset, setResourceOffset] = useState(0)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const {
    dataset,
    isLoading: datasetLoading,
    isError: datasetError,
  } = useDataset(id)

  const {
    resources,
    pagination: resourcesPagination,
    isLoading: resourcesLoading,
    isValidating: resourcesValidating,
  } = useResources(id, {
    limit: resourceLimit,
    offset: resourceOffset,
  })

  const goToResourcePage = (page: number) => {
    const newOffset = (page - 1) * resourceLimit
    setResourceOffset(newOffset)
  }

  const currentResourcePage = resourcesPagination
    ? Math.floor(resourcesPagination.offset / resourcesPagination.limit) + 1
    : 1
  const totalResourcePages = resourcesPagination
    ? Math.ceil(resourcesPagination.total / resourcesPagination.limit)
    : 1

  if (datasetLoading) {
    return (
      <div className="container-custom pt-4 pb-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-8"></div>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (datasetError || !dataset) {
    return (
      <div className="container-custom pt-4 pb-8">
        <div className="text-center py-12">
          <div className="w-16 h-16 text-gray-400 mx-auto mb-4">😞</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Dataset Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The dataset you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/datasets"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Browse all datasets →
          </Link>
        </div>
      </div>
    )
  }

  const tags = parseTags(dataset.tags || null)
  const attribution = dataset.attribution || []

  return (
    <div className="container-custom pt-4 pb-8">
      {/* Header */}
      <div className="bg-white border border-neutral-200 rounded-lg shadow-sm p-8 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {dataset.name}
        </h1>
        <p className="text-gray-700 mb-6">
          {dataset.description || "No description available"}
        </p>

        {/* Metadata: Publisher, Category, Tags, License */}
        <div className="flex flex-col gap-2 mb-6">
          {dataset.publisher?.name && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 font-medium">
                Publisher:
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                {dataset.publisher.name}
              </span>
            </div>
          )}

          {dataset.category?.name && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 font-medium">
                Category:
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                {dataset.category.name}
              </span>
            </div>
          )}

          {tags.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 font-medium">Tags:</span>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {dataset.license && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 font-medium">
                License:
              </span>
              {dataset.license_url ? (
                <a
                  href={dataset.license_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
                >
                  <Scale className="w-3 h-3 mr-1" />
                  {dataset.license}
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                  <Scale className="w-3 h-3 mr-1" />
                  {dataset.license}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {resourcesPagination?.total || 0}
                </p>
                <p className="text-sm text-gray-600">Resources</p>
              </div>
              <FileText className="w-8 h-8 text-primary-500" />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatBytes(dataset.size_bytes || 0)}
                </p>
                <p className="text-sm text-gray-600">Total Size</p>
              </div>
              <Database className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatDate(dataset.latest_version_date || "")}
                </p>
                <p className="text-sm text-gray-600">Latest Version</p>
              </div>
              <Calendar className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Resources Section */}
      <div className="bg-white border border-neutral-200 rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Resources</h2>

        {/* Results Summary and Items Per Page */}
        <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="text-sm text-neutral-600">
            {resourcesLoading
              ? "Loading resources..."
              : resourcesPagination
                ? resourcesPagination.total === 0
                  ? "No resources found"
                  : `Showing ${resourcesPagination.offset + 1}-${Math.min(
                      resourcesPagination.offset + resourcesPagination.limit,
                      resourcesPagination.total,
                    )} of ${resourcesPagination.total} resources`
                : ""}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-600">Items per page:</span>
            <select
              value={resourceLimit}
              onChange={(e) => {
                setResourceLimit(parseInt(e.target.value, 10))
                setResourceOffset(0)
              }}
              className="px-3 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
          <div className="flex items-start">
            <Info className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700">
              New to these file formats?{" "}
              <Link
                to="/working-with-datasets"
                className="font-medium underline hover:text-blue-800"
              >
                We have guides to help you get started
              </Link>
              .
            </p>
          </div>
        </div>

        <div id="resources-container" className="overflow-x-auto relative">
          {resources.length === 0 && !resourcesLoading ? (
            <p className="text-gray-500 text-center py-8">
              No resources available for this dataset
            </p>
          ) : (
            <>
              {(resourcesValidating || resourcesLoading) &&
                resources.length > 0 && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
                    <div className="flex flex-col items-center gap-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                      <span className="text-sm text-neutral-600 font-medium">
                        Loading resources...
                      </span>
                    </div>
                  </div>
                )}
              <table
                className={`min-w-full divide-y divide-gray-200 transition-opacity duration-200 ${resourcesValidating && !resourcesLoading ? "opacity-50" : "opacity-100"}`}
              >
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Format
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {resources.map((resource) => (
                    <tr key={resource.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          to={`/datasets/${id}/resources/${resource.id}`}
                          className="text-sm font-medium text-primary-600 hover:text-primary-700"
                        >
                          {resource.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className="text-sm text-gray-900"
                          title={resource.mime_type}
                        >
                          {getMimeTypeDisplay(resource.mime_type)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatBytes(resource.size_bytes)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">
                        {resource.description || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex gap-3 justify-end">
                          <a
                            href={resource.download_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-900 transition-colors"
                            title="Download resource"
                          >
                            <Download className="w-5 h-5" />
                          </a>
                          {resource.source_url && (
                            <a
                              href={resource.source_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-600 hover:text-primary-900 transition-colors"
                              title="View source"
                            >
                              <ExternalLink className="w-5 h-5" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>

        {/* Pagination Controls */}
        {resourcesPagination && resourcesPagination.total > 0 && (
          <div className="mt-6">
            {/* Mobile view */}
            <div className="flex sm:hidden flex-col gap-3">
              <div className="flex justify-center">
                <span className="text-sm text-neutral-700">
                  {resourcesPagination.total === 0
                    ? "No pages"
                    : `Page ${currentResourcePage} of ${totalResourcePages.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <button
                  onClick={() => goToResourcePage(currentResourcePage - 1)}
                  disabled={resourcesPagination.offset === 0}
                  className="flex-1 inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 hover:bg-primary-50 hover:text-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  type={"button"}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Prev
                </button>
                <button
                  onClick={() => goToResourcePage(currentResourcePage + 1)}
                  disabled={!resourcesPagination.has_more}
                  className="flex-1 inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 hover:bg-primary-50 hover:text-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  type={"button"}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>

            {/* Desktop view */}
            <div className="hidden sm:flex items-center justify-start gap-3">
              <button
                onClick={() => goToResourcePage(currentResourcePage - 1)}
                disabled={resourcesPagination.offset === 0}
                className="px-4 py-2 border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
                type={"button"}
              >
                Prev
              </button>
              <span className="text-sm text-neutral-600">
                {resourcesPagination.total === 0
                  ? "No pages"
                  : `Page ${currentResourcePage} of ${totalResourcePages.toLocaleString()}`}
              </span>
              <button
                onClick={() => goToResourcePage(currentResourcePage + 1)}
                disabled={!resourcesPagination.has_more}
                className="px-4 py-2 border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
                type={"button"}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Attribution Section */}
      {attribution.length > 0 && (
        <div className="bg-white border border-neutral-200 rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Attribution
          </h2>

          <div className="space-y-2">
            <div className="font-semibold text-sm text-gray-700">
              {attribution.length === 1 ? "Source" : "Sources"} (
              {attribution.length})
            </div>
            {attribution.map((author, _) => (
              <div
                key={author.author}
                className="p-3 bg-gray-50 rounded border border-gray-200"
              >
                <div className="text-sm text-gray-700">
                  <span className="font-semibold">Author:</span> {author.author}
                  {author.source_url && (
                    <>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="font-semibold">Original source:</span>{" "}
                      <a
                        href={author.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline inline-flex items-center gap-1"
                      >
                        {author.source_url}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </>
                  )}
                  {author.license && (
                    <>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="font-semibold">License:</span>{" "}
                      {author.license_url ? (
                        <a
                          href={author.license_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline inline-flex items-center gap-1"
                        >
                          {author.license}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        author.license
                      )}
                    </>
                  )}
                </div>

                {author.attribution_text && (
                  <div className="mt-3 text-sm text-gray-700">
                    {author.attribution_text}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <div className="flex items-start gap-3">
          <Info className="w-6 h-6 text-blue-700 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-blue-900 font-bold text-base mb-2">
              Content Notice
            </h3>
            <p className="text-blue-800 text-sm leading-relaxed mb-3">
              This website and all its content are in the public domain and
              operated entirely by volunteers. All information, data, documents,
              and materials provided on this website are in the public domain
              unless otherwise noted. Public domain content may be freely used,
              copied, distributed, and modified without permission or
              attribution, though attribution is appreciated.
            </p>
            <p className="text-blue-800 text-sm leading-relaxed mb-3">
              As a volunteer-operated resource, we encourage users to conduct
              their own independent research and verification of information.
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
  )
}
