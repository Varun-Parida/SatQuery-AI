import { useQuery } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { mockApi, getAnalysis, USE_MOCK_API } from '@/api'
import { useAnalysisStore } from '@/store/analysisStore'
import type { AnalysisResponse } from '@/types'

/** Fetch a completed analysis result by ID (real mode: GET /result/{id}) */
export function useAnalysisResult(id: string | undefined) {
  return useQuery<AnalysisResponse>({
    queryKey: ['analysis', USE_MOCK_API ? 'mock' : 'real', id],
    queryFn: () =>
      USE_MOCK_API
        ? mockApi.getAnalysis(id!)
        : getAnalysis(id!, useAnalysisStore.getState().analysisContexts[id!]),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    // Don't retry client errors such as 404 "result was not found"
    retry: (count, error) =>
      !(isAxiosError(error) && error.response && error.response.status < 500) && count < 2,
  })
}

/** Fetch dashboard stats (no backend endpoint exists yet; mock data only) */
export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => mockApi.getDashboardStats(),
    staleTime: 30 * 1000,
  })
}
