import { Timer } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ModelInfo } from '@/types';

interface ModelCardProps {
  model: ModelInfo;
  className?: string;
}

export function ModelCard({ model, className }: ModelCardProps) {
  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const getModelDisplayName = (name: string) => {
    const nameMap: Record<string, string> = {
      geochat: 'GeoChat',
      grounding_dino: 'Grounding DINO',
      changeformer: 'ChangeFormer',
    };
    return nameMap[name] ?? name;
  };

  const colorClass = model.name === 'grounding_dino' ? 'bg-purple-500' 
    : model.name === 'changeformer' ? 'bg-amber-500' 
    : 'bg-cyan-500';

  return (
    <div className={cn("bg-slate-800/50 border border-slate-700/30 rounded-lg p-4 flex flex-col gap-2 relative overflow-hidden", className)}>
      <div className={cn("absolute top-0 left-0 w-1 h-full", colorClass)} />
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-slate-200">{getModelDisplayName(model.name)}</h3>
          <p className="text-sm text-slate-400 mt-0.5">{model.role}</p>
        </div>
        {model.confidence !== undefined && (
          <div className="text-xs font-medium px-2 py-1 bg-slate-900/80 rounded-md border border-slate-700/50 text-slate-300">
            {model.confidence}%
          </div>
        )}
      </div>
      
      {model.executionTimeMs !== undefined && (
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2 font-mono">
          <Timer className="w-3.5 h-3.5" />
          <span>{formatDuration(model.executionTimeMs)}</span>
        </div>
      )}
    </div>
  );
}

