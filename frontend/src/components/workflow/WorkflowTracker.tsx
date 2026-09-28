import { useAnalysisStore } from '@/store/analysisStore';
import type { WorkflowStage } from '@/types';
import WorkflowStageComponent from './WorkflowStage';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function WorkflowTracker() {
  const { workflowStages, isAnalyzing, currentAnalysisId } = useAnalysisStore();
  const navigate = useNavigate();

  const isCompleted = workflowStages.length > 0 && workflowStages.every((s: WorkflowStage) => s.status === 'completed');

  const totalTime = workflowStages.reduce((acc: number, stage: WorkflowStage) => acc + (stage.durationMs || 0), 0);

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <h2 className="text-lg font-semibold text-white">AI Workflow</h2>
        {isAnalyzing && (
          <span className="flex items-center gap-2 text-xs font-medium text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Processing
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="relative pl-3">
          {/* Vertical connecting line */}
          <div className="absolute left-[27px] top-4 bottom-4 w-px bg-slate-800" />
          
          <div className="flex flex-col gap-4 relative">
            {workflowStages.map((stage, index) => (
              <WorkflowStageComponent key={stage.id} stage={stage} index={index} />
            ))}
          </div>
        </div>
      </div>

      {isCompleted && currentAnalysisId && (
        <div className="mt-auto pt-4 border-t border-slate-800 bg-slate-900/50 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-emerald-400">Analysis Complete</h3>
          </div>
          <div className="text-sm text-slate-300 space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-slate-500">Task detected:</span>
              <span>Land Cover Classification</span> {/* Mock data for now */}
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Total time:</span>
              <span className="font-mono">{(totalTime / 1000).toFixed(1)}s</span>
            </div>
          </div>
          <Button 
            className="w-full bg-slate-800 hover:bg-slate-700 text-white"
            onClick={() => navigate(`/results/${currentAnalysisId}`)}
          >
            View Results →
          </Button>
        </div>
      )}
    </div>
  );
}
