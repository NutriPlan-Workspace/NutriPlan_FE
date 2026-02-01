import React from 'react';

import { cn } from '@/helpers/helpers';

const PADDING_FOR_DROP_INDICATOR = 3; // px

interface DropIndicatorProps {
  edge: 'top' | 'bottom' | 'right' | 'left';
  mealCardHeight: number;
  variant?: 'primary' | 'warning';
  className?: string;
  style?: React.CSSProperties;
}

const DropIndicator: React.FC<DropIndicatorProps> = ({
  mealCardHeight,
  variant = 'primary',
  className,
  style,
}) => (
  <div
    style={{
      height: mealCardHeight + PADDING_FOR_DROP_INDICATOR,
      marginTop: 8,
      marginBottom: 8,
      ...style,
    }}
    className={cn(
      'bg-[repeating-linear-gradient(45deg,_rgba(255,255,255,0.3)_0px,_rgba(255,255,255,0.3)_10px,_transparent_10px,_transparent_20px)]',
      'border-2 border-dashed',
      'relative rounded-md',
      'pointer-events-none z-10',
      'transition-all duration-200',
      variant === 'warning'
        ? 'border-amber-300 bg-amber-50'
        : 'border-primary-400 bg-primary-100',
      className,
    )}
  />
);

export default DropIndicator;
