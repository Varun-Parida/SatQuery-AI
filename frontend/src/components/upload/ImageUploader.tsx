import { useState, useRef } from 'react'
import { useAnalysisStore } from '@/store/analysisStore'
import { validateImageFile, createPreviewUrl, getImageDimensions } from '@/utils/validation'
import { formatBytes } from '@/lib/utils'
import { Upload, X } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { UploadedImage } from '@/types'

export default function ImageUploader() {
  const [mode, setMode] = useState<'single' | 'dual'>('single')
  const { images, addImage, removeImage } = useAnalysisStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)

  const maxImages = mode === 'dual' ? 2 : 1

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

    if (e.dataTransfer.files?.[0]) {
      await handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files?.[0]) {
      await handleFile(e.target.files[0])
    }
    // Reset the input so the same file can be uploaded again
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleFile = async (file: File) => {
    if (images.length >= maxImages) {
      toast.error(
        mode === 'dual'
          ? 'Already uploaded 2 images. Remove one first.'
          : 'Remove current image before uploading a new one.'
      )
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

      const uploaded: UploadedImage = {
        file,
        preview,
        info: {
          filename: file.name,
          fileSize: file.size,
          width: dimensions.width,
          height: dimensions.height,
          mimeType: file.type || 'image/tiff',
        },
      }

      addImage(uploaded)
      toast.success('Image uploaded successfully')
    } catch {
      toast.error('Failed to process image')
    }
  }

  const getDropZoneLabel = () => {
    if (mode === 'dual') {
      if (images.length === 0) return 'EARLIER IMAGE'
      if (images.length === 1) return 'LATER IMAGE'
      return ''
    }
    return ''
  }

  const canUpload = images.length < maxImages

  return (
    <div className="flex flex-col gap-4">
      {/* Mode toggle */}
      <div className="flex rounded-lg bg-slate-800 p-1">
        <button
          className={cn(
            'flex-1 py-1.5 text-xs font-medium rounded-md transition-colors',
            mode === 'single'
              ? 'bg-slate-700 text-white'
              : 'text-slate-400 hover:text-slate-200'
          )}
          onClick={() => setMode('single')}
        >
          Single Image
        </button>
        <button
          className={cn(
            'flex-1 py-1.5 text-xs font-medium rounded-md transition-colors',
            mode === 'dual'
              ? 'bg-slate-700 text-white'
              : 'text-slate-400 hover:text-slate-200'
          )}
          onClick={() => setMode('dual')}
        >
          Two Images (Change)
        </button>
      </div>

      {/* Drop zone */}
      {canUpload && (
        <div
          className={cn(
            'relative border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer',
            dragActive
              ? 'border-cyan-500 bg-cyan-500/10'
              : 'border-slate-700 hover:border-slate-500 hover:bg-slate-800/50'
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".png,.jpg,.jpeg,.tiff,.tif"
            className="hidden"
            onChange={handleChange}
          />
          <div className="flex flex-col items-center gap-2">
            {mode === 'dual' && (
              <div className="text-[10px] uppercase tracking-widest text-cyan-400 font-semibold mb-1">
                {getDropZoneLabel()}
              </div>
            )}
            <div className="p-3 bg-slate-800 rounded-full">
              <Upload className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="text-sm font-medium text-slate-200">
              Drop satellite image here
            </div>
            <div className="text-xs text-slate-500">
              or click to browse (.png, .jpg, .tiff)
            </div>
          </div>
        </div>
      )}

      {/* Uploaded images list */}
      {images.length > 0 && (
        <div className="flex flex-col gap-2 mt-2">
          {images.map((img, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-2 bg-slate-800/50 border border-slate-700 rounded-lg"
            >
              {mode === 'dual' && (
                <div className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold w-12 shrink-0">
                  {index === 0 ? 'Earlier' : 'Later'}
                </div>
              )}
              <div className="w-10 h-10 rounded bg-slate-900 shrink-0 overflow-hidden">
                {img.preview ? (
                  <img
                    src={img.preview}
                    alt={img.info.filename ?? 'Uploaded image'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600 text-[8px]">
                    TIFF
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-slate-200 truncate">
                  {img.info.filename ?? 'Unknown'}
                </div>
                <div className="text-[10px] text-slate-500">
                  {img.info.fileSize ? formatBytes(img.info.fileSize) : ''}
                  {img.info.width && img.info.height
                    ? ` • ${img.info.width}×${img.info.height}`
                    : ''}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removeImage(index)
                }}
                className="p-1.5 hover:bg-slate-700 rounded-md text-slate-400 hover:text-red-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
