import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  AlertCircle,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  FileText,
  Sparkles,
  ArrowRight,
  Cpu,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAnalysisResult } from '@/hooks/useAnalysis'
import AnalysisStepper from '@/components/layout/AnalysisStepper'
import { ChangeComparison } from '@/components/visualization/ChangeComparison'
import { ComparisonSlider } from '@/components/visualization/ComparisonSlider'
import { formatDuration, cn } from '@/lib/utils'
import { mockApi } from '@/api'
import { getErrorMessage } from '@/utils/errors'

export default function Results() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: analysis, isLoading, isError, error } = useAnalysisResult(id || 'analysis-vqa-001')

  const [activeTab, setActiveTab] = useState<'answer' | 'compare' | 'metadata' | 'download'>('answer')
  const [zoomLevel, setZoomLevel] = useState(1)
  const [showOverlays, setShowOverlays] = useState(true)

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 text-slate-500 bg-slate-50 min-h-[calc(100vh-4rem)]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Synthesizing analysis results...</span>
        </div>
      </div>
    )
  }

  if (isError || !analysis) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 bg-slate-50 min-h-[calc(100vh-4rem)]">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md text-center shadow-sm">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-slate-900 mb-2">Analysis Not Found</h2>
          <p className="text-sm text-slate-500 mb-6">
            Unable to retrieve the requested analysis session ({id}).
          </p>
          {error && <p className="text-xs text-rose-600 mb-6 -mt-4">{getErrorMessage(error)}</p>}
          <button
            onClick={() => navigate('/analyze')}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all"
          >
            Start New Analysis
          </button>
        </div>
      </div>
    )
  }

  // Real backend results never fall back to demo placeholders below.
  const isReal = analysis.source === 'backend'

  const handleDownload = async () => {
    if (isReal) {
      toast.info('Report export is not implemented by the backend yet.')
      return
    }
    try {
      if (mockApi?.getReport) {
        await mockApi.getReport(analysis.id)
      }
      toast.success('Analysis report package downloaded (PDF & GeoJSON)')
    } catch {
      toast.error('Download failed')
    }
  }

  const bboxes = analysis.visualization?.boundingBoxes || []
  const detectedList = analysis.detectedObjects ?? [
    { category: 'Urban / Built-up', count: 2, color: '#ef4444' },
    { category: 'Vegetation', count: 3, color: '#10b981' },
    { category: 'Water body', count: 1, color: '#3b82f6' },
    { category: 'Others', count: 1, color: '#f59e0b' },
  ]

  const mainImageUrl =
    analysis.visualization?.imageUrl ||
    analysis.images[0]?.url ||
    (isReal ? undefined : 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=1200&q=80')

  // Box coordinates are in source-image pixels
  const viewBoxWidth = analysis.images[0]?.width || 1024
  const viewBoxHeight = analysis.images[0]?.height || 1024
  const changeMapUrl = analysis.visualization?.changeDetection?.changeMapUrl

  const firstImage = analysis.images[0]
  const metaValue = (value: string | undefined, mockDefault: string, real?: string) =>
    isReal ? value || real || 'Not reported by backend' : value || mockDefault

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-slate-50 min-h-[calc(100vh-4rem)]">
      {/* Left Stepper Navigation matching Reference (Step 4 is active, 1-3 completed) */}
      <AnalysisStepper currentStep={4} analysisId={analysis.id} />

      {/* Main Results Column */}
      <div className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
        {/* Top Header & Execution Trace Link */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Analysis Results
            </h1>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              ID: #{analysis.id.substring(0, 12)}
              {analysis.executionTrace.totalDurationMs !== undefined &&
                ` • Completed in ${formatDuration(analysis.executionTrace.totalDurationMs)}`}
            </p>
          </div>

          <Link
            to={`/results/${analysis.id}/trace`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-sm transition-all hover:border-blue-400 group"
          >
            <Cpu className="w-4 h-4 text-blue-600" />
            <span>Execution Trace</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Navigation Tabs matching Reference Panel 3 */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4 mb-6">
          <button
            onClick={() => setActiveTab('answer')}
            className={cn(
              'px-4 py-2 rounded-lg text-xs font-semibold transition-all',
              activeTab === 'answer'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            )}
          >
            Answer & Visualization
          </button>

          <button
            onClick={() => setActiveTab('compare')}
            className={cn(
              'px-4 py-2 rounded-lg text-xs font-semibold transition-all',
              activeTab === 'compare'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            )}
          >
            Before / After View
          </button>

          <button
            onClick={() => setActiveTab('metadata')}
            className={cn(
              'px-4 py-2 rounded-lg text-xs font-semibold transition-all',
              activeTab === 'metadata'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            )}
          >
            Metadata
          </button>

          <button
            onClick={() => setActiveTab('download')}
            className={cn(
              'px-4 py-2 rounded-lg text-xs font-semibold transition-all',
              activeTab === 'download'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            )}
          >
            Download
          </button>
        </div>

        {/* Tab 1: Answer & Visualization (Primary Panel 3 Layout) */}
        {activeTab === 'answer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Large Satellite Image Visualization (7 columns) */}
            <div className="lg:col-span-7 bg-slate-950 rounded-2xl overflow-hidden border border-slate-200 shadow-md relative group aspect-square max-h-[560px] flex items-center justify-center">
              {/* Image with zoom transformation */}
              <div
                className="w-full h-full relative overflow-hidden flex items-center justify-center"
                style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.2s ease-out' }}
              >
                {mainImageUrl ? (
                  <img
                    src={mainImageUrl}
                    alt="Satellite Analysis Evidence"
                    className="w-full h-full object-cover select-none"
                  />
                ) : (
                  <p className="text-xs text-slate-400 px-8 text-center">
                    Image preview is not available for this result (local previews are kept only for
                    analyses run in this browser session).
                  </p>
                )}

                {/* SVG Bounding Boxes Overlay matching Reference */}
                {showOverlays && mainImageUrl && (
                  <svg
                    viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
                    preserveAspectRatio="xMidYMid slice"
                    className="absolute inset-0 w-full h-full pointer-events-none"
                  >
                    {bboxes.length > 0 ? (
                      bboxes.map((box) => (
                        <g key={box.id}>
                          <rect
                            x={box.x}
                            y={box.y}
                            width={box.width}
                            height={box.height}
                            fill={box.color ? `${box.color}22` : 'rgba(239, 68, 68, 0.15)'}
                            stroke={box.color || '#ef4444'}
                            strokeWidth="3"
                            strokeDasharray="4 2"
                          />
                          <rect
                            x={box.x}
                            y={Math.max(0, box.y - 24)}
                            width={Math.max(100, box.label.length * 9)}
                            height={22}
                            fill={box.color || '#ef4444'}
                            rx="3"
                          />
                          <text
                            x={box.x + 6}
                            y={Math.max(15, box.y - 8)}
                            fill="#ffffff"
                            fontSize="11"
                            fontWeight="bold"
                            fontFamily="JetBrains Mono, monospace"
                          >
                            {box.label}{box.confidence != null ? ` ${Math.round(box.confidence * 100)}%` : ''}
                          </text>
                        </g>
                      ))
                    ) : isReal ? null : (
                      // Default realistic bounding boxes matching reference image if none provided
                      <g>
                        {/* Urban cluster 1 (North-west) */}
                        <rect
                          x="160"
                          y="180"
                          width="160"
                          height="140"
                          fill="rgba(239, 68, 68, 0.15)"
                          stroke="#ef4444"
                          strokeWidth="3.5"
                        />
                        <rect x="160" y="154" width="130" height="24" fill="#ef4444" rx="4" />
                        <text x="168" y="170" fill="#ffffff" fontSize="12" fontWeight="bold">
                          Urban / Built-up
                        </text>

                        {/* Urban cluster 2 (South-east) */}
                        <rect
                          x="540"
                          y="620"
                          width="220"
                          height="180"
                          fill="rgba(239, 68, 68, 0.15)"
                          stroke="#ef4444"
                          strokeWidth="3.5"
                        />
                        <rect x="540" y="594" width="130" height="24" fill="#ef4444" rx="4" />
                        <text x="548" y="610" fill="#ffffff" fontSize="12" fontWeight="bold">
                          Urban / Built-up
                        </text>
                      </g>
                    )}
                  </svg>
                )}
              </div>

              {/* Map controls overlay on top-right matching GIS interface */}
              <div className="absolute top-4 right-4 flex flex-col gap-1.5 z-20">
                <button
                  onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
                  className="w-8 h-8 rounded-lg bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-md transition-all"
                  title="Zoom in"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.25))}
                  className="w-8 h-8 rounded-lg bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-md transition-all"
                  title="Zoom out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoomLevel(1)}
                  className="w-8 h-8 rounded-lg bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-md transition-all"
                  title="Reset view"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowOverlays((v) => !v)}
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center shadow-md transition-all',
                    showOverlays
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/90 hover:bg-white text-slate-800'
                  )}
                  title="Toggle Detection Overlays"
                >
                  <Layers className="w-4 h-4" />
                </button>
              </div>

              {/* Coordinates badge at bottom-left */}
              {(!isReal || analysis.metadata?.coordinates) && (
                <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-sm px-2.5 py-1 rounded text-[11px] font-mono text-slate-300 border border-slate-700">
                  {isReal ? analysis.metadata?.coordinates : '28.6139° N, 77.2090° E • 10m GSD'}
                </div>
              )}
            </div>

            {/* Right: Answer, Confidence & Detected Objects (5 columns) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Answer Card matching Reference */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h2 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-2">
                  Answer
                </h2>
                <p className="text-sm md:text-base text-slate-800 leading-relaxed font-normal">
                  {analysis.answer}
                </p>
                {analysis.query && (
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span className="italic">Query: "{analysis.query}"</span>
                  </div>
                )}
                {isReal && (
                  <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
                    <span className="px-2 py-0.5 rounded bg-slate-100 font-mono">task: {analysis.task}</span>
                  </div>
                )}
              </div>

              {/* Confidence Bar matching Reference */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    Confidence
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-900">
                    {(analysis.confidence / 100).toFixed(2)}
                  </span>
                </div>

                {/* Blue progress bar */}
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-700"
                    style={{ width: `${analysis.confidence}%` }}
                  />
                </div>
              </div>

              {/* Detected Objects matching Reference */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h2 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-4">
                  Detected Objects
                </h2>

                <div className="space-y-3">
                  {detectedList.length === 0 && (
                    <p className="text-xs text-slate-500">No regions were reported by the backend.</p>
                  )}
                  {detectedList.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-sm text-slate-700 pb-2 border-b border-slate-100 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-3 h-3 rounded-sm shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="font-medium text-slate-800">{item.category}</span>
                      </div>
                      <span className="text-xs font-semibold text-slate-500 font-mono">
                        {item.count} {item.count === 1 ? 'region' : 'regions'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Models Used */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h2 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-3">
                  AI Architecture
                </h2>
                <div className="space-y-2">
                  {analysis.models.map((model, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-200"
                    >
                      <div>
                        <p className="font-bold text-slate-900">{model.displayName}</p>
                        <p className="text-[11px] text-slate-500">{model.role}</p>
                      </div>
                      {(model.version || !isReal) && (
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-mono font-semibold text-[10px]">
                          {model.version || 'v1.0'}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Before / After Comparison */}
        {activeTab === 'compare' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-1">
                Bi-Temporal Change Analysis & Verification
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                Interactive comparison modes: Drag slider to examine multi-date surface transformation.
              </p>

              {analysis.images.length >= 2 ? (
                <ChangeComparison
                  image1Url={analysis.images[0].url}
                  image2Url={analysis.images[1].url}
                  changeMapUrl={changeMapUrl}
                  changeMapLabel={isReal ? `Detected Changes (${analysis.models[0]?.displayName ?? analysis.task})` : undefined}
                  className="min-h-[500px]"
                />
              ) : isReal ? (
                changeMapUrl ? (
                  <div className="bg-slate-950 rounded-xl p-4 flex items-center justify-center">
                    <img src={changeMapUrl} alt="Change Map" className="max-h-[500px] object-contain" />
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">
                    Before/after comparison needs two images and a change-detection result.
                  </p>
                )
              ) : (
                <ComparisonSlider
                  leftImageUrl={analysis.images[0]?.url || mainImageUrl || ''}
                  rightImageUrl={analysis.visualization?.changeDetection?.changeMapUrl || mainImageUrl || ''}
                  leftLabel="Original Imagery"
                  rightLabel="Change / Feature Map"
                />
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Metadata */}
        {activeTab === 'metadata' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <h2 className="text-base font-bold text-slate-900">
              Remote Sensing Metadata & Geo-Referencing
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-400 font-medium">Format</span>
                <p className="text-sm font-bold text-slate-800 mt-1 font-mono">
                  {metaValue(analysis.metadata?.fileFormat, 'GeoTIFF (Cloud-Optimized)', firstImage?.filename?.split('.').pop()?.toUpperCase())}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-400 font-medium">Raster Dimensions</span>
                <p className="text-sm font-bold text-slate-800 mt-1 font-mono">
                  {metaValue(analysis.metadata?.dimensions, '1024 × 1024 pixels', firstImage?.width ? `${firstImage.width} × ${firstImage.height} pixels` : undefined)}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-400 font-medium">Spatial Resolution</span>
                <p className="text-sm font-bold text-slate-800 mt-1 font-mono">
                  {metaValue(analysis.metadata?.resolution, '10m Ground Sample Distance (GSD)')}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-400 font-medium">Coordinate System</span>
                <p className="text-sm font-bold text-slate-800 mt-1 font-mono">
                  {metaValue(analysis.metadata?.crs, 'EPSG:4326 (WGS 84)')}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-400 font-medium">Acquisition Date</span>
                <p className="text-sm font-bold text-slate-800 mt-1 font-mono">
                  {metaValue(analysis.metadata?.acquisitionDate, '2026-08-28')}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-400 font-medium">Sensor System</span>
                <p className="text-sm font-bold text-slate-800 mt-1 font-mono">
                  {metaValue(analysis.metadata?.sensor, 'Sentinel-2 Multispectral')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Download */}
        {activeTab === 'download' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <h2 className="text-base font-bold text-slate-900">
              Export Evidence & Analysis Reports
            </h2>
            <p className="text-sm text-slate-500">
              Generate auditable, tamper-evident reports for Smart India Hackathon evaluation and stakeholder briefings.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                <div>
                  <FileText className="w-8 h-8 text-blue-600 mb-2" />
                  <h3 className="text-sm font-bold text-slate-900">PDF Executive Report</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Formal multi-page briefing with answers, bounding boxes and metrics.
                  </p>
                </div>
                <button
                  onClick={handleDownload}
                  className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
                >
                  Download PDF
                </button>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                <div>
                  <Layers className="w-8 h-8 text-purple-600 mb-2" />
                  <h3 className="text-sm font-bold text-slate-900">GeoJSON Vectors</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Export localized bounding boxes and polygon boundaries for QGIS / ArcGIS.
                  </p>
                </div>
                <button
                  onClick={handleDownload}
                  className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
                >
                  Export GeoJSON
                </button>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                <div>
                  <Cpu className="w-8 h-8 text-emerald-600 mb-2" />
                  <h3 className="text-sm font-bold text-slate-900">Audit Trace Log</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    JSON trace logs of all tensor execution stages and model parameters.
                  </p>
                </div>
                <button
                  onClick={handleDownload}
                  className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
                >
                  Export Trace JSON
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
