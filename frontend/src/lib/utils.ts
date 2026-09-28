import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge Tailwind classes with clsx */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format bytes to human-readable string */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`
}

/** Format milliseconds to human-readable duration */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
  const minutes = Math.floor(ms / 60000)
  const seconds = ((ms % 60000) / 1000).toFixed(0)
  return `${minutes}m ${seconds}s`
}

/** Format a date string to local display format */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** Format relative time (e.g., "2 hours ago") */
export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHour < 24) return `${diffHour}h ago`
  if (diffDay < 7) return `${diffDay}d ago`
  return formatDate(dateStr)
}

/** Truncate a string to a max length */
export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str
  return str.slice(0, maxLen - 1) + '…'
}

/** Generate a random ID */
export function generateId(): string {
  return `sat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

/** Get confidence color class based on percentage */
export function getConfidenceColor(confidence: number): string {
  if (confidence >= 80) return 'text-emerald-400'
  if (confidence >= 60) return 'text-amber-400'
  return 'text-red-400'
}

/** Get confidence background color class */
export function getConfidenceBgColor(confidence: number): string {
  if (confidence >= 80) return 'bg-emerald-400'
  if (confidence >= 60) return 'bg-amber-400'
  return 'bg-red-400'
}

/** Get task display info */
export function getTaskInfo(task: string) {
  const taskMap: Record<string, { label: string; color: string; bgColor: string }> = {
    vqa: { label: 'Single-image VQA', color: 'text-blue-700', bgColor: 'bg-blue-50 border-blue-200' },
    captioning: { label: 'Captioning', color: 'text-indigo-700', bgColor: 'bg-indigo-50 border-indigo-200' },
    grounding: { label: 'Visual Grounding', color: 'text-purple-700', bgColor: 'bg-purple-50 border-purple-200' },
    change_detection: { label: 'Change Analysis', color: 'text-amber-700', bgColor: 'bg-amber-50 border-amber-200' },
    optical_sar: { label: 'Optical + SAR Analysis', color: 'text-emerald-700', bgColor: 'bg-emerald-50 border-emerald-200' },
  }
  return taskMap[task] ?? { label: task, color: 'text-slate-700', bgColor: 'bg-slate-100 border-slate-200' }
}

/** Get status display info */
export function getStatusInfo(status: string) {
  const statusMap: Record<string, { label: string; color: string; bgColor: string }> = {
    pending: { label: 'Pending', color: 'text-slate-600', bgColor: 'bg-slate-100 border-slate-200' },
    processing: { label: 'Processing', color: 'text-blue-700', bgColor: 'bg-blue-50 border-blue-200' },
    completed: { label: 'Completed', color: 'text-emerald-700', bgColor: 'bg-emerald-50 border-emerald-200' },
    failed: { label: 'Failed', color: 'text-red-700', bgColor: 'bg-red-50 border-red-200' },
    cancelled: { label: 'Cancelled', color: 'text-slate-500', bgColor: 'bg-slate-100 border-slate-200' },
  }
  return statusMap[status] ?? { label: status, color: 'text-slate-700', bgColor: 'bg-slate-100 border-slate-200' }
}

/** Get model display name */
export function getModelDisplayName(model: string): string {
  const nameMap: Record<string, string> = {
    geochat: 'GeoChat',
    grounding_dino: 'Grounding DINO',
    changeformer: 'ChangeFormer',
  }
  return nameMap[model] ?? model
}

/** Check if the app is in mock mode */
export function isMockMode(): boolean {
  return import.meta.env.VITE_USE_MOCK_API === 'true'
}
