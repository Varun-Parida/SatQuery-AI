import type {
  AnalysisRequest,
  AnalysisResponse,
  AnalysisStatusResponse,
  DashboardStats,
  HistoryFilters,
  HistoryResponse,
  UploadResponse,
} from '@/types'
import { generateId } from '@/lib/utils'
import {
  createWorkflowStages,
  mockChangeDetectionResponse,
  mockDashboardStats,
  mockGroundingResponse,
  mockHistoryItems,
  mockOpticalSarResponse,
  mockResponsesById,
  mockVqaResponse,
  MOCK_STAGE_DELAYS,
} from './mockData'

/** Simulate network delay */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Determine which mock response to return based on query content and mode */
function detectMockTask(
  query: string,
  imageCount: number,
  analysisMode?: string
): AnalysisResponse {
  const q = query.toLowerCase()

  if (
    analysisMode === 'optical_sar' ||
    q.includes('sar') ||
    q.includes('radar') ||
    q.includes('multimodal')
  ) {
    const id = generateId()
    const res = { ...mockOpticalSarResponse, id, query }
    mockResponsesById[id] = res
    return res
  }

  if (
    analysisMode === 'before_after' ||
    imageCount >= 2 ||
    q.includes('change') ||
    q.includes('different') ||
    q.includes('between')
  ) {
    const id = generateId()
    const res = { ...mockChangeDetectionResponse, id, query }
    mockResponsesById[id] = res
    return res
  }

  if (
    q.includes('where') ||
    q.includes('highlight') ||
    q.includes('locate') ||
    q.includes('find') ||
    q.includes('show me') ||
    q.includes('grounding')
  ) {
    const id = generateId()
    const res = { ...mockGroundingResponse, id, query }
    mockResponsesById[id] = res
    return res
  }

  const id = generateId()
  const res = { ...mockVqaResponse, id, query }
  mockResponsesById[id] = res
  return res
}

/* ──────────────────────────────────────────────────
   Mock API Service
   Drop-in replacement for real API calls.
   ────────────────────────────────────────────────── */

export const mockApi = {
  async uploadImage(
    _file: File,
    onProgress?: (percentage: number) => void
  ): Promise<UploadResponse> {
    // Simulate upload progress
    for (let pct = 0; pct <= 100; pct += 20) {
      await delay(150)
      onProgress?.(pct)
    }

    return {
      success: true,
      image: {
        id: generateId(),
        filename: _file.name,
        fileSize: _file.size,
        width: 1024,
        height: 1024,
        mimeType: _file.type || 'image/tiff',
        url: URL.createObjectURL(_file),
        thumbnailUrl: URL.createObjectURL(_file),
        uploadedAt: new Date().toISOString(),
      },
    }
  },

  async submitAnalysis(
    request: AnalysisRequest,
    onStageUpdate?: (stageIndex: number) => void
  ): Promise<AnalysisResponse> {
    const stages = createWorkflowStages()
    const response = detectMockTask(request.query, request.imageIds.length, request.analysisMode)

    // Simulate each workflow stage
    for (let i = 0; i < stages.length; i++) {
      onStageUpdate?.(i)
      await delay(MOCK_STAGE_DELAYS[i])
    }
    onStageUpdate?.(stages.length)

    return {
      ...response,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    }
  },

  async getAnalysis(id: string): Promise<AnalysisResponse> {
    await delay(300)
    const response = mockResponsesById[id]
    if (response) return response

    // Return a generic VQA response for unknown IDs
    return { ...mockVqaResponse, id }
  },

  async getAnalysisStatus(id: string): Promise<AnalysisStatusResponse> {
    await delay(200)
    return {
      id,
      status: 'completed',
      currentStage: 'Final Response',
      progress: 100,
      stages: createWorkflowStages().map((s) => ({
        ...s,
        status: 'completed' as const,
      })),
    }
  },

  async getHistory(filters: HistoryFilters): Promise<HistoryResponse> {
    await delay(400)

    let items = [...mockHistoryItems]

    // Apply filters
    if (filters.search) {
      const search = filters.search.toLowerCase()
      items = items.filter((item) => item.query.toLowerCase().includes(search))
    }
    if (filters.task && filters.task !== 'all') {
      items = items.filter((item) => item.task === filters.task)
    }
    if (filters.status && filters.status !== 'all') {
      items = items.filter((item) => item.status === filters.status)
    }

    const total = items.length
    const start = (filters.page - 1) * filters.pageSize
    const paged = items.slice(start, start + filters.pageSize)

    return {
      items: paged,
      total,
      page: filters.page,
      pageSize: filters.pageSize,
      totalPages: Math.ceil(total / filters.pageSize),
    }
  },

  async getDashboardStats(): Promise<DashboardStats> {
    await delay(300)
    return mockDashboardStats
  },

  async getReport(_id: string): Promise<Blob> {
    await delay(500)
    // Return a simple text blob as a mock report
    const content = 'SatQuery AI — Analysis Report (Mock)\n\nThis is a placeholder report.'
    return new Blob([content], { type: 'text/plain' })
  },
}
