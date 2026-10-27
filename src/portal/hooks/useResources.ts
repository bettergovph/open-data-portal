import useSWR from "swr"
import type { PaginationInfo, Resource } from "../../../shared/types.ts"

interface ResourcesFilters {
  format?: string
  sort?: string
  limit?: number
  offset?: number
}

interface ResourcesResponse {
  success: boolean
  data: Resource[]
  pagination?: PaginationInfo
}

export const useResources = (datasetId: string | undefined, filters: ResourcesFilters = {}) => {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value))
    }
  })

  const key = datasetId ? `/resources?dataset_id=${datasetId}&${params.toString()}` : null
  const { data, error, isLoading, isValidating, mutate } = useSWR<ResourcesResponse>(key, {
    keepPreviousData: true,
  })

  return {
    resources: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    isValidating,
    isError: !!error,
    error,
    mutate,
  }
}
