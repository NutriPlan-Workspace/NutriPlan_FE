import React from 'react';

import { Button } from '@/atoms/Button';
import { cn } from '@/helpers/helpers';

const nutritionOptions = [
  'High Protein',
  'Low Carb',
  'Low Fat',
  'High Fiber',
  'Low Sodium',
];

interface NutritionFocusSectionProps {
  activeOptions: string[];
  setActiveOptions: React.Dispatch<React.SetStateAction<string[]>>;
  onFilterChange: (hasFilter: boolean) => void;
}

const NutritionFocusSection: React.FC<NutritionFocusSectionProps> = ({
  activeOptions,
  setActiveOptions,
  onFilterChange,
}) => {
  const toggleOption = (option: string) => {
    setActiveOptions((prev) => {
      const updatedOptions = prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option];
      onFilterChange(updatedOptions.length > 0);

      return updatedOptions;
    });
  };
  return (
    <div className='flex flex-wrap gap-4'>
      {nutritionOptions.map((option) => {
        const isActive = activeOptions.includes(option);
        return (
          <Button
            key={option}
            onClick={() => toggleOption(option)}
            className={cn('rounded-md border border-gray-300 text-gray-700', {
              'bg-primary border-transparentn hover:border-primary text-black':
                isActive,
            })}
          >
            {option}
          </Button>
        );
      })}
    </div>
  );
};

export default NutritionFocusSection;
