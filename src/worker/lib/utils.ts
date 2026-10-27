/**
 * Sanitize user input for FTS5 MATCH queries
 * Removes FTS5 special operators to prevent syntax injection
 */
export const sanitizeFTSQuery = (query: string): string => {
  return query
    .replace(/[^\w\s]/g, " ") // Remove special chars (*, ", -, OR, AND, etc)
    .trim()
    .split(/\s+/)
    .filter((term) => term.length > 0)
    .join(" ")
}

export const calculatePagination = (total: number, limit: number, offset: number) => {
  const currentPage = Math.floor(offset / limit) + 1
  const totalPages = Math.ceil(total / limit)
  const hasMore = offset + limit < total

  return {
    total,
    limit,
    offset,
    has_more: hasMore,
    current_page: currentPage,
    total_pages: totalPages,
  }
}
