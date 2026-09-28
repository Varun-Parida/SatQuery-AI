import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'
import { useAnalysisStore } from '@/store/analysisStore'

interface AnalysisStepperProps {
  currentStep: number // 1: Upload, 2: Query, 3: Analyze, 4: View Results
  analysisId?: string | null
  className?: string
}

export default function AnalysisStepper({
  currentStep,
  analysisId,
  className,
}: AnalysisStepperProps) {
  const navigate = useNavigate()
  const { currentAnalysisId } = useAnalysisStore()
  const targetId = analysisId || currentAnalysisId || 'analysis-vqa-001'

  const steps = [
    { number: 1, label: 'Upload Images', path: '/analyze' },
    { number: 2, label: 'Enter Query', path: '/analyze' },
    { number: 3, label: 'Analyze', path: '/analyze' },
    { number: 4, label: 'View Results', path: `/results/${targetId}` },
  ]

  const handleStepClick = (stepNum: number, path: string) => {
    if (stepNum <= currentStep || (stepNum === 4 && (analysisId || currentAnalysisId))) {
      navigate(path)
    }
  }

  return (
    <aside
      className={cn(
        'w-64 shrink-0 bg-white border-r border-slate-200 p-6 flex flex-col',
        className
      )}
    >
      <div className="space-y-6">
        {steps.map((step) => {
          const isCompleted = step.number < currentStep
          const isCurrent = step.number === currentStep
          const isClickable =
            step.number <= currentStep ||
            (step.number === 4 && (analysisId || currentAnalysisId))

          return (
            <div
              key={step.number}
              onClick={() => isClickable && handleStepClick(step.number, step.path)}
              className={cn(
                'flex items-center gap-3.5 transition-colors',
                isClickable ? 'cursor-pointer' : 'cursor-default opacity-60'
              )}
            >
              {/* Step indicator circle */}
              <div
                className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-all',
                  isCompleted
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : isCurrent
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-sm'
                    : 'border-2 border-slate-300 text-slate-400 bg-white'
                )}
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-[2.5]" /> : step.number}
              </div>

              {/* Step label */}
              <span
                className={cn(
                  'text-sm font-medium transition-colors',
                  isCurrent
                    ? 'text-slate-900 font-semibold'
                    : isCompleted
                    ? 'text-slate-700 hover:text-slate-900'
                    : 'text-slate-400'
                )}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </aside>
  )
}
