import React from 'react';

import { cn } from '@/helpers/helpers';

interface DropIndicatorProps {
  edge: 'top' | 'bottom' | 'right' | 'left';
  mealCardHeight: number | null;
}

const DropIndicator: React.FC<DropIndicatorProps> = ({
  edge,
  mealCardHeight,
}) => {
  const getEdgeStyle = () => {
    switch (edge) {
      case 'top':
        return 'top-0';
      case 'bottom':
        return 'bottom-[-5px]';
      default:
        return '';
    }
  };
  return (
    <div
      style={{ height: mealCardHeight ?? '0' }}
      className={cn(getEdgeStyle(), 'absolute w-full bg-red-300')}
    ></div>
  );
};

export default DropIndicator;
