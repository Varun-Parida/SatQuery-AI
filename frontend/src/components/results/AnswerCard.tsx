import { Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnswerCardProps {
  answer: string;
  query: string;
  className?: string;
}

export function AnswerCard({ answer, query, className }: AnswerCardProps) {
  return (
    <div className={cn("bg-slate-900/50 border border-slate-700/30 rounded-xl p-8 flex flex-col gap-6", className)}>
      <div className="flex items-center gap-3 text-cyan-400">
        <Brain className="w-6 h-6" />
        <h2 className="text-xl font-semibold">Analysis Result</h2>
      </div>
      
      <div className="border-l-2 border-cyan-500 pl-4 py-1 italic text-slate-400">
        "{query}"
      </div>
      
      <div className="text-lg leading-relaxed text-slate-100 whitespace-pre-wrap font-medium">
        {answer}
      </div>
    </div>
  );
}
