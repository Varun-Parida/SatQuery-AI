/* ============================
   SatQuery AI — Type System
   ============================ */

// ── Task & Model Types ─────────────────────────────────

export type AnalysisTask = 'vqa' | 'captioning' | 'grounding' | 'change_detection' | 'optical_sar'

export type AnalysisMode = 'single' | 'optical_sar' | 'before_after'

export type ModelName = 'geochat' | 'grounding_dino' | 'changeformer'

export type AnalysisStatusType = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'

export type WorkflowStageStatus = 'pending' | 'running' | 'completed' | 'error' | 'skipped'

export type VisualizationMode = 'side_by_side' | 'overlay' | 'slider' | 'change_map' | 'single'

// ── Image Types ────────────────────────────────────────

export interface ImageInfo {
  id: string
  filename: string
  fileSize: number
  width: number
  height: number
  mimeType: string
  url: string
  thumbnailUrl?: string
  uploadedAt: string
  modality?: 'Optical' | 'SAR' | 'Multispectral'
  metadata?: Record<string, unknown>
}

export interface UploadResponse {
  success: boolean
  image: ImageInfo
  message?: string
}

export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

// ── Bounding Box & Mask Types ──────────────────────────

export interface BoundingBox {
  id: string
  label: string
  /** Per-box confidence; omitted when the backend does not report one */
  confidence?: number
  x: number
  y: number
  width: number
  height: number
  color?: string
}

export interface Mask {
  id: string
  label: string
  confidence: number
  maskUrl: string
  color?: string
}

export interface GeoJsonFeature {
  type: 'Feature'
  geometry: {
    type: 'Point' | 'Polygon' | 'LineString' | 'MultiPolygon'
    coordinates: number[] | number[][] | number[][][] | number[][][][]
  }
  properties: Record<string, unknown>
}

export interface GeoJsonData {
  type: 'FeatureCollection'
  features: GeoJsonFeature[]
}

// ── Workflow Types ─────────────────────────────────────

export interface WorkflowStage {
  id: string
  name: string
  description: string
  status: WorkflowStageStatus
  startedAt?: string
  completedAt?: string
  durationMs?: number
  error?: string
  details?: Record<string, string | number | boolean | string[]>
  metadata?: Record<string, unknown>
}

export interface ExecutionTrace {
  stages: WorkflowStage[]
  /** Omitted when the backend does not report timing */
  totalDurationMs?: number
  startedAt?: string
  completedAt?: string
}

// ── Model Types ────────────────────────────────────────

export interface ModelInfo {
  name: ModelName | string
  displayName: string
  role: string
  version?: string
  executionTimeMs?: number
  confidence?: number
}

// ── Analysis Types ─────────────────────────────────────

export interface AnalysisRequest {
  imageIds: string[]
  query: string
  taskHint?: AnalysisTask
  analysisMode?: AnalysisMode
}

export interface ChangeDetectionResult {
  changeMapUrl: string
  changedAreaPercentage?: number
  changeCategories?: Array<{
    category: string
    percentage: number
    color: string
  }>
}

export interface DetectedObjectCategory {
  category: string
  count: number
  color: string
}

export interface AnalysisMetadata {
  fileFormat: string
  dimensions: string
  modality: string
  resolution: string
  acquisitionDate: string
  crs: string
  coordinates: string
  sensor?: string
}

export interface VisualizationResult {
  type: 'bounding_boxes' | 'mask' | 'change_map' | 'annotated_image'
  imageUrl?: string
  boundingBoxes?: BoundingBox[]
  masks?: Mask[]
  changeDetection?: ChangeDetectionResult
  geoJson?: GeoJsonData
}

export interface AnalysisResponse {
  id: string
  query: string
  task: AnalysisTask
  status: AnalysisStatusType
  answer: string
  confidence: number
  models: ModelInfo[]
  visualization?: VisualizationResult
  images: ImageInfo[]
  executionTrace: ExecutionTrace
  createdAt?: string
  completedAt?: string
  reportAvailable: boolean
  detectedObjects?: DetectedObjectCategory[]
  metadata?: AnalysisMetadata
  /** 'backend' = mapped from a real FastAPI result; absent/'mock' = mock service */
  source?: 'backend' | 'mock'
  /** Raw backend evidence object, kept verbatim for display/debugging */
  evidence?: Record<string, unknown>
}

// ── FastAPI Backend Wire Contracts ─────────────────────
// These mirror backend/app/schemas/*.py exactly. Adapters in
// src/api/adapters.ts map them into the richer UI models above.

/** POST /upload → backend/app/schemas/uploads.py::UploadResponse */
export interface BackendUploadResponse {
  id: string
  filename: string
  path: string
  width: number
  height: number
  status: string
}

/** POST /analyze body → backend/app/schemas/queries.py::AnalyzeRequest */
export interface BackendAnalyzeRequest {
  image_ids: string[]
  query: string
}

export interface BackendBox {
  x: number
  y: number
  width: number
  height: number
}

/** POST /analyze, GET /result/{id} → backend/app/schemas/results.py::AnalysisResult */
export interface BackendAnalysisResult {
  id: string
  task: 'grounding' | 'change' | 'vqa' | string
  answer: string
  confidence: number
  evidence: {
    boxes?: BackendBox[]
    change_regions?: BackendBox[]
    change_map?: string
    [key: string]: unknown
  }
  model: string
  trace: string[]
}

export interface AnalysisStatusResponse {
  id: string
  status: AnalysisStatusType
  currentStage?: string
  progress: number
  stages: WorkflowStage[]
}

// ── History Types ──────────────────────────────────────

export interface HistoryItem {
  id: string
  query: string
  task: AnalysisTask
  status: AnalysisStatusType
  confidence: number
  thumbnailUrl?: string
  createdAt: string
  completedAt?: string
  executionTimeMs: number
  modelNames: string[]
}

export interface HistoryFilters {
  search?: string
  task?: AnalysisTask | 'all'
  status?: AnalysisStatusType | 'all'
  dateFrom?: string
  dateTo?: string
  page: number
  pageSize: number
}

export interface HistoryResponse {
  items: HistoryItem[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// ── Dashboard Types ────────────────────────────────────

export interface DashboardStats {
  totalAnalyses: number
  successfulAnalyses: number
  averageExecutionTimeMs: number
  availableModels: number
  recentAnalyses: HistoryItem[]
}

// ── Error Types ────────────────────────────────────────

export interface ApiError {
  status: number
  code: string
  message: string
  details?: Record<string, unknown>
}

// ── UI State Types ─────────────────────────────────────

export interface UploadedImage {
  file: File
  preview: string
  info: Partial<ImageInfo>
  uploadProgress?: UploadProgress
  uploadedId?: string
  error?: string
}

export interface AnalysisWorkspaceState {
  images: UploadedImage[]
  query: string
  isAnalyzing: boolean
  currentAnalysisId?: string
  workflowStages: WorkflowStage[]
  visualizationMode: VisualizationMode
}

// ── Utility Types ──────────────────────────────────────

export type TaskDisplayInfo = {
  [K in AnalysisTask]: {
    label: string
    description: string
    icon: string
    color: string
  }
}

export type StatusDisplayInfo = {
  [K in AnalysisStatusType]: {
    label: string
    color: string
    bgColor: string
  }
}
