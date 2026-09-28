/**
 * Adapters between the FastAPI wire contracts and the frontend UI models.
 *
 * Rule: only map information the backend actually returned. Fields the
 * backend does not provide are left undefined (never invented).
 */
import type {
  AnalysisResponse,
  AnalysisTask,
  BackendAnalysisResult,
  BackendBox,
  BackendUploadResponse,
  BoundingBox,
  DetectedObjectCategory,
  ImageInfo,
  UploadResponse,
  VisualizationResult,
} from '@/types'
import { API_BASE_URL } from './client'

/** Context the frontend already knows about a request (the backend does not echo it). */
export interface AnalysisContext {
  query?: string
  images?: ImageInfo[]
}

const TASK_MAP: Record<string, AnalysisTask> = {
  grounding: 'grounding',
  change: 'change_detection',
  vqa: 'vqa',
}

const TASK_ROLE: Record<string, string> = {
  grounding: 'Visual grounding specialist',
  change: 'Change detection specialist',
  vqa: 'Visual question answering',
}

/**
 * Convert a backend evidence path such as `outputs/evidence/change_map_<id>.png`
 * (or `outputs\\evidence\\...` on Windows) into the HTTP URL served by
 * the backend's `/evidence` static route.
 */
export function evidenceUrl(serverPath: string | undefined): string | undefined {
  if (!serverPath) return undefined
  const filename = serverPath.split(/[\\/]/).pop()
  return filename ? `${API_BASE_URL}/evidence/${encodeURIComponent(filename)}` : undefined
}

/** POST /upload response → existing UploadResponse shape used by the UI. */
export function toUploadResponse(raw: BackendUploadResponse, file: File, previewUrl?: string): UploadResponse {
  return {
    success: raw.status === 'uploaded',
    image: {
      id: raw.id,
      filename: raw.filename,
      width: raw.width,
      height: raw.height,
      // From the browser's own File object (the same bytes that were uploaded)
      fileSize: file.size,
      mimeType: file.type,
      // Backend does not serve uploads; display uses the local preview of the uploaded file.
      url: previewUrl ?? URL.createObjectURL(file),
      uploadedAt: new Date().toISOString(),
      metadata: { serverPath: raw.path },
    },
  }
}

function toBoxes(boxes: BackendBox[] | undefined, label: string, color: string): BoundingBox[] {
  return (boxes ?? []).map((box, i) => ({
    id: `${label.toLowerCase().replace(/\W+/g, '-')}-${i}`,
    label,
    x: box.x,
    y: box.y,
    width: box.width,
    height: box.height,
    color,
  }))
}

/** POST /analyze or GET /result/{id} response → existing AnalysisResponse UI model. */
export function toAnalysisResponse(raw: BackendAnalysisResult, ctx: AnalysisContext = {}): AnalysisResponse {
  const images = ctx.images ?? []
  const evidence = raw.evidence ?? {}

  let visualization: VisualizationResult | undefined
  let detectedObjects: DetectedObjectCategory[] = []

  if (raw.task === 'grounding') {
    const boxes = toBoxes(evidence.boxes, 'Water-like region', '#2563eb')
    visualization = { type: 'bounding_boxes', imageUrl: images[0]?.url, boundingBoxes: boxes }
    if (boxes.length) detectedObjects = [{ category: 'Water-like region', count: boxes.length, color: '#2563eb' }]
  } else if (raw.task === 'change') {
    const regions = toBoxes(evidence.change_regions, 'Changed region', '#ef4444')
    const changeMapUrl = evidenceUrl(evidence.change_map)
    visualization = {
      type: 'change_map',
      // Change regions are located on the later (second) image
      imageUrl: images[1]?.url ?? images[0]?.url,
      boundingBoxes: regions,
      changeDetection: changeMapUrl ? { changeMapUrl } : undefined,
    }
    if (regions.length) detectedObjects = [{ category: 'Changed region', count: regions.length, color: '#ef4444' }]
  }

  return {
    id: raw.id,
    source: 'backend',
    query: ctx.query ?? '',
    task: TASK_MAP[raw.task] ?? (raw.task as AnalysisTask),
    status: 'completed',
    answer: raw.answer,
    // UI convention is 0–100; backend reports 0–1
    confidence: Math.round(raw.confidence * 1000) / 10,
    models: raw.model
      ? [{ name: raw.model, displayName: raw.model, role: TASK_ROLE[raw.task] ?? raw.task }]
      : [],
    visualization,
    images,
    executionTrace: {
      stages: (raw.trace ?? []).map((step, i) => ({
        id: `trace-${i}`,
        name: step,
        description: '',
        status: 'completed',
      })),
    },
    reportAvailable: false,
    detectedObjects,
    evidence,
  }
}
