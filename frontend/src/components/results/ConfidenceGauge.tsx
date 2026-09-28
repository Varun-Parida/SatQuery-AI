import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ConfidenceGaugeProps {
  confidence: number;
  className?: string;
}

export function ConfidenceGauge({ confidence, className }: ConfidenceGaugeProps) {
  const [fill, setFill] = useState(0);
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      setFill(confidence);
    }, 100);
    return () => clearTimeout(timeout);
  }, [confidence]);

  const radius = 60;
  const strokeWidth = 12;
  const circumference = Math.PI * radius; 
  const dashoffset = circumference - (fill / 100) * circumference;

  const colorClass = fill >= 80 ? 'text-green-500' : fill >= 60 ? 'text-amber-500' : 'text-red-500';

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className="relative w-[160px] h-[90px] overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 160 90">
          <path
            d={`M ${strokeWidth/2},85 A ${radius},${radius} 0 0,1 ${160 - strokeWidth/2},85`}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="text-slate-800"
          />
          <motion.path
            d={`M ${strokeWidth/2},85 A ${radius},${radius} 0 0,1 ${160 - strokeWidth/2},85`}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className={colorClass}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute bottom-0 left-0 w-full flex justify-center pb-1">
          <span className="text-3xl font-bold text-slate-100">{Math.round(fill)}%</span>
        </div>
      </div>
      <span className="text-sm text-slate-400 mt-2 font-medium">Confidence Score</span>
    </div>
  );
}
