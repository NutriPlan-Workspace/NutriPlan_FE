import React from 'react';
import {
  GiButter,
  GiForkKnifeSpoon,
  GiFruitBowl,
  GiLeafSwirl,
  GiMeat,
  GiOlive,
} from 'react-icons/gi';

import { cn } from '@/helpers/helpers';

interface PrimaryDietCardProps {
  label: string;
  excludes: string[];
  value: string;
  selectedValue: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const iconMap: Record<string, React.ReactNode> = {
  anything: <GiForkKnifeSpoon />,
  keto: <GiButter />,
  mediterranean: <GiOlive />,
  paleo: <GiMeat />,
  vegan: <GiLeafSwirl />,
  vegetarian: <GiFruitBowl />,
};

export const PrimaryDietCard: React.FC<PrimaryDietCardProps> = ({
  label,
  excludes,
  value,
  selectedValue,
  onChange,
  disabled,
}) => {
  const isSelected = selectedValue === value;

  return (
    <label
      className={cn(
        'group flex cursor-pointer items-start gap-4 rounded-3xl border p-4 transition-all duration-150 sm:p-5',
        isSelected
          ? 'border-rose-200 bg-rose-50/70 shadow-[0_18px_48px_-36px_rgba(16,24,40,0.25)]'
          : 'border-black/5 bg-white/60 hover:bg-white/80',
        disabled && 'cursor-not-allowed opacity-70',
      )}
    >
      <input
        type='radio'
        name='primaryDiet'
        value={value}
        checked={isSelected}
        onChange={() => onChange(value)}
        className='h-4 w-4 self-center accent-[#ef7a66]'
        disabled={disabled}
      />
      <div className='flex min-w-0 flex-1 items-start gap-4'>
        <div
          className={cn(
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border text-2xl transition-colors',
            isSelected
              ? 'border-rose-200 bg-white text-[#ef7a66]'
              : 'border-black/5 bg-white text-gray-600 group-hover:text-[#ef7a66]',
          )}
        >
          {iconMap[value]}
        </div>

        <div className='min-w-0'>
          <div className='flex items-center gap-2'>
            <span className='text-base font-semibold text-gray-900'>
              {label}
            </span>
            {isSelected && (
              <span className='rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-[#e86852] ring-1 ring-rose-200'>
                Selected
              </span>
            )}
          </div>
          <p className='mt-1 text-sm text-gray-600'>
            <span className='font-medium text-gray-700'>Excludes:</span>{' '}
            <span className='break-words'>{excludes.join(', ')}</span>
          </p>
        </div>
      </div>
    </label>
  );
};

export default PrimaryDietCard;
