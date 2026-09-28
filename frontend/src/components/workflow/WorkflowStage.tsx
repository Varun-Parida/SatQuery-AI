import type { WorkflowStage } from '@/types';
import { CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface WorkflowStageProps {
  stage: WorkflowStage;
  index: number;
}

export default function WorkflowStageComponent({ stage, index: _index }: WorkflowStageProps) {
  const isPending = stage.status === 'pending';
  const isRunning = stage.status === 'running';
  const isCompleted = stage.status === 'completed';
  const isError = stage.status === 'error';

  return (
    <div className="flex gap-4 items-start relative bg-slate-900/40 p-3 rounded-lg border border-transparent hover:border-slate-800 transition-colors">
      <div className="relative mt-1 shrink-0 z-10 bg-slate-900">
        {isPending && (
          <div className="w-6 h-6 rounded-full border-2 border-slate-600 bg-slate-900" />
        )}
        {isRunning && (
          <div className="w-6 h-6 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
        )}
        {isCompleted && (
          <CheckCircle className="w-6 h-6 text-emerald-400 bg-slate-900" />
        )}
        {isError && (
          <XCircle className="w-6 h-6 text-red-400 bg-slate-900" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <h4 className={cn(
            "text-sm",
            isRunning ? "font-bold text-cyan-400" : 
            isCompleted ? "font-medium text-slate-200" :
            isError ? "font-medium text-red-400" : "text-slate-500"
          )}>
            {stage.name}
          </h4>
          {isCompleted && stage.durationMs && (
            <span className="text-[10px] text-slate-500 font-mono shrink-0">
              {stage.durationMs}ms
            </span>
          )}
        </div>

        <AnimatePresence>
          {(isRunning || isCompleted || isError) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <p className="text-xs text-slate-400 mt-1 pr-2">
                {stage.description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
