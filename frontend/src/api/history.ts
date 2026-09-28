import type { HistoryFilters, HistoryResponse } from '@/types'
import apiClient from './client'

export async function getHistory(filters: HistoryFilters): Promise<HistoryResponse> {
  const params: Record<string, string | number> = {
    page: filters.page,
    page_size: filters.pageSize,
  }

  if (filters.search) params.search = filters.search
  if (filters.task && filters.task !== 'all') params.task = filters.task
  if (filters.status && filters.status !== 'all') params.status = filters.status
  if (filters.dateFrom) params.date_from = filters.dateFrom
  if (filters.dateTo) params.date_to = filters.dateTo

  const { data } = await apiClient.get<HistoryResponse>('/analysis/history', { params })
  return data
}
