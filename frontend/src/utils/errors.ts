import { isAxiosError } from 'axios'
import { API_BASE_URL } from '@/api/client'

/** Extract FastAPI's `detail` (string, or a list of validation errors for 422). */
function getFastApiDetail(data: unknown): string | undefined {
  if (!data || typeof data !== 'object') return undefined
  const detail = (data as Record<string, unknown>).detail
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) {
    const parts = detail
      .map((d) => {
        if (!d || typeof d !== 'object') return String(d)
        const item = d as { loc?: unknown[]; msg?: string }
        const field = Array.isArray(item.loc) ? item.loc.filter((l) => l !== 'body').join('.') : ''
        return field ? `${field}: ${item.msg}` : item.msg
      })
      .filter(Boolean)
    if (parts.length) return parts.join('; ')
  }
  return undefined
}

/** Human-readable error messages for common error scenarios */
export function getErrorMessage(error: unknown): string {
  // Axios errors first: they are also `instanceof Error`, but their generic
  // message ("Request failed with status code 400") hides the backend detail.
  if (isAxiosError(error)) {
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        return 'Request timed out. The analysis may be taking longer than expected.'
      }
      return `Backend unavailable: cannot reach the SatQuery API at ${API_BASE_URL}. Is the FastAPI server running?`
    }
    const status = error.response.status
    const detail = getFastApiDetail(error.response.data)
    return detail ? `${getHttpErrorMessage(status)} (${status}: ${detail})` : getHttpErrorMessage(status)
  }

  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'object' && error !== null) {
    const obj = error as Record<string, unknown>

    // API error format
    if (typeof obj.message === 'string') return obj.message
    if (typeof obj.detail === 'string') return obj.detail

    // Axios error
    if (obj.response && typeof obj.response === 'object') {
      const resp = obj.response as Record<string, unknown>
      if (resp.data && typeof resp.data === 'object') {
        const data = resp.data as Record<string, unknown>
        if (typeof data.message === 'string') return data.message
        if (typeof data.detail === 'string') return data.detail
      }

      const status = resp.status as number
      return getHttpErrorMessage(status)
    }

    // Network error
    if (obj.code === 'ERR_NETWORK') {
      return 'Network error. Please check your connection and try again.'
    }

    if (obj.code === 'ECONNABORTED') {
      return 'Request timed out. The analysis may be taking longer than expected.'
    }
  }

  if (typeof error === 'string') return error

  return 'An unexpected error occurred. Please try again.'
}

/** Get HTTP status error message */
function getHttpErrorMessage(status: number): string {
  const messages: Record<number, string> = {
    400: 'Invalid request. Please check your input and try again.',
    401: 'Authentication required. Please sign in.',
    403: 'Access denied. You do not have permission for this action.',
    404: 'Resource not found. The analysis may have been deleted.',
    408: 'Request timed out. Please try again.',
    413: 'File is too large. Please upload a smaller image.',
    415: 'Unsupported file type. Please use PNG, JPEG, or TIFF.',
    422: 'Invalid input. Please check your query and images.',
    429: 'Too many requests. Please wait a moment and try again.',
    500: 'Server error. Our team has been notified.',
    502: 'Service temporarily unavailable. Please try again shortly.',
    503: 'Service is under maintenance. Please try again later.',
  }
  return messages[status] ?? `Server returned an error (${status}).`
}

/** Format file validation error for display */
export function getFileValidationError(code: string): string {
  const messages: Record<string, string> = {
    FILE_TOO_LARGE: 'This file exceeds the maximum upload size.',
    UNSUPPORTED_FORMAT: 'This file format is not supported. Use PNG, JPEG, TIFF, or GeoTIFF.',
    CORRUPT_FILE: 'This file appears to be corrupted and cannot be processed.',
    MISSING_SECOND_IMAGE: 'Change detection requires two images. Please upload a second image.',
    DIMENSION_MISMATCH: 'For change detection, both images should have similar dimensions.',
    UPLOAD_FAILED: 'Upload failed. Please try again.',
  }
  return messages[code] ?? 'An error occurred with this file.'
}
