import { useState, useRef, useEffect } from 'react'
import { GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ComparisonSliderProps {
  leftImageUrl: string
  rightImageUrl: string
  leftLabel?: string
  rightLabel?: string
  className?: string
}

export function ComparisonSlider({
  leftImageUrl,
  rightImageUrl,
  leftLabel,
  rightLabel,
  className,
}: ComparisonSliderProps) {
  const [position, setPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handlePointerDown = () => setIsDragging(true)
  const handlePointerUp = () => setIsDragging(false)

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement> | PointerEvent) => {
    if (!isDragging || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
    const percentage = (x / rect.width) * 100

    setPosition(percentage)
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove as any)
      window.addEventListener('pointerup', handlePointerUp)
    } else {
      window.removeEventListener('pointermove', handlePointerMove as any)
      window.removeEventListener('pointerup', handlePointerUp)
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove as any)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [isDragging])

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full h-full min-h-[420px] overflow-hidden select-none bg-slate-950 rounded-xl cursor-col-resize',
        className
      )}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{ touchAction: 'none' }}
    >
      {/* Right Image (Background) */}
      <img
        src={rightImageUrl}
        alt="Right view"
        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
      />

      {/* Left Image (Foreground/Clipped) */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ width: `${position}%` }}
      >
        <img
          src={leftImageUrl}
          alt="Left view"
          className="absolute top-0 left-0 h-full w-[100vw] max-w-none object-cover"
          style={{ width: containerRef.current?.offsetWidth || '100%' }}
        />
      </div>

      {/* Divider */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-blue-500 cursor-col-resize flex items-center justify-center z-10"
        style={{ left: `${position}%` }}
      >
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl -ml-4 border-2 border-white ring-4 ring-blue-500/20">
          <GripVertical className="w-4 h-4" />
        </div>
      </div>

      {/* Labels */}
      {leftLabel && (
        <div className="absolute top-4 left-4 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700/80 backdrop-blur-sm z-20 text-xs font-semibold text-slate-200">
          {leftLabel}
        </div>
      )}
      {rightLabel && (
        <div className="absolute top-4 right-4 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700/80 backdrop-blur-sm z-20 text-xs font-semibold text-slate-200">
          {rightLabel}
        </div>
      )}
    </div>
  )
}
