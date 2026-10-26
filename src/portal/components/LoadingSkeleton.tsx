import { statCellClass } from "./StatCard.tsx"

export interface LoadingSkeletonProps {
  variant: "stat-card" | "dataset-card" | "generic" | "resource-row"
  count?: number
}

export const LoadingSkeleton = ({
  variant,
  count = 1,
}: LoadingSkeletonProps) => {
  const skeletons = Array.from({ length: count }, (_, i) => `${variant}-${i}`)

  if (variant === "stat-card") {
    return (
      <>
        {skeletons.map((id) => (
          <div
            key={id}
            className={`${statCellClass} animate-pulse`}
            aria-hidden="true"
          >
            <div className="h-7 bg-neutral-200 rounded-sm w-10"></div>
            <div className="h-4 bg-neutral-200 rounded-sm w-20"></div>
          </div>
        ))}
      </>
    )
  }

  if (variant === "dataset-card") {
    return (
      <>
        {skeletons.map((id) => (
          <div
            key={id}
            className="py-5 border-b border-rule-soft animate-pulse"
            aria-hidden="true"
          >
            <div className="h-6 bg-neutral-200 rounded-sm w-2/5 mb-3"></div>
            <div className="h-4 bg-neutral-200 rounded-sm w-3/4 mb-2"></div>
            <div className="h-4 bg-neutral-200 rounded-sm w-1/4"></div>
          </div>
        ))}
      </>
    )
  }

  if (variant === "resource-row") {
    return (
      <>
        {skeletons.map((id) => (
          <tr key={id} className="animate-pulse">
            <td className="px-3 py-3">
              <div className="h-4 bg-neutral-200 rounded-sm w-48"></div>
            </td>
            <td className="px-3 py-3">
              <div className="h-4 bg-neutral-200 rounded-sm w-20"></div>
            </td>
            <td className="px-3 py-3">
              <div className="h-4 bg-neutral-200 rounded-sm w-16"></div>
            </td>
            <td className="px-3 py-3">
              <div className="h-4 bg-neutral-200 rounded-sm w-24"></div>
            </td>
            <td className="px-3 py-3">
              <div className="h-8 bg-neutral-200 rounded-sm w-20"></div>
            </td>
          </tr>
        ))}
      </>
    )
  }

  return (
    <>
      {skeletons.map((id) => (
        <div
          key={id}
          className="border border-rule rounded-sm p-6 animate-pulse"
          aria-hidden="true"
        >
          <div className="space-y-4">
            <div className="h-6 bg-neutral-200 rounded-sm w-3/4"></div>
            <div className="h-4 bg-neutral-200 rounded-sm w-full"></div>
            <div className="h-4 bg-neutral-200 rounded-sm w-5/6"></div>
          </div>
        </div>
      ))}
    </>
  )
}
