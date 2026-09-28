import { useCallback } from 'react'
import { useAnalysisStore } from '@/store/analysisStore'
import { mockApi, uploadImage, submitAnalysis, USE_MOCK_API } from '@/api'
import { createWorkflowStages } from '@/api/mock/mockData'
import { toast } from 'sonner'
import { getErrorMessage } from '@/utils/errors'
import type { AnalysisResponse, ImageInfo, WorkflowStage } from '@/types'

/**
 * Stages shown while talking to the real backend. These describe only what the
 * frontend can actually observe; the backend's own internal steps arrive in the
 * result's `trace` and are shown on the results / trace pages.
 */
function createRealWorkflowStages(): WorkflowStage[] {
  return [
    { id: 'upload', name: 'Upload Images', description: 'Sending images to the backend (POST /upload)', status: 'pending' },
    { id: 'analysis_started', name: 'Analysis Started', description: 'Sending query and image IDs (POST /analyze)', status: 'pending' },
    { id: 'backend_processing', name: 'Backend Processing', description: 'Waiting for the FastAPI router and specialist', status: 'pending' },
    { id: 'result_received', name: 'Result Received', description: 'Backend returned the analysis result', status: 'pending' },
  ]
}

/** Mark stages before `index` completed, `index` running, the rest pending. */
function progressTo(stages: WorkflowStage[], index: number): WorkflowStage[] {
  return stages.map((s, i) => ({
    ...s,
    status: i < index ? 'completed' : i === index ? 'running' : 'pending',
  }))
}

/**
 * Hook for managing the analysis workflow.
 * Orchestrates the upload → analyze → stage progression flow.
 */
export function useWorkflow() {
  const store = useAnalysisStore()

  const runAnalysis = useCallback(async () => {
    if (store.images.length === 0) {
      toast.error('Please upload at least one image before analyzing.')
      return null
    }
    if (!store.query.trim()) {
      toast.error('Please enter a query to analyze the image.')
      return null
    }

    store.setIsAnalyzing(true)
    store.setActiveStep(3)

    try {
      const response = USE_MOCK_API ? await runMockAnalysis() : await runRealAnalysis()

      store.setCurrentAnalysisId(response.id)
      store.setActiveStep(4)
      store.setIsAnalyzing(false)

      toast.success('Analysis complete!')
      return response
    } catch (err) {
      store.setIsAnalyzing(false)
      const message = getErrorMessage(err)
      toast.error(message)

      // Mark current running stage as error (read fresh state, not the stale closure)
      const stages = useAnalysisStore
        .getState()
        .workflowStages.map((s) => (s.status === 'running' ? { ...s, status: 'error' as const, error: message } : s))
      store.setWorkflowStages(stages)
      return null
    }

    /** REAL mode: Axios → FastAPI. No mock fallback on failure. */
    async function runRealAnalysis(): Promise<AnalysisResponse> {
      const base = createRealWorkflowStages()
      store.setWorkflowStages(progressTo(base, 0))

      // 1. Upload any image that does not already have a backend ID
      const uploadedIds: string[] = []
      const imageInfos: ImageInfo[] = []
      for (let i = 0; i < store.images.length; i++) {
        const img = store.images[i]
        if (img.uploadedId) {
          uploadedIds.push(img.uploadedId)
          imageInfos.push({ ...(img.info as ImageInfo), id: img.uploadedId, url: img.preview })
          continue
        }
        const result = await uploadImage(img.file, (pct) => store.updateImageProgress(i, pct), img.preview)
        uploadedIds.push(result.image.id)
        imageInfos.push(result.image)
        store.updateImageUploadId(i, result.image.id, result.image)
      }

      // 2–3. Send real image IDs + the actual query, then wait for the backend
      store.setWorkflowStages(progressTo(base, 2))
      const query = store.query.trim()
      const response = await submitAnalysis({ imageIds: uploadedIds, query }, { query, images: imageInfos })

      // 4. Result received
      store.setAnalysisContext(response.id, { query, images: imageInfos })
      store.setWorkflowStages(progressTo(base, base.length))
      return response
    }

    /** MOCK mode: unchanged simulated flow. */
    async function runMockAnalysis(): Promise<AnalysisResponse> {
      store.setWorkflowStages(createWorkflowStages())

      const uploadedIds: string[] = []
      for (let i = 0; i < store.images.length; i++) {
        const img = store.images[i]
        if (img.uploadedId) {
          uploadedIds.push(img.uploadedId)
          continue
        }
        const result = await mockApi.uploadImage(img.file, (pct) => {
          store.updateImageProgress(i, pct)
        })
        uploadedIds.push(result.image.id)
        store.updateImageUploadId(i, result.image.id)
      }

      const response = await mockApi.submitAnalysis(
        {
          imageIds: uploadedIds,
          query: store.query,
          analysisMode: store.analysisMode,
        },
        (stageIndex) => {
          store.setWorkflowStages(progressTo(createWorkflowStages(), stageIndex))
        }
      )

      store.setWorkflowStages(createWorkflowStages().map((s) => ({ ...s, status: 'completed' as const })))
      return response
    }
  }, [store])

  return { runAnalysis }
}
