import { Building2, ChevronRight, FileText, HardDrive, Tag } from "lucide-react"
import { Link } from "react-router-dom"
import { formatBytes, formatDate } from "../lib/utils.ts"

export interface DatasetCardProps {
  id: number
  name: string
  description?: string
  publisher: string
  category: string
  resourceCount?: number
  sizeBytes: number
  latestVersionDate?: string
}

export const DatasetCard = ({
  id,
  name,
  description,
  publisher,
  category,
  resourceCount,
  sizeBytes,
  latestVersionDate,
}: DatasetCardProps) => {
  return (
    <Link
      to={`/datasets/${id}`}
      className="bg-white rounded-lg shadow-sm border border-neutral-200 hover:shadow-md hover:border-primary-500 transition-all p-6 group flex flex-col h-full"
    >
      <div className="flex items-start justify-between mb-2 h-7">
        <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors flex-1 truncate pr-2">
          {name}
        </h3>
        <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-primary-600 transition-colors flex-shrink-0" />
      </div>

      <div className="mb-4 h-10">
        <p className="text-sm text-neutral-600 line-clamp-2 leading-5">
          {description || ""}
        </p>
      </div>

      <div className="flex gap-2 mb-4 h-7">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700 truncate max-w-[50%]">
          <Building2 className="w-3 h-3 mr-1 flex-shrink-0" />
          <span className="truncate">{publisher}</span>
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-success-100 text-success-700 truncate max-w-[50%]">
          <Tag className="w-3 h-3 mr-1 flex-shrink-0" />
          <span className="truncate">{category}</span>
        </span>
      </div>

      <div className="flex-grow"></div>

      <div className="flex items-center justify-between text-xs text-neutral-500 pt-4 border-t border-neutral-100 mt-auto">
        <div className="flex items-center space-x-4">
          {resourceCount && (
            <span className="flex items-center font-medium whitespace-nowrap">
              <FileText className="w-4 h-4 mr-1.5 text-primary-500" />
              {resourceCount} resource{resourceCount !== 1 ? "s" : ""}
            </span>
          )}
          <span className="flex items-center font-medium whitespace-nowrap">
            <HardDrive className="w-4 h-4 mr-1.5 text-primary-500" />
            {formatBytes(sizeBytes)}
          </span>
        </div>
        {latestVersionDate && (
          <span className="text-neutral-600 whitespace-nowrap">
            Last updated {formatDate(latestVersionDate)}
          </span>
        )}
      </div>
    </Link>
  )
}
