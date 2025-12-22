import type { LucideIcon } from "lucide-react"
import {
  Activity,
  BarChart,
  Building2,
  Database,
  FileText,
  FolderOpen,
  HardDrive,
  TrendingUp,
  Users,
} from "lucide-react"
import { formatNumber } from "../lib/utils"

const iconMap: Record<string, LucideIcon> = {
  activity: Activity,
  "bar-chart": BarChart,
  "building-2": Building2,
  database: Database,
  "file-text": FileText,
  "folder-open": FolderOpen,
  "hard-drive": HardDrive,
  "trending-up": TrendingUp,
  users: Users,
}

export interface StatCardProps {
  label: string
  value: string | number
  icon?: string // Lucide icon name
  color?: "primary" | "success" | "warning" | "info" | "neutral"
}

const colorClasses = {
  primary: "bg-blue-100 text-blue-600",
  success: "bg-orange-100 text-orange-600",
  warning: "bg-pink-100 text-pink-600",
  info: "bg-blue-100 text-blue-600",
  neutral: "bg-neutral-200 text-neutral-600",
}

export const StatCard = ({
  label,
  value,
  icon,
  color = "primary",
}: StatCardProps) => {
  const displayValue = typeof value === "number" ? formatNumber(value) : value

  const IconComponent = icon ? iconMap[icon] || null : null

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow group min-w-[180px]">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-3xl font-bold text-neutral-900 mb-1 group-hover:text-primary-600 transition-colors">
            {displayValue}
          </p>
          <p className="text-xs font-medium text-neutral-600 uppercase tracking-wide">
            {label}
          </p>
        </div>
        {IconComponent && (
          <div
            className={`${colorClasses[color]} p-4 rounded-xl flex-shrink-0`}
          >
            <IconComponent className="w-7 h-7" />
          </div>
        )}
      </div>
    </div>
  )
}
