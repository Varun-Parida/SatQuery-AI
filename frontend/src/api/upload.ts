import type { BackendUploadResponse, UploadResponse } from '@/types'
import apiClient from './client'
import { toUploadResponse } from './adapters'

/** POST /upload (multipart field "file") → real backend image ID. */
export async function uploadImage(
  file: File,
  onProgress?: (percentage: number) => void,
  previewUrl?: string
): Promise<UploadResponse> {
  const formData = new FormData()
  formData.append('file', file)

  const { data } = await apiClient.post<BackendUploadResponse>('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        onProgress(pct)
      }
    },
  })
  return toUploadResponse(data, file, previewUrl)
}

export async function uploadImages(
  files: File[],
  onProgress?: (index: number, percentage: number) => void
): Promise<UploadResponse[]> {
  const results: UploadResponse[] = []
  for (let i = 0; i < files.length; i++) {
    const result = await uploadImage(files[i], (pct) => onProgress?.(i, pct))
    results.push(result)
  }
  return results
}
