import type {
  AnalysisRequest,
  AnalysisResponse,
  AnalysisStatusResponse,
  BackendAnalysisResult,
  BackendAnalyzeRequest,
  DashboardStats,
} from '@/types'
import apiClient from './client'
import { toAnalysisResponse, type AnalysisContext } from './adapters'

/** POST /analyze — maps frontend `imageIds` to the backend's `image_ids`. */
export async function submitAnalysis(
  request: AnalysisRequest,
  context: AnalysisContext = {}
): Promise<AnalysisResponse> {
  const body: BackendAnalyzeRequest = { image_ids: request.imageIds, query: request.query }
  const { data } = await apiClient.post<BackendAnalysisResult>('/analyze', body)
  return toAnalysisResponse(data, { query: request.query, ...context })
}

/** GET /result/{id} — fetch a stored backend result. */
export async function getAnalysis(id: string, context: AnalysisContext = {}): Promise<AnalysisResponse> {
  const { data } = await apiClient.get<BackendAnalysisResult>(`/result/${encodeURIComponent(id)}`)
  return toAnalysisResponse(data, context)
}

// NOTE: the endpoints below are not implemented by the FastAPI backend yet.
export async function getAnalysisStatus(id: string): Promise<AnalysisStatusResponse> {
  const { data } = await apiClient.get<AnalysisStatusResponse>(`/analysis/${id}/status`)
  return data
}

export async function getReport(id: string): Promise<Blob> {
  const { data } = await apiClient.get(`/reports/${id}`, { responseType: 'blob' })
  return data as Blob
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const { data } = await apiClient.get<DashboardStats>('/dashboard/stats')
  return data
}
