import { create } from 'zustand'
import type { ImageInfo, UploadedImage, VisualizationMode, WorkflowStage, AnalysisMode } from '@/types'
import { createWorkflowStages } from '@/api/mock/mockData'
import type { AnalysisContext } from '@/api/adapters'

interface AnalysisStore {
  // Images
  images: UploadedImage[]
  addImage: (image: UploadedImage) => void
  removeImage: (index: number) => void
  updateImageProgress: (index: number, progress: number) => void
  updateImageUploadId: (index: number, id: string, info?: Partial<ImageInfo>) => void
  clearImages: () => void

  // Query
  query: string
  setQuery: (query: string) => void

  // Analysis state
  isAnalyzing: boolean
  setIsAnalyzing: (val: boolean) => void
  currentAnalysisId: string | null
  setCurrentAnalysisId: (id: string | null) => void

  // Frontend-known context per backend result ID (the backend does not echo query/images)
  analysisContexts: Record<string, AnalysisContext>
  setAnalysisContext: (id: string, context: AnalysisContext) => void

  // Workflow
  workflowStages: WorkflowStage[]
  setWorkflowStages: (stages: WorkflowStage[]) => void
  updateStageStatus: (index: number, status: WorkflowStage['status'], durationMs?: number) => void
  resetWorkflow: () => void

  // Visualization Mode
  visualizationMode: VisualizationMode
  setVisualizationMode: (mode: VisualizationMode) => void

  // Analysis Mode
  analysisMode: AnalysisMode
  setAnalysisMode: (mode: AnalysisMode) => void

  // Stepper state (1: Upload, 2: Query, 3: Analyze, 4: View Results)
  activeStep: number
  setActiveStep: (step: number) => void

  // Reset all
  resetAll: () => void
}

export const useAnalysisStore = create<AnalysisStore>((set) => ({
  // Images
  images: [],
  addImage: (image) =>
    set((state) => ({ images: [...state.images, image] })),
  removeImage: (index) =>
    set((state) => ({
      images: state.images.filter((_, i) => i !== index),
    })),
  updateImageProgress: (index, progress) =>
    set((state) => ({
      images: state.images.map((img, i) =>
        i === index
          ? { ...img, uploadProgress: { loaded: 0, total: 100, percentage: progress } }
          : img
      ),
    })),
  updateImageUploadId: (index, id, info) =>
    set((state) => ({
      images: state.images.map((img, i) =>
        i === index ? { ...img, uploadedId: id, info: { ...img.info, ...info } } : img
      ),
    })),
  clearImages: () => set({ images: [] }),

  // Query
  query: '',
  setQuery: (query) => set({ query }),

  // Analysis
  isAnalyzing: false,
  setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  currentAnalysisId: null,
  setCurrentAnalysisId: (currentAnalysisId) => set({ currentAnalysisId }),
  analysisContexts: {},
  setAnalysisContext: (id, context) =>
    set((state) => ({ analysisContexts: { ...state.analysisContexts, [id]: context } })),

  // Workflow
  workflowStages: createWorkflowStages(),
  setWorkflowStages: (workflowStages) => set({ workflowStages }),
  updateStageStatus: (index, status, durationMs) =>
    set((state) => ({
      workflowStages: state.workflowStages.map((s, i) =>
        i === index ? { ...s, status, durationMs } : s
      ),
    })),
  resetWorkflow: () => set({ workflowStages: createWorkflowStages() }),

  // Visualization Mode
  visualizationMode: 'single',
  setVisualizationMode: (visualizationMode) => set({ visualizationMode }),

  // Analysis Mode
  analysisMode: 'single',
  setAnalysisMode: (analysisMode) => set({ analysisMode }),

  // Stepper state
  activeStep: 1,
  setActiveStep: (activeStep) => set({ activeStep }),

  // Reset
  resetAll: () =>
    set({
      images: [],
      query: '',
      isAnalyzing: false,
      currentAnalysisId: null,
      workflowStages: createWorkflowStages(),
      visualizationMode: 'single',
      analysisMode: 'single',
      activeStep: 1,
    }),
}))
