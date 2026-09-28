import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ExecutionTrace } from '@/types';

interface ExecutionTimelineProps {
  trace: ExecutionTrace;
  className?: string;
}

export function ExecutionTimeline({ trace, className }: ExecutionTimelineProps) {
  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Execution Trace</h3>
      
      <div className="relative pl-6 space-y-6">
        {/* Vertical line */}
        <div className="absolute top-2 left-[11px] w-[2px] h-[calc(100%-16px)] bg-slate-800" />
        
        {trace.stages.map((stage, index) => (
          <div key={index} className="relative flex items-start gap-4">
            <div className="absolute -left-6 top-0.5 bg-slate-900 rounded-full">
              {stage.status === 'error' ? (
                <XCircle className="w-5 h-5 text-red-500" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
            </div>
            
            <div className="flex-1 flex justify-between items-start pt-0.5">
              <div>
                <p className={cn("text-sm font-medium", stage.status === 'error' ? 'text-red-400' : 'text-slate-200')}>
                  {stage.name}
                </p>
                {stage.startedAt && (
                  <p className="text-xs text-slate-500 mt-1">{new Date(stage.startedAt).toLocaleTimeString()}</p>
                )}
              </div>
              
              {stage.durationMs !== undefined && (
                <div className="text-xs font-mono text-slate-400 bg-slate-800/50 px-2 py-1 rounded">
                  {formatDuration(stage.durationMs)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {trace.totalDurationMs !== undefined && (
        <div className="mt-2 pt-4 border-t border-slate-800 flex justify-between items-center text-sm">
          <span className="text-slate-400">Total Execution Time</span>
          <span className="font-mono font-medium text-cyan-400">{formatDuration(trace.totalDurationMs)}</span>
        </div>
      )}
    </div>
  );
}
