import type {
  AnalysisResponse,
  DashboardStats,
  HistoryItem,
  ImageInfo,
  WorkflowStage,
} from '@/types'

/* ──────────────────────────────────────────────────
   High-Resolution Satellite Imagery Samples
   Realistic remote-sensing Sentinel-2 and Landsat
   imagery representing river basins, urban settlements,
   and temporal bi-temporal change pairs.
   ────────────────────────────────────────────────── */

// Earth observation / satellite imagery samples
export const SAMPLE_SATELLITE_IMG_1 =
  'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=1400&q=80'
export const SAMPLE_SATELLITE_IMG_2 =
  'https://images.unsplash.com/photo-1508873696983-2df57046475a?auto=format&fit=crop&w=1400&q=80'
export const SAMPLE_SATELLITE_SAR =
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80'
export const SAMPLE_CHANGE_MAP =
  'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1400&q=80'
export const SAMPLE_THUMBNAIL =
  'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=300&q=80'

// ── Mock Images ────────────────────────────────────────

export const mockImage1: ImageInfo = {
  id: 'img-001',
  filename: 'satellite_image.tif',
  fileSize: 5452595, // 5.2 MB
  width: 1024,
  height: 1024,
  mimeType: 'image/tiff',
  url: SAMPLE_SATELLITE_IMG_1,
  thumbnailUrl: SAMPLE_THUMBNAIL,
  uploadedAt: '2026-08-28T10:30:00Z',
  modality: 'Optical',
  metadata: {
    crs: 'EPSG:4326',
    sensor: 'Sentinel-2 MSI',
    resolution: '10m GSD',
    bands: 'B2, B3, B4, B8',
  },
}

export const mockImage2: ImageInfo = {
  id: 'img-002',
  filename: 'satellite_image_t2.tif',
  fileSize: 5821034,
  width: 1024,
  height: 1024,
  mimeType: 'image/tiff',
  url: SAMPLE_SATELLITE_IMG_2,
  thumbnailUrl: SAMPLE_THUMBNAIL,
  uploadedAt: '2026-08-28T10:31:00Z',
  modality: 'Optical',
  metadata: {
    crs: 'EPSG:4326',
    sensor: 'Sentinel-2 MSI',
    resolution: '10m GSD',
    bands: 'B2, B3, B4, B8',
  },
}

export const mockSarImage: ImageInfo = {
  id: 'img-sar-003',
  filename: 'sentinel1_sar_cband.tif',
  fileSize: 6144000,
  width: 1024,
  height: 1024,
  mimeType: 'image/tiff',
  url: SAMPLE_SATELLITE_SAR,
  thumbnailUrl: SAMPLE_THUMBNAIL,
  uploadedAt: '2026-08-28T10:32:00Z',
  modality: 'SAR',
  metadata: {
    crs: 'EPSG:4326',
    sensor: 'Sentinel-1 C-SAR',
    polarization: 'VV + VH',
    resolution: '10m GSD',
  },
}

// ── Real-time Workflow Execution Stages (8 stages) ─────

export function createWorkflowStages(): WorkflowStage[] {
  return [
    {
      id: 'input_validation',
      name: 'Input Validation',
      description: 'Checking file format, metadata, CRS and co-registration',
      status: 'pending',
    },
    {
      id: 'query_understanding',
      name: 'Query Understanding',
      description: 'Analyzing natural-language query intent and semantic entities',
      status: 'pending',
    },
    {
      id: 'task_detection',
      name: 'Task Detection',
      description: 'Determining optimal remote-sensing analysis task',
      status: 'pending',
    },
    {
      id: 'model_selection',
      name: 'Model Selection',
      description: 'Selecting specialized foundation model for imagery',
      status: 'pending',
    },
    {
      id: 'model_processing',
      name: 'Model Processing',
      description: 'Running neural inference, feature extraction and attention layers',
      status: 'pending',
    },
    {
      id: 'result_generation',
      name: 'Result Generation',
      description: 'Synthesizing visual masks, bounding boxes and spatial layers',
      status: 'pending',
    },
    {
      id: 'result_fusion',
      name: 'Result Fusion',
      description: 'Combining vision-language explanation with spatial evidence',
      status: 'pending',
    },
    {
      id: 'complete',
      name: 'Complete',
      description: 'Preparing final audit trace and interactive analysis dashboard',
      status: 'pending',
    },
  ]
}

// ── Auditable Execution Trace (Matching Panel 4 of Reference) ─

export function createExecutionTrace(task: string): WorkflowStage[] {
  const isVqa = task === 'vqa'
  const isGrounding = task === 'grounding'
  const isChange = task === 'change_detection'
  const isOpticalSar = task === 'optical_sar'

  const taskTitle = isVqa
    ? 'Single-image VQA'
    : isGrounding
    ? 'Visual Grounding'
    : isChange
    ? 'Bi-Temporal Change Detection'
    : 'Optical + SAR Joint Analysis'

  const modelTitle = isVqa
    ? 'Remote-Sensing VLM (GeoChat Fine-tuned)'
    : isGrounding
    ? 'Grounding DINO (Remote-Sensing Adapted)'
    : isChange
    ? 'ChangeFormer + GeoChat Explainer'
    : 'Multimodal VLM + SAR Feature Fusion'

  return [
    {
      id: 'trace_validation',
      name: 'Input Validation',
      description: 'Raster format, dimensions and CRS compatibility verified',
      status: 'completed',
      durationMs: 380,
      details: {
        'File format': 'GeoTIFF (valid)',
        'Image readable': 'Yes',
        'Modality': isOpticalSar ? 'Optical + SAR (dual input)' : isChange ? 'Optical (temporal pair)' : 'Optical (multispectral)',
        'Dimensions': '1024 × 1024',
        'Geospatial metadata': 'Found',
        'CRS': 'EPSG:4326',
      },
    },
    {
      id: 'trace_detection',
      name: 'Task Detection',
      description: 'Intent resolved to specialized pipeline and AI architecture',
      status: 'completed',
      durationMs: 640,
      details: {
        'Detected task': taskTitle,
        'Selected model': modelTitle,
      },
    },
    {
      id: 'trace_processing',
      name: 'Model Processing',
      description: 'Preprocessing, GPU tensor inference and feature projection',
      status: 'completed',
      durationMs: 3420,
      details: {
        'Preprocessing': 'Bicubic resize & channel normalization (0.485, 0.456, 0.406)',
        'Model inference': 'Execution completed on accelerated tensor runtime',
        'Output generation': 'Vision token decoding + spatial coordinates regression',
      },
    },
    {
      id: 'trace_output',
      name: 'Output',
      description: 'Multimodal explanation and spatial evidence fused for user delivery',
      status: 'completed',
      durationMs: 420,
      details: {
        'Text answer': 'Generated via temperature 0.2 decoder',
        'Object detections': isVqa || isGrounding ? '7 regions localized' : '12.3% land change detected',
        'Confidence score': '0.87',
      },
    },
  ]
}

// ── Mock 1: VQA Response (Reference Panel 3 Match) ─────

export const mockVqaResponse: AnalysisResponse = {
  id: 'analysis-vqa-001',
  query: 'Describe the land-cover and major objects visible in this image.',
  task: 'vqa',
  status: 'completed',
  answer:
    'The image shows a mix of urban and vegetation areas. A major river flows through the scene. The highlighted region corresponds to a water body as requested.',
  confidence: 87, // 0.87
  models: [
    {
      name: 'geochat',
      displayName: 'Remote-Sensing VLM',
      role: 'VQA & Captioning (GeoChat)',
      version: '1.2-FT',
      executionTimeMs: 3420,
      confidence: 87,
    },
  ],
  visualization: {
    type: 'bounding_boxes',
    imageUrl: SAMPLE_SATELLITE_IMG_1,
    boundingBoxes: [
      {
        id: 'bbox-v1',
        label: 'Urban / Built-up',
        confidence: 0.94,
        x: 180,
        y: 220,
        width: 140,
        height: 120,
        color: '#ef4444', // Red
      },
      {
        id: 'bbox-v2',
        label: 'Urban / Built-up',
        confidence: 0.88,
        x: 480,
        y: 620,
        width: 180,
        height: 160,
        color: '#ef4444',
      },
      {
        id: 'bbox-v3',
        label: 'Water body',
        confidence: 0.96,
        x: 290,
        y: 110,
        width: 220,
        height: 600,
        color: '#3b82f6', // Blue
      },
    ],
  },
  detectedObjects: [
    { category: 'Urban / Built-up', count: 2, color: '#ef4444' },
    { category: 'Vegetation', count: 3, color: '#10b981' },
    { category: 'Water body', count: 1, color: '#3b82f6' },
    { category: 'Others', count: 1, color: '#f59e0b' },
  ],
  metadata: {
    fileFormat: 'GeoTIFF',
    dimensions: '1024 × 1024',
    modality: 'Optical (multispectral)',
    resolution: '10m GSD',
    acquisitionDate: '2026-08-28',
    crs: 'EPSG:4326',
    coordinates: '28.6139° N, 77.2090° E',
    sensor: 'Sentinel-2 MSI',
  },
  images: [mockImage1],
  executionTrace: {
    stages: createExecutionTrace('vqa'),
    totalDurationMs: 4860,
    startedAt: new Date(Date.now() - 6000).toISOString(),
    completedAt: new Date().toISOString(),
  },
  createdAt: new Date(Date.now() - 6000).toISOString(),
  completedAt: new Date().toISOString(),
  reportAvailable: true,
}

// ── Mock 2: Grounding Response ─────────────────────────

export const mockGroundingResponse: AnalysisResponse = {
  id: 'analysis-grnd-002',
  query: 'Where is the water body?',
  task: 'grounding',
  status: 'completed',
  answer:
    'A central meandering water body (river tributary) has been precisely localized in the central-western sector of the image. The detected water body covers approximately 8.4% of the overall scene area.',
  confidence: 92,
  models: [
    {
      name: 'grounding_dino',
      displayName: 'Grounding DINO',
      role: 'Text-guided Object Localization',
      version: '1.5-RS',
      executionTimeMs: 2150,
      confidence: 92,
    },
  ],
  visualization: {
    type: 'bounding_boxes',
    imageUrl: SAMPLE_SATELLITE_IMG_1,
    boundingBoxes: [
      {
        id: 'bbox-g1',
        label: 'Water Body (River)',
        confidence: 0.96,
        x: 240,
        y: 80,
        width: 280,
        height: 640,
        color: '#2563eb',
      },
      {
        id: 'bbox-g2',
        label: 'Wetland Fringe',
        confidence: 0.84,
        x: 210,
        y: 690,
        width: 140,
        height: 120,
        color: '#06b6d4',
      },
    ],
  },
  detectedObjects: [
    { category: 'Water body', count: 1, color: '#2563eb' },
    { category: 'Wetland Fringe', count: 1, color: '#06b6d4' },
    { category: 'Riparian Buffer', count: 2, color: '#10b981' },
  ],
  metadata: {
    fileFormat: 'GeoTIFF',
    dimensions: '1024 × 1024',
    modality: 'Optical (multispectral)',
    resolution: '10m GSD',
    acquisitionDate: '2026-08-28',
    crs: 'EPSG:4326',
    coordinates: '28.6139° N, 77.2090° E',
    sensor: 'Sentinel-2 MSI',
  },
  images: [mockImage1],
  executionTrace: {
    stages: createExecutionTrace('grounding'),
    totalDurationMs: 3820,
    startedAt: new Date(Date.now() - 5000).toISOString(),
    completedAt: new Date().toISOString(),
  },
  createdAt: new Date(Date.now() - 5000).toISOString(),
  completedAt: new Date().toISOString(),
  reportAvailable: true,
}

// ── Mock 3: Change Detection Response ──────────────────

export const mockChangeDetectionResponse: AnalysisResponse = {
  id: 'analysis-cd-003',
  query: 'What changed between these two dates?',
  task: 'change_detection',
  status: 'completed',
  answer:
    'Built-up area has increased significantly in the northern and eastern quadrants. New road infrastructure and industrial structures are visible compared with the earlier acquisition date. A total of 12.3% of the analyzed surface underwent high-confidence land-use transformation.',
  confidence: 89,
  models: [
    {
      name: 'changeformer',
      displayName: 'ChangeFormer',
      role: 'Bi-Temporal Change Detection',
      version: '2.4',
      executionTimeMs: 4890,
      confidence: 91,
    },
    {
      name: 'geochat',
      displayName: 'GeoChat',
      role: 'Temporal Semantic Explanation',
      version: '1.2-FT',
      executionTimeMs: 2840,
      confidence: 87,
    },
  ],
  visualization: {
    type: 'change_map',
    imageUrl: SAMPLE_SATELLITE_IMG_1,
    changeDetection: {
      changeMapUrl: SAMPLE_CHANGE_MAP,
      changedAreaPercentage: 12.3,
      changeCategories: [
        { category: 'Urban Expansion', percentage: 7.8, color: '#ef4444' },
        { category: 'Vegetation Loss', percentage: 3.2, color: '#f59e0b' },
        { category: 'New Roads / Paved', percentage: 1.3, color: '#8b5cf6' },
      ],
    },
  },
  detectedObjects: [
    { category: 'Urban Expansion', count: 4, color: '#ef4444' },
    { category: 'Vegetation Alteration', count: 3, color: '#f59e0b' },
    { category: 'Road Corridors', count: 2, color: '#8b5cf6' },
  ],
  metadata: {
    fileFormat: 'GeoTIFF (Dual Co-registered)',
    dimensions: '1024 × 1024',
    modality: 'Bi-Temporal Optical',
    resolution: '10m GSD',
    acquisitionDate: '2024-03-12 vs 2026-08-28',
    crs: 'EPSG:4326',
    coordinates: '28.6139° N, 77.2090° E',
    sensor: 'Sentinel-2 Pair',
  },
  images: [mockImage1, mockImage2],
  executionTrace: {
    stages: createExecutionTrace('change_detection'),
    totalDurationMs: 8420,
    startedAt: new Date(Date.now() - 9000).toISOString(),
    completedAt: new Date().toISOString(),
  },
  createdAt: new Date(Date.now() - 9000).toISOString(),
  completedAt: new Date().toISOString(),
  reportAvailable: true,
}

// ── Mock 4: Optical + SAR Pair Response ────────────────

export const mockOpticalSarResponse: AnalysisResponse = {
  id: 'analysis-opt-sar-004',
  query: 'Use optical and SAR together to assess structural density.',
  task: 'optical_sar',
  status: 'completed',
  answer:
    'Synergistic fusion of Sentinel-2 optical multispectral data and Sentinel-1 C-band SAR backscatter reveals dense urban clusters in the south-east quadrant with high double-bounce reflection, even through seasonal haze. Moisture-retaining agricultural parcels exhibit low SAR backscatter and high NIR reflectance.',
  confidence: 91,
  models: [
    {
      name: 'geochat',
      displayName: 'Multimodal Remote-Sensing VLM',
      role: 'Cross-Sensor Joint Reasoning',
      version: '2.0-MS',
      executionTimeMs: 4120,
      confidence: 91,
    },
  ],
  visualization: {
    type: 'annotated_image',
    imageUrl: SAMPLE_SATELLITE_IMG_1,
  },
  detectedObjects: [
    { category: 'High SAR Backscatter (Urban)', count: 3, color: '#ef4444' },
    { category: 'Specular Reflection (Water)', count: 1, color: '#3b82f6' },
    { category: 'Volumetric Scatter (Canopy)', count: 4, color: '#10b981' },
  ],
  metadata: {
    fileFormat: 'GeoTIFF (Optical + SAR)',
    dimensions: '1024 × 1024',
    modality: 'Optical (MSI) + SAR (C-band)',
    resolution: '10m GSD',
    acquisitionDate: '2026-08-28 (Co-registered)',
    crs: 'EPSG:4326',
    coordinates: '28.6139° N, 77.2090° E',
    sensor: 'Sentinel-2 + Sentinel-1',
  },
  images: [mockImage1, mockSarImage],
  executionTrace: {
    stages: createExecutionTrace('optical_sar'),
    totalDurationMs: 6240,
    startedAt: new Date(Date.now() - 7000).toISOString(),
    completedAt: new Date().toISOString(),
  },
  createdAt: new Date(Date.now() - 7000).toISOString(),
  completedAt: new Date().toISOString(),
  reportAvailable: true,
}

// ── Mock History ───────────────────────────────────────

export const mockHistoryItems: HistoryItem[] = [
  {
    id: 'analysis-vqa-001',
    query: 'Describe the land-cover and major objects visible in this image.',
    task: 'vqa',
    status: 'completed',
    confidence: 87,
    thumbnailUrl: SAMPLE_THUMBNAIL,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    completedAt: new Date(Date.now() - 3594000).toISOString(),
    executionTimeMs: 4860,
    modelNames: ['Remote-Sensing VLM (GeoChat)'],
  },
  {
    id: 'analysis-grnd-002',
    query: 'Where is the water body?',
    task: 'grounding',
    status: 'completed',
    confidence: 92,
    thumbnailUrl: SAMPLE_THUMBNAIL,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    completedAt: new Date(Date.now() - 7195000).toISOString(),
    executionTimeMs: 3820,
    modelNames: ['Grounding DINO'],
  },
  {
    id: 'analysis-cd-003',
    query: 'What changed between these two dates?',
    task: 'change_detection',
    status: 'completed',
    confidence: 89,
    thumbnailUrl: SAMPLE_THUMBNAIL,
    createdAt: new Date(Date.now() - 14400000).toISOString(),
    completedAt: new Date(Date.now() - 14391000).toISOString(),
    executionTimeMs: 8420,
    modelNames: ['ChangeFormer', 'GeoChat'],
  },
  {
    id: 'analysis-opt-sar-004',
    query: 'Use optical and SAR together to assess structural density.',
    task: 'optical_sar',
    status: 'completed',
    confidence: 91,
    thumbnailUrl: SAMPLE_THUMBNAIL,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    completedAt: new Date(Date.now() - 86393000).toISOString(),
    executionTimeMs: 6240,
    modelNames: ['Multimodal RS-VLM'],
  },
]

// ── Mock Dashboard Stats ───────────────────────────────

export const mockDashboardStats: DashboardStats = {
  totalAnalyses: 58,
  successfulAnalyses: 56,
  averageExecutionTimeMs: 5840,
  availableModels: 3,
  recentAnalyses: mockHistoryItems,
}

// ── Mock Responses Lookup ──────────────────────────────

export const mockResponsesById: Record<string, AnalysisResponse> = {
  'analysis-vqa-001': mockVqaResponse,
  'analysis-grnd-002': mockGroundingResponse,
  'analysis-cd-003': mockChangeDetectionResponse,
  'analysis-opt-sar-004': mockOpticalSarResponse,
}

// ── Mock Workflow Stage Timings ────────────────────────
export const MOCK_STAGE_DELAYS = [400, 600, 500, 500, 1600, 700, 600, 400]
