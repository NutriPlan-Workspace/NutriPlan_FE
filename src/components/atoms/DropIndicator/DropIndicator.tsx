import React from 'react';

import { cn } from '@/helpers/helpers';

const PADDING_FOR_DROP_INDICATOR = 3; // px

interface DropIndicatorProps {
  edge: 'top' | 'bottom' | 'right' | 'left';
  mealCardHeight: number;
}

const DropIndicator: React.FC<DropIndicatorProps> = ({ mealCardHeight }) => (
  <div
    style={{
      height: mealCardHeight + PADDING_FOR_DROP_INDICATOR,
      marginTop: 8,
      marginBottom: 8,
    }}
    className={cn(
      'bg-[repeating-linear-gradient(45deg,_rgba(255,255,255,0.3)_0px,_rgba(255,255,255,0.3)_10px,_transparent_10px,_transparent_20px)]',
      'border-primary-400 border-2 border-dashed',
      'bg-primary-100 relative rounded-md',
      'pointer-events-none z-10',
      'transition-all duration-200',
    )}
  />
);

export default DropIndicator;
