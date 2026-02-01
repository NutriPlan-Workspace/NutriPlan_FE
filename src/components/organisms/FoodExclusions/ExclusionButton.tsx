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
        ? 'cursor-not-allowed border-[#e86852]/30 bg-[#e86852]/10 text-[#e86852]/60'
        : isActive
          ? 'border-[#e86852] bg-[#e86852] text-white shadow-sm'
          : 'border-gray-300 bg-white text-gray-600 hover:border-[#e86852]/30 hover:bg-[#e86852]/5 hover:text-[#e86852]',
    )}
  >
    {item.label}
  </button>
);

export default ExclusionButton;
