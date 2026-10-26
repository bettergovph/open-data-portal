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

/** A dataset as one row of the catalog: who and what on the left, file facts on the right. */
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
      className="group grid gap-x-8 gap-y-3 md:grid-cols-[minmax(0,1fr)_auto] py-5 px-3 -mx-3 border-b border-rule-soft hover:bg-paper-2 transition-colors"
    >
      <div className="min-w-0">
        <h3 className="font-display font-bold text-lg text-ink leading-snug group-hover:text-primary-600 transition-colors">
          {name}
        </h3>
        {description && (
          <p className="mt-1 text-sm text-neutral-600 line-clamp-2 max-w-[75ch]">
            {description}
          </p>
        )}
        <p className="mt-2 text-sm text-neutral-600">
          <span className="font-semibold text-neutral-700">{publisher}</span>
          <span className="mx-2 text-neutral-400" aria-hidden="true">
            /
          </span>
          {category}
        </p>
      </div>

      <dl className="meta flex flex-wrap gap-x-5 gap-y-1 md:flex-col md:items-end md:gap-y-1 md:pt-1">
        {resourceCount !== undefined && (
          <div>
            <dt className="sr-only">Resources</dt>
            <dd>
              {resourceCount} {resourceCount === 1 ? "file" : "files"}
            </dd>
          </div>
        )}
        <div>
          <dt className="sr-only">Size</dt>
          <dd>{formatBytes(sizeBytes)}</dd>
        </div>
        {latestVersionDate && (
          <div>
            <dt className="sr-only">Last updated</dt>
            <dd>Updated {formatDate(latestVersionDate)}</dd>
          </div>
        )}
      </dl>
    </Link>
  )
}
