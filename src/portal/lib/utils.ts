export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Math.round((bytes / k ** i) * 100) / 100} ${sizes[i]}`
}

export const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return "N/A"
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export const parseTags = (tags: string | null): string[] => {
  if (!tags) return []

  try {
    const parsed = JSON.parse(tags)
    if (Array.isArray(parsed)) return parsed
  } catch {
    return tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
  }

  return []
}

export const getMimeTypeDisplay = (mimeType: string): string => {
  const map: Record<string, string> = {
    "application/zip": "ZIP",
    "application/json": "JSON",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "Excel (XLSX)",
    "application/vnd.apache.parquet": "Parquet",
    "application/pdf": "PDF",
    "text/csv": "CSV",
  }
  return map[mimeType] || mimeType.split("/").pop()?.toUpperCase() || mimeType
}
