import type { ApiResponse } from '~/types'

export function useApi<T>(url: string) {
  return useFetch<ApiResponse<T>>(url, {
    key: url,
  })
}
