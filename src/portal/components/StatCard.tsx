import { formatNumber } from "../lib/utils"

export interface StatCardProps {
  label: string
  value: string | number
}

// Cells wrap with the row. Each carries its own left rule and the row is
// shifted left by one cell's padding, so the rule on the first cell of every
// row falls outside the clipped container.
export const statCellClass =
  "flex items-baseline gap-2.5 pl-[19px] pr-5 py-3 border-l border-neutral-300"

/** One figure in a ruled strip. */
export const StatCard = ({ label, value }: StatCardProps) => {
  const displayValue = typeof value === "number" ? formatNumber(value) : value

  return (
    <div className={statCellClass}>
      <p className="font-display font-bold text-4xl md:text-5xl text-ink leading-none tracking-tight">
        {displayValue}
      </p>
      <p className="text-base text-neutral-600">{label}</p>
    </div>
  )
}
