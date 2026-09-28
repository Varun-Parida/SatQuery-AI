import type { BoundingBox } from '@/types';

interface BoundingBoxOverlayProps {
  boundingBoxes: BoundingBox[];
  imageWidth: number;
  imageHeight: number;
  visible?: boolean;
}

export default function BoundingBoxOverlay({ boundingBoxes, imageWidth, imageHeight, visible = true }: BoundingBoxOverlayProps) {
  if (!visible || !boundingBoxes.length) return null;

  return (
    <svg 
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox={`0 0 ${imageWidth} ${imageHeight}`}
      preserveAspectRatio="none"
    >
      {boundingBoxes.map((box, idx) => {
        const color = box.color || '#06b6d4'; // Default to cyan-500

        return (
          <g key={box.id || idx} className="group pointer-events-auto cursor-help">
            <rect
              x={box.x}
              y={box.y}
              width={box.width}
              height={box.height}
              fill="transparent"
              stroke={color}
              strokeWidth={Math.max(2, imageWidth * 0.002)}
              className="transition-all duration-200 group-hover:stroke-[3px]"
            />
            {/* Label Background */}
            <rect
              x={box.x}
              y={box.y - (imageHeight * 0.03)}
              width={(box.label.length * (imageWidth * 0.008)) + (box.confidence ? (imageWidth * 0.015) : 0)}
              height={imageHeight * 0.03}
              fill={color}
              className="opacity-90"
            />
            {/* Label Text */}
            <text
              x={box.x + (imageWidth * 0.002)}
              y={box.y - (imageHeight * 0.008)}
              fill="#020617"
              fontSize={imageHeight * 0.018}
              fontFamily="sans-serif"
              fontWeight="bold"
            >
              {box.label} {box.confidence ? `${Math.round(box.confidence * 100)}%` : ''}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
