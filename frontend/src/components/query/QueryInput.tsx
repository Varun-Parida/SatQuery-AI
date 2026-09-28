import { useAnalysisStore } from '@/store/analysisStore'
import { useWorkflow } from '@/hooks/useWorkflow'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

const EXAMPLE_QUERIES = [
  'Describe the land cover',
  'Where is the water body?',
  'What changed between these dates?',
  'Highlight the buildings',
  'How many roads are visible?',
  'Detect urban areas',
]

export default function QueryInput() {
  const { images, query, setQuery, isAnalyzing } = useAnalysisStore()
  const { runAnalysis } = useWorkflow()

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleAnalyze()
    }
  }

  const handleAnalyze = () => {
    if (!query.trim() || images.length === 0 || isAnalyzing) return
    runAnalysis()
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200">Analysis Query</h3>
        <span className="text-xs text-cyan-400 font-medium">
          {images.length} {images.length === 1 ? 'image' : 'images'} uploaded
        </span>
      </div>

      <div className="relative">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe the land cover in this image..."
          className="w-full min-h-[120px] bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 resize-y"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {EXAMPLE_QUERIES.map((example, i) => (
          <button
            key={i}
            onClick={() => setQuery(example)}
            className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 transition-colors border border-slate-700/50"
          >
            {example}
          </button>
        ))}
      </div>

      <Button
        onClick={handleAnalyze}
        disabled={isAnalyzing || !query.trim() || images.length === 0}
        className="w-full mt-2 h-12 text-sm font-semibold"
      >
        {isAnalyzing ? (
          <>
            <div className="w-4 h-4 border-2 border-slate-500 border-t-slate-200 rounded-full animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Analyze
          </>
        )}
      </Button>
      <div className="text-center text-[10px] text-slate-500 mt-1">
        Press{' '}
        <kbd className="font-mono bg-slate-800 px-1 py-0.5 rounded">
          Ctrl/Cmd + Enter
        </kbd>{' '}
        to analyze
      </div>
    </div>
  )
}
