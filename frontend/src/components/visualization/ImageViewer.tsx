import { useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import type { BoundingBox } from '@/types';
import BoundingBoxOverlay from './BoundingBoxOverlay';
import { ZoomIn, ZoomOut, Maximize, Map as MapIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageViewerProps {
  imageUrl?: string;
  boundingBoxes?: BoundingBox[];
  className?: string;
}

export default function ImageViewer({ imageUrl, boundingBoxes = [], className }: ImageViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const minScale = 0.25;
  const maxScale = 5;

  const handleWheel = (e: React.WheelEvent) => {
    if (!imageUrl) return;
    e.preventDefault();
    
    const scaleFactor = -e.deltaY * 0.001;
    let newScale = scale * (1 + scaleFactor);
    newScale = Math.max(minScale, Math.min(newScale, maxScale));
    
    setScale(newScale);
  };

  const handleMouseDown = (e: MouseEvent) => {
    if (scale <= 1 || !imageUrl) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const zoomIn = () => setScale(s => Math.min(s * 1.2, maxScale));
  const zoomOut = () => setScale(s => Math.max(s / 1.2, minScale));

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setImageSize({
      width: e.currentTarget.naturalWidth,
      height: e.currentTarget.naturalHeight
    });
  };

  if (!imageUrl) {
    return (
      <div className={cn("w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-500", className)}>
        <MapIcon className="w-16 h-16 mb-4 opacity-20" />
        <p className="text-sm">Upload an image to begin analysis</p>
      </div>
    );
  }

  return (
    <div 
      className={cn("relative w-full h-full bg-slate-950 overflow-hidden select-none", className)}
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Toolbar */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 bg-slate-900/80 backdrop-blur-sm p-2 rounded-lg border border-slate-700/50 shadow-xl">
        <button onClick={zoomIn} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors" title="Zoom In">
          <ZoomIn className="w-4 h-4" />
        </button>
        <button onClick={zoomOut} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors" title="Zoom Out">
          <ZoomOut className="w-4 h-4" />
        </button>
        <button onClick={resetView} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors" title="Reset View">
          <Maximize className="w-4 h-4" />
        </button>
        <div className="text-[10px] text-center font-mono text-slate-400 pt-1 border-t border-slate-700/50 mt-1">
          {Math.round(scale * 100)}%
        </div>
      </div>

      <div 
        className={cn(
          "w-full h-full flex items-center justify-center transition-transform duration-100 origin-center",
          isDragging ? "cursor-grabbing" : scale > 1 ? "cursor-grab" : "cursor-default"
        )}
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`
        }}
      >
        <div className="relative inline-block">
          <img 
            ref={imageRef}
            src={imageUrl} 
            alt="Satellite analysis" 
            className="max-w-full max-h-full object-contain"
            onLoad={handleImageLoad}
            draggable={false}
          />
          {boundingBoxes.length > 0 && imageSize.width > 0 && (
            <BoundingBoxOverlay 
              boundingBoxes={boundingBoxes}
              imageWidth={imageSize.width}
              imageHeight={imageSize.height}
              visible={true}
            />
          )}
        </div>
      </div>
    </div>
  );
}
