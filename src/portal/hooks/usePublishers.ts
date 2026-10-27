import useSWR from "swr"
import type { Publisher } from "../../../shared/types.ts"

interface PublishersResponse {
  success: boolean
  data: Publisher[]
}

export const usePublishers = () => {
  const { data, error, isLoading, mutate } = useSWR<PublishersResponse>("/publishers")

  return {
    publishers: data?.data || [],
    isLoading,
    isError: !!error,
    error,
    mutate,
  }
}
