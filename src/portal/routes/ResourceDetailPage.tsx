import { AlertCircle, Download, ExternalLink, Info } from "lucide-react"
import { Link, useParams } from "react-router-dom"
import { useDataset } from "../hooks/useDataset.ts"
import { useResource } from "../hooks/useResource.ts"
import { formatBytes, getMimeTypeDisplay } from "../lib/utils.ts"

export const ResourceDetailPage = () => {
  const { resourceId } = useParams<{
    resourceId: string
  }>()

  const {
    resource,
    isLoading: resourceLoading,
    isError: resourceError,
  } = useResource(resourceId)

  // Fetch parent dataset details (use resource.dataset_id once loaded)
  const { dataset, isLoading: datasetLoading } = useDataset(
    resource?.dataset_id ? String(resource.dataset_id) : undefined,
  )

  if (resourceLoading || datasetLoading) {
    return (
      <div className="container-custom pt-4 pb-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (resourceError || !resource) {
    return (
      <div className="container-custom pt-4 pb-8">
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Resource Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The resource you're looking for doesn't exist.
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

  return (
    <div className="container-custom pt-4 pb-8">
      <div className="bg-white border border-neutral-200 rounded-lg p-8 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {resource.name}
        </h1>

        {dataset && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <div className="flex items-center">
              <Info className="w-5 h-5 text-blue-500 mr-2" />
              <p className="text-sm text-blue-700">
                Part of dataset:{" "}
                <Link
                  to={`/datasets/${dataset.id}`}
                  className="font-medium underline hover:text-blue-800"
                >
                  {dataset.name}
                </Link>
              </p>
            </div>
          </div>
        )}

        <p className="text-gray-700 mb-6">
          {resource.description || "No description available"}
        </p>

        <div className="flex items-center gap-2">
          <span className="text-gray-600 font-medium">Format:</span>
          <span className="inline-flex items-center">
            {getMimeTypeDisplay(resource.mime_type)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-600 font-medium">Total Size:</span>
          <span className="inline-flex items-center">
            {formatBytes(resource.size_bytes)}
          </span>
        </div>

        <div className="flex flex-wrap gap-3 mt-6">
          <a
            href={resource.download_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium"
            title="Download this resource"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Resource
          </a>
          {resource.source_url && (
            <a
              href={resource.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-neutral-100 text-neutral-700 border border-neutral-300 rounded-md hover:bg-neutral-200 transition-colors font-medium"
              title="View the original source"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              View Source
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
