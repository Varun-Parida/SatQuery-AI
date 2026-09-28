import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ComparisonSlider } from './ComparisonSlider'

interface ChangeComparisonProps {
  image1Url: string
  image2Url: string
  changeMapUrl?: string
  changeMapLabel?: string
  className?: string
}

type TabMode = 'slider' | 'side_by_side' | 'overlay' | 'change_map'

export function ChangeComparison({
  image1Url,
  image2Url,
  changeMapUrl,
  changeMapLabel = 'Detected Changes (ChangeFormer Output)',
  className,
}: ChangeComparisonProps) {
  const [mode, setMode] = useState<TabMode>('slider')
  const [opacity, setOpacity] = useState(50)

  const tabs: { id: TabMode; label: string }[] = [
    { id: 'slider', label: 'Draggable Slider' },
    { id: 'side_by_side', label: 'Side by Side' },
    { id: 'overlay', label: 'Layer Blend' },
  ]

  if (changeMapUrl) {
    tabs.push({ id: 'change_map', label: 'Change Map' })
  }

  return (
    <div
      className={cn(
        'flex flex-col h-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm',
        className
      )}
    >
      {/* Sub Tabs */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200 bg-slate-50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setMode(tab.id)}
            className={cn(
              'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all',
              mode === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 relative min-h-[420px] p-4 bg-slate-950">
        {mode === 'side_by_side' && (
          <div className="flex flex-col md:flex-row gap-4 h-full">
            <div className="flex-1 relative flex flex-col gap-2">
              <span className="text-xs text-slate-300 font-semibold px-2 py-0.5 rounded bg-slate-800 self-start">
                Earlier Date
              </span>
              <div className="flex-1 bg-slate-900 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
                <img src={image1Url} alt="Earlier" className="w-full h-full object-contain" />
              </div>
            </div>
            <div className="flex-1 relative flex flex-col gap-2">
              <span className="text-xs text-slate-300 font-semibold px-2 py-0.5 rounded bg-slate-800 self-start">
                Later Date
              </span>
              <div className="flex-1 bg-slate-900 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
                <img src={image2Url} alt="Later" className="w-full h-full object-contain" />
              </div>
            </div>
          </div>
        )}

        {mode === 'slider' && (
          <div className="w-full h-full">
            <ComparisonSlider
              leftImageUrl={image1Url}
              rightImageUrl={image2Url}
              leftLabel="Earlier Date"
              rightLabel="Later Date"
            />
          </div>
        )}

        {mode === 'overlay' && (
          <div className="w-full h-full flex flex-col gap-4">
            <div className="flex-1 relative bg-slate-900 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
              <img
                src={image1Url}
                alt="Earlier"
                className="absolute inset-0 w-full h-full object-contain"
              />
              <img
                src={image2Url}
                alt="Later"
                className="absolute inset-0 w-full h-full object-contain"
                style={{ opacity: opacity / 100 }}
              />
            </div>
            <div className="flex items-center gap-4 px-4 bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
              <span>Earlier</span>
              <input
                type="range"
                min="0"
                max="100"
                value={opacity}
                onChange={(e) => setOpacity(parseInt(e.target.value))}
                className="flex-1 accent-blue-600 cursor-pointer"
              />
              <span>Later ({opacity}%)</span>
            </div>
          </div>
        )}

        {mode === 'change_map' && changeMapUrl && (
          <div className="w-full h-full flex flex-col gap-2">
            <span className="text-xs text-rose-400 font-semibold px-2 py-0.5 rounded bg-rose-950/60 border border-rose-800 self-start">
              {changeMapLabel}
            </span>
            <div className="flex-1 bg-slate-900 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
              <img
                src={changeMapUrl}
                alt="Change Map"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
