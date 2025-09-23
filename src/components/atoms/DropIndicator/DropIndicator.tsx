import React from 'react';

import { cn } from '@/helpers/helpers';

const PADDING_FOR_DROP_INDICATOR = 3; // px

interface DropIndicatorProps {
  edge: 'top' | 'bottom' | 'right' | 'left';
  mealCardHeight: number;
}

const DropIndicator: React.FC<DropIndicatorProps> = ({
  edge,
  mealCardHeight,
}) => {
  const edgeStyles: Record<string, string> = {
    top: 'top-0 left-0 w-full',
    bottom: 'bottom-0 left-0 w-full',
    right: '',
    left: '',
  };

  return (
    <div
      style={{
        height: mealCardHeight + PADDING_FOR_DROP_INDICATOR,
        marginTop: 8,
        marginBottom: 8,
      }}
      className={cn(
        'bg-[repeating-linear-gradient(45deg,_rgba(255,255,255,0.3)_0px,_rgba(255,255,255,0.3)_10px,_transparent_10px,_transparent_20px)]',
        'border-2 border-dashed border-[#FFC84E]',
        'bg-primary-100 relative rounded-md',
        'pointer-events-none z-10',
        'transition-all duration-200',
        edgeStyles[edge] || '',
      )}
    />
  );
};

export default DropIndicator;
