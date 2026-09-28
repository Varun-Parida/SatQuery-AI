import { useQuery } from '@tanstack/react-query'
import { mockApi } from '@/api'
import type { HistoryFilters } from '@/types'

/** Fetch paginated analysis history with filters */
export function useHistory(filters: HistoryFilters) {
  return useQuery({
    queryKey: ['history', filters],
    queryFn: () => mockApi.getHistory(filters),
    staleTime: 10 * 1000,
  })
}
