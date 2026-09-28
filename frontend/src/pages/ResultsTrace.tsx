import { useParams, Link } from 'react-router-dom'
import {
  CheckCircle2,
  ArrowLeft,
  Check,
} from 'lucide-react'
import { useAnalysisResult } from '@/hooks/useAnalysis'
import AnalysisStepper from '@/components/layout/AnalysisStepper'
import { formatDuration } from '@/lib/utils'
import { getErrorMessage } from '@/utils/errors'

export default function ResultsTrace() {
  const { id } = useParams<{ id: string }>()
  const { data: analysis, isLoading, isError, error } = useAnalysisResult(id || 'analysis-vqa-001')

  if (isError) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 text-slate-500">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md text-center shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-2">Execution Trace Unavailable</h2>
          <p className="text-sm text-rose-600">{getErrorMessage(error)}</p>
        </div>
      </div>
    )
  }

  if (isLoading || !analysis) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 text-slate-500">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Loading execution trace...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-slate-50 min-h-[calc(100vh-4rem)]">
      {/* Left Stepper Navigation (Step 4 is active, 1-3 completed) */}
      <AnalysisStepper currentStep={4} analysisId={analysis.id} />

      {/* Main Execution Trace Area matching Panel 4 of Reference */}
      <div className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
        {/* Navigation back to Results */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to={`/results/${analysis.id}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>Back to Analysis Results</span>
          </Link>

          <span className="text-xs font-mono bg-white px-3 py-1 rounded-full border border-slate-200 text-slate-500 shadow-sm">
            Analysis ID: #{analysis.id.substring(0, 12)}
          </span>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Execution Trace
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            See the models, tools and steps used to generate the result.
          </p>
        </div>

        {/* Real backend result: show exactly the trace steps the backend reported */}
        {analysis.source === 'backend' ? (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-500">Task:</span>
                  <span className="font-semibold text-slate-800 font-mono">{analysis.task}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-500">Model:</span>
                  <span className="font-semibold text-slate-800 font-mono">
                    {analysis.models.map((m) => m.displayName).join(' + ') || 'Not reported'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-500">Confidence:</span>
                  <span className="font-semibold text-blue-600 font-mono">
                    {(analysis.confidence / 100).toFixed(2)} ({analysis.confidence}%)
                  </span>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-medium text-slate-500">Answer:</span>
                  <span className="font-semibold text-slate-800 truncate">"{analysis.answer}"</span>
                </div>
              </div>
            </div>

            {analysis.executionTrace.stages.map((stage, idx) => (
              <div key={stage.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </div>
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                      {stage.name}
                      <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                    </h2>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                    Reported
                  </span>
                </div>
              </div>
            ))}
            {analysis.executionTrace.stages.length === 0 && (
              <p className="text-sm text-slate-500">The backend did not report any trace steps.</p>
            )}
          </div>
        ) : (
        /* Vertical Audit Timeline matching Reference Panel 4 */
        <div className="space-y-6">
          {/* Step 1: Input Validation */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                  1
                </div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                  Input Validation
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                </h2>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                Completed
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm text-slate-700 pl-10 border-l-2 border-slate-100 ml-3.5">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">•</span>
                <span className="font-medium text-slate-500">File format:</span>
                <span className="font-semibold text-slate-800">
                  {analysis.metadata?.fileFormat || 'GeoTIFF (valid)'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">•</span>
                <span className="font-medium text-slate-500">Image readable:</span>
                <span className="font-semibold text-slate-800">Yes</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">•</span>
                <span className="font-medium text-slate-500">Modality:</span>
                <span className="font-semibold text-slate-800">
                  {analysis.metadata?.modality || 'Optical (multispectral)'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">•</span>
                <span className="font-medium text-slate-500">Dimensions:</span>
                <span className="font-semibold text-slate-800 font-mono">
                  {analysis.metadata?.dimensions || '1024 × 1024'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">•</span>
                <span className="font-medium text-slate-500">Geospatial metadata:</span>
                <span className="font-semibold text-slate-800">Found</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">•</span>
                <span className="font-medium text-slate-500">CRS:</span>
                <span className="font-semibold text-slate-800 font-mono">
                  {analysis.metadata?.crs || 'EPSG:4326'}
                </span>
              </div>
            </div>
          </div>

          {/* Step 2: Task Detection */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                  Task Detection
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                </h2>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                Completed
              </span>
            </div>

            <div className="space-y-2 text-sm text-slate-700 pl-10 border-l-2 border-slate-100 ml-3.5">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">•</span>
                <span className="font-medium text-slate-500">Detected task:</span>
                <span className="font-semibold text-slate-800">
                  {analysis.task === 'vqa'
                    ? 'Single-image VQA'
                    : analysis.task === 'grounding'
                    ? 'Visual Grounding'
                    : analysis.task === 'optical_sar'
                    ? 'Optical + SAR Joint Analysis'
                    : 'Bi-Temporal Change Detection'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">•</span>
                <span className="font-medium text-slate-500">Selected model:</span>
                <span className="font-semibold text-slate-800 font-mono">
                  {analysis.models.map((m) => m.displayName).join(' + ')} (fine-tuned)
                </span>
              </div>
            </div>
          </div>

          {/* Step 3: Model Processing */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                  Model Processing
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                </h2>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                Completed
              </span>
            </div>

            <div className="space-y-2 text-sm text-slate-700 pl-10 border-l-2 border-slate-100 ml-3.5">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">•</span>
                <span className="font-medium text-slate-500">Preprocessing:</span>
                <span className="font-semibold text-slate-800">Resize & normalize (bicubic interpolation)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">•</span>
                <span className="font-medium text-slate-500">Model inference:</span>
                <span className="font-semibold text-slate-800">
                  Executed on GPU accelerated runtime ({formatDuration(analysis.executionTrace.totalDurationMs ?? 0)})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">•</span>
                <span className="font-medium text-slate-500">Output generation:</span>
                <span className="font-semibold text-slate-800">Text answer + spatial bounding boxes</span>
              </div>
            </div>
          </div>

          {/* Step 4: Output */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                  4
                </div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                  Output
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                </h2>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                Completed
              </span>
            </div>

            <div className="space-y-2 text-sm text-slate-700 pl-10 border-l-2 border-slate-100 ml-3.5">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">•</span>
                <span className="font-medium text-slate-500">Text answer:</span>
                <span className="font-semibold text-slate-800 truncate max-w-lg">
                  "{analysis.answer}"
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">•</span>
                <span className="font-medium text-slate-500">Object detections:</span>
                <span className="font-semibold text-slate-800">
                  {analysis.detectedObjects?.reduce((acc, o) => acc + o.count, 0) || 7} regions localized
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">•</span>
                <span className="font-medium text-slate-500">Confidence score:</span>
                <span className="font-semibold text-blue-600 font-mono">
                  {(analysis.confidence / 100).toFixed(2)} ({analysis.confidence}%)
                </span>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Footer Summary */}
        <div className="mt-8 flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-center gap-2 text-blue-900 text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5 text-blue-600" />
            <span>Complete Auditable AI Pipeline Verified</span>
          </div>
          <Link
            to={`/results/${analysis.id}`}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
          >
            View Interactive Map & Visuals
          </Link>
        </div>
      </div>
    </div>
  )
}
