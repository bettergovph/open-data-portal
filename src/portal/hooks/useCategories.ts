import useSWR from "swr"
import type { CategoryListItem } from "../../../shared/types.ts"

interface CategoriesResponse {
  success: boolean
  data: CategoryListItem[]
}

export const useCategories = () => {
  const { data, error, isLoading, mutate } = useSWR<CategoriesResponse>("/categories")

  return {
    categories: data?.data || [],
    isLoading,
    isError: !!error,
    error,
    mutate,
  }
}
