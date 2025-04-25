import React from 'react';

import { cn } from '@/helpers/helpers';

interface ExclusionButtonProps {
  item: { label: string; value: number };
  disabled: boolean;
  isActive: boolean;
  onToggle: (value: number) => void;
}

const ExclusionButton: React.FC<ExclusionButtonProps> = ({
  item,
  disabled,
  isActive,
  onToggle,
}) => (
  <button
    disabled={disabled}
    onClick={() => onToggle(item.value)}
    className={cn(
      'rounded-sm border px-3.5 py-1.5 text-sm transition-all',
      disabled
        ? 'cursor-not-allowed border-gray-300 bg-cyan-700 text-white opacity-50'
        : isActive
          ? 'border-gray-500 bg-cyan-700 text-white'
          : 'border-gray-500 bg-white text-gray-500 hover:bg-blue-100',
    )}
  >
    {item.label}
  </button>
);

export default ExclusionButton;
