import { useState, useRef, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  UploadCloud,
  CheckCircle2,
  X,
  ArrowRight,
  ImageIcon,
  Layers,
  Calendar,
  Check,
  Brain,
} from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { useAnalysisStore } from '@/store/analysisStore'
import { useWorkflow } from '@/hooks/useWorkflow'
import { USE_MOCK_API } from '@/api'
import {
  validateImageFile,
  createPreviewUrl,
  getImageDimensions,
} from '@/utils/validation'
import { formatBytes, cn } from '@/lib/utils'
import AnalysisStepper from '@/components/layout/AnalysisStepper'
import type { AnalysisMode, UploadedImage } from '@/types'
import {
  SAMPLE_SATELLITE_IMG_1,
  SAMPLE_SATELLITE_IMG_2,
  SAMPLE_SATELLITE_SAR,
} from '@/api/mock/mockData'

export default function Analyze() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)

  const {
    images,
    addImage,
    removeImage,
    clearImages,
    query,
    setQuery,
    isAnalyzing,
    workflowStages,
    currentAnalysisId,
    analysisMode,
    setAnalysisMode,
    activeStep,
  } = useAnalysisStore()

  const { runAnalysis } = useWorkflow()

  // Handle URL query task param if coming from Landing page capability cards
  useEffect(() => {
    const taskParam = searchParams.get('task')
    const demoParam = searchParams.get('demo')

    if (taskParam === 'change_detection' || demoParam === 'true') {
      setAnalysisMode('before_after')
      setQuery('What changed between these two dates?')
      loadSampleImages('before_after')
    } else if (taskParam === 'grounding') {
      setAnalysisMode('single')
      setQuery('Where is the water body?')
      loadSampleImages('single')
    } else if (taskParam === 'optical_sar') {
      setAnalysisMode('optical_sar')
      setQuery('Use optical and SAR together to assess structural density.')
      loadSampleImages('optical_sar')
    } else if (taskParam === 'vqa') {
      setAnalysisMode('single')
      setQuery('Describe the land-cover and major objects visible in this image.')
      loadSampleImages('single')
    } else if (images.length === 0) {
      // Default sample for immediate SIH judge readiness
      loadSampleImages('single')
    }
  }, [searchParams])

  // Helper to load realistic satellite images into store for quick SIH demo
  const loadSampleImages = (mode: AnalysisMode) => {
    clearImages()
    // Sample entries are empty placeholder files with remote preview URLs.
    // They cannot be analysed by the real backend, so only use them in mock mode.
    if (!USE_MOCK_API) return
    if (mode === 'single') {
      addImage({
        file: new File([''], 'satellite_image.tif', { type: 'image/tiff' }),
        preview: SAMPLE_SATELLITE_IMG_1,
        info: {
          filename: 'satellite_image.tif',
          fileSize: 5452595, // 5.2 MB
          width: 1024,
          height: 1024,
          mimeType: 'image/tiff',
          modality: 'Optical',
        },
      })
    } else if (mode === 'before_after') {
      addImage({
        file: new File([''], 'satellite_image_date1.tif', { type: 'image/tiff' }),
        preview: SAMPLE_SATELLITE_IMG_1,
        info: {
          filename: 'satellite_image_date1.tif',
          fileSize: 5452595,
          width: 1024,
          height: 1024,
          mimeType: 'image/tiff',
          modality: 'Optical',
        },
      })
      addImage({
        file: new File([''], 'satellite_image_date2.tif', { type: 'image/tiff' }),
        preview: SAMPLE_SATELLITE_IMG_2,
        info: {
          filename: 'satellite_image_date2.tif',
          fileSize: 5821034,
          width: 1024,
          height: 1024,
          mimeType: 'image/tiff',
          modality: 'Optical',
        },
      })
    } else if (mode === 'optical_sar') {
      addImage({
        file: new File([''], 'optical_multispectral.tif', { type: 'image/tiff' }),
        preview: SAMPLE_SATELLITE_IMG_1,
        info: {
          filename: 'optical_multispectral.tif',
          fileSize: 5452595,
          width: 1024,
          height: 1024,
          mimeType: 'image/tiff',
          modality: 'Optical',
        },
      })
      addImage({
        file: new File([''], 'sar_cband_sentinel1.tif', { type: 'image/tiff' }),
        preview: SAMPLE_SATELLITE_SAR,
        info: {
          filename: 'sar_cband_sentinel1.tif',
          fileSize: 6144000,
          width: 1024,
          height: 1024,
          mimeType: 'image/tiff',
          modality: 'SAR',
        },
      })
    }
  }

  const handleModeChange = (mode: AnalysisMode) => {
    setAnalysisMode(mode)
    loadSampleImages(mode)
    if (mode === 'before_after') {
      setQuery('What changed between these two dates?')
    } else if (mode === 'optical_sar') {
      setQuery('Use optical and SAR together to assess structural density.')
    } else {
      setQuery('Describe the land-cover and major objects visible in this image.')
    }
  }

  // File drop & selection handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        await processUploadedFile(e.dataTransfer.files[i])
      }
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      for (let i = 0; i < e.target.files.length; i++) {
        await processUploadedFile(e.target.files[i])
      }
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const processUploadedFile = async (file: File) => {
    const maxAllowed = analysisMode === 'single' ? 1 : 2
    if (images.length >= maxAllowed) {
      toast.error(`Maximum ${maxAllowed} image(s) allowed for this analysis type. Remove one first.`)
      return
    }

    const validation = validateImageFile(file)
    if (!validation.valid) {
      toast.error(validation.error)
      return
    }

    try {
      const preview = createPreviewUrl(file)
      const dimensions = await getImageDimensions(file)
      const newImg: UploadedImage = {
        file,
        preview,
        info: {
          filename: file.name,
          fileSize: file.size,
          width: dimensions.width || 1024,
          height: dimensions.height || 1024,
          mimeType: file.type || 'image/tiff',
          modality: analysisMode === 'optical_sar' && images.length === 1 ? 'SAR' : 'Optical',
        },
      }
      addImage(newImg)
      toast.success(`Loaded ${file.name}`)
    } catch {
      toast.error('Could not process image file')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleAnalyze()
    }
  }

  const handleAnalyze = async () => {
    if (images.length === 0) {
      toast.error('Please upload at least one satellite image before analyzing.')
      return
    }
    if (!query.trim()) {
      toast.error('Please enter a query to analyze.')
      return
    }
    if ((analysisMode === 'before_after' || analysisMode === 'optical_sar') && images.length < 2) {
      toast.error(
        analysisMode === 'before_after'
          ? 'Change analysis requires two co-registered images (Before and After).'
          : 'Optical + SAR mode requires two co-registered images.'
      )
      return
    }

    const result = await runAnalysis()
    if (result) {
      navigate(`/results/${result.id}`)
    }
  }

  const exampleChips = [
    { label: 'Describe the land-cover', mode: 'single' as AnalysisMode },
    { label: 'Highlight the water body', mode: 'single' as AnalysisMode },
    { label: 'What changed between two dates?', mode: 'before_after' as AnalysisMode },
    { label: 'Use optical and SAR together', mode: 'optical_sar' as AnalysisMode },
  ]

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-slate-50 min-h-[calc(100vh-4rem)]">
      {/* Left Stepper Navigation matching Reference */}
      <AnalysisStepper currentStep={activeStep} analysisId={currentAnalysisId} />

      {/* Main Workspace Column */}
      <div className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
        {/* Page Header matching Reference */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Upload Satellite Images
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Choose the type of analysis and upload your images.
          </p>
        </div>

        {/* 1. Analysis Type Selector (3 large cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {/* Card 1: Single Image */}
          <div
            onClick={() => handleModeChange('single')}
            className={cn(
              'p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center text-center relative group',
              analysisMode === 'single'
                ? 'border-blue-600 bg-blue-50/70 shadow-sm'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
            )}
          >
            {analysisMode === 'single' && (
              <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            )}
            <div
              className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors',
                analysisMode === 'single'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
              )}
            >
              <ImageIcon className="w-6 h-6" />
            </div>
            <h2 className="text-sm font-bold text-slate-900">Single Image</h2>
            <p className="text-xs text-slate-500 mt-0.5">Optical or SAR</p>
          </div>

          {/* Card 2: Optical + SAR Pair */}
          <div
            onClick={() => handleModeChange('optical_sar')}
            className={cn(
              'p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center text-center relative group',
              analysisMode === 'optical_sar'
                ? 'border-blue-600 bg-blue-50/70 shadow-sm'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
            )}
          >
            {analysisMode === 'optical_sar' && (
              <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            )}
            <div
              className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors',
                analysisMode === 'optical_sar'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
              )}
            >
              <Layers className="w-6 h-6" />
            </div>
            <h2 className="text-sm font-bold text-slate-900">Optical + SAR Pair</h2>
            <p className="text-xs text-slate-500 mt-0.5">Co-registered images</p>
          </div>

          {/* Card 3: Before + After */}
          <div
            onClick={() => handleModeChange('before_after')}
            className={cn(
              'p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center text-center relative group',
              analysisMode === 'before_after'
                ? 'border-blue-600 bg-blue-50/70 shadow-sm'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
            )}
          >
            {analysisMode === 'before_after' && (
              <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            )}
            <div
              className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors',
                analysisMode === 'before_after'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
              )}
            >
              <Calendar className="w-6 h-6" />
            </div>
            <h2 className="text-sm font-bold text-slate-900">Before + After</h2>
            <p className="text-xs text-slate-500 mt-0.5">Two dates (change analysis)</p>
          </div>
        </div>

        {/* 2. Upload Area (Large dashed dropzone) */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer bg-white flex flex-col items-center justify-center gap-3',
            dragActive
              ? 'border-blue-600 bg-blue-50/60 ring-4 ring-blue-100'
              : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50/60'
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple={analysisMode !== 'single'}
            accept=".png,.jpg,.jpeg,.tiff,.tif"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm">
            <UploadCloud className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <p className="text-base font-semibold text-slate-800">
              Drag and drop your image here
            </p>
            <p className="text-xs text-slate-500">
              or <span className="text-blue-600 font-semibold underline">Click to browse</span>
            </p>
          </div>
          <p className="text-xs text-slate-400">
            Supported formats: GeoTIFF, TIFF, PNG, JPEG
          </p>
        </div>

        {/* 3. Uploaded File Cards matching Reference */}
        {images.length > 0 && (
          <div className="mt-4 space-y-2.5">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center justify-between shadow-sm hover:border-slate-300 transition-all"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Thumbnail */}
                  <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                    <img
                      src={img.preview}
                      alt={img.info.filename || 'Uploaded image'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Filename & specs */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {img.info.filename}
                      </p>
                      {analysisMode === 'before_after' && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                          {idx === 0 ? 'Earlier Date' : 'Later Date'}
                        </span>
                      )}
                      {analysisMode === 'optical_sar' && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-purple-100 text-purple-700">
                          {idx === 0 ? 'Optical' : 'SAR'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 font-mono">
                      {img.info.fileSize ? formatBytes(img.info.fileSize) : '5.2 MB'} •{' '}
                      {img.info.width || 1024} × {img.info.height || 1024}
                    </p>
                  </div>
                </div>

                {/* Validation status badge & remove button */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Valid</span>
                  </div>
                  <button
                    onClick={() => removeImage(idx)}
                    className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-600 transition-colors"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 4. Query Section matching Reference */}
        <div className="mt-8">
          <h2 className="text-lg font-bold text-slate-900 mb-2">
            Enter Your Query
          </h2>

          <div className="relative">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={4}
              placeholder="Describe the land-cover and major objects visible in this image."
              className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm resize-none font-normal"
            />
          </div>

          {/* Example query chips */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500 font-semibold mr-1">Examples:</span>
            {exampleChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setQuery(chip.label)
                  if (chip.mode !== analysisMode) {
                    handleModeChange(chip.mode)
                  }
                }}
                className={cn(
                  'px-3 py-1.5 rounded-full border transition-all text-xs',
                  query === chip.label
                    ? 'bg-blue-50 border-blue-300 text-blue-700 font-medium'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-slate-50'
                )}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Analyze Button */}
          <div className="mt-6 flex justify-end items-center gap-4">
            <span className="text-xs text-slate-400 hidden sm:inline">
              Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-mono text-[10px]">Ctrl+Enter</kbd> to analyze
            </span>
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || images.length === 0 || !query.trim()}
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:pointer-events-none text-white font-semibold rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 text-sm cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing Pipeline...</span>
                </>
              ) : (
                <>
                  <span>Analyze</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Real-time AI Execution Pipeline Modal / Overlay */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 max-w-lg w-full overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Brain className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    AI Execution Pipeline
                  </h2>
                  <p className="text-xs text-slate-500">
                    Orchestrating remote-sensing neural models & verification
                  </p>
                </div>
              </div>

              {/* Workflow Stages */}
              <div className="space-y-3 relative pl-2">
                <div className="absolute top-3 bottom-3 left-5 w-0.5 bg-slate-200 -z-0" />
                {workflowStages.map((stage, idx) => {
                  const isDone = stage.status === 'completed'
                  const isCurrent = stage.status === 'running'

                  return (
                    <div
                      key={stage.id}
                      className={cn(
                        'flex items-center gap-3.5 p-2 rounded-xl transition-all relative z-10',
                        isCurrent && 'bg-blue-50/80 border border-blue-200 shadow-sm'
                      )}
                    >
                      {/* Status indicator */}
                      <div
                        className={cn(
                          'w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-colors',
                          isDone
                            ? 'bg-emerald-500 text-white'
                            : isCurrent
                            ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                            : 'bg-white border-2 border-slate-300 text-slate-400'
                        )}
                      >
                        {isDone ? (
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        ) : isCurrent ? (
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          idx + 1
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            'text-xs font-semibold',
                            isCurrent
                              ? 'text-blue-900'
                              : isDone
                              ? 'text-slate-800'
                              : 'text-slate-400'
                          )}
                        >
                          {stage.name}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {stage.description}
                        </p>
                      </div>

                      {isDone && (
                        <span className="text-[10px] font-mono text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                          Done
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Autonomous Task Router Active</span>
                <span className="font-mono text-blue-600 font-semibold animate-pulse">
                  Inferencing...
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
