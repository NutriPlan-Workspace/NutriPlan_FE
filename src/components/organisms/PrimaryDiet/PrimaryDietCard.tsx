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
        `flex cursor-pointer items-center gap-4 border-b-1 border-b-gray-400 p-4 transition-all duration-150`,
        isSelected
          ? 'border-cyan-600 bg-blue-50'
          : 'border-gray-200 bg-white hover:bg-gray-50',
      )}
    >
      <input
        type='radio'
        name='primaryDiet'
        value={value}
        checked={isSelected}
        onChange={() => onChange(value)}
        className='h-4 w-4 accent-cyan-600'
        disabled={disabled}
      />
      <span className='text-4xl text-gray-600'>{iconMap[value]}</span>
      <div className='flex flex-col gap-1'>
        <div className='flex items-center gap-2'>
          <span className='text-base font-semibold text-gray-900'>{label}</span>
        </div>
        <p className='text-sm text-gray-600'>
          <span className='font-medium'>Excludes:</span> {excludes.join(', ')}
        </p>
      </div>
    </label>
  );
};

export default PrimaryDietCard;
