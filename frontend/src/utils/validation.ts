const SUPPORTED_FORMATS = (import.meta.env.VITE_SUPPORTED_FORMATS || 'png,jpg,jpeg,tiff,tif').split(',')
const MAX_FILE_SIZE = (parseInt(import.meta.env.VITE_MAX_FILE_SIZE_MB || '50', 10)) * 1024 * 1024

export interface ValidationResult {
  valid: boolean
  error?: string
}

/** Validate a single image file */
export function validateImageFile(file: File): ValidationResult {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? ''

  if (!SUPPORTED_FORMATS.includes(extension)) {
    return {
      valid: false,
      error: `Unsupported file format ".${extension}". Supported formats: ${SUPPORTED_FORMATS.map(f => `.${f}`).join(', ')}`,
    }
  }

  if (file.size > MAX_FILE_SIZE) {
    const maxMB = MAX_FILE_SIZE / (1024 * 1024)
    return {
      valid: false,
      error: `File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum size is ${maxMB} MB.`,
    }
  }

  if (!file.type.startsWith('image/') && !extension.match(/^(tiff?|geotiff)$/)) {
    return {
      valid: false,
      error: 'File does not appear to be a valid image.',
    }
  }

  return { valid: true }
}

/** Validate files for change detection (requires exactly 2 images) */
export function validateChangeDetectionFiles(files: File[]): ValidationResult {
  if (files.length !== 2) {
    return {
      valid: false,
      error: 'Change detection requires exactly two co-registered images (earlier and later date).',
    }
  }

  for (const file of files) {
    const result = validateImageFile(file)
    if (!result.valid) return result
  }

  return { valid: true }
}

/** Get image dimensions from a File */
export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    // For TIFF/GeoTIFF, we can't reliably get dimensions in the browser
    const extension = file.name.split('.').pop()?.toLowerCase() ?? ''
    if (extension.match(/^(tiff?|geotiff)$/)) {
      resolve({ width: 0, height: 0 })
      return
    }

    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image for dimension check.'))
    }
    img.src = url
  })
}

/** Create a preview URL for a file */
export function createPreviewUrl(file: File): string {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? ''
  // TIFF/GeoTIFF can't be previewed natively in the browser
  if (extension.match(/^(tiff?|geotiff)$/)) {
    return ''
  }
  return URL.createObjectURL(file)
}

/** Validate query text */
export function validateQuery(query: string): ValidationResult {
  const trimmed = query.trim()
  if (!trimmed) {
    return { valid: false, error: 'Please enter a query to analyze the image.' }
  }
  if (trimmed.length < 3) {
    return { valid: false, error: 'Query is too short. Please provide a more descriptive question.' }
  }
  if (trimmed.length > 1000) {
    return { valid: false, error: 'Query is too long. Maximum 1000 characters.' }
  }
  return { valid: true }
}
