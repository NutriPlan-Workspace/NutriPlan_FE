import React, { useEffect } from 'react';

import { Button } from '@/atoms/Button';
import type { PreferredFoodType } from '@/constants/foodFilter';
import { PREFERRED_FOOD_TYPES } from '@/constants/foodFilter';
import { cn } from '@/helpers/helpers';

interface MealTypeSectionProps {
  onFilterChange: (hasFilter: boolean) => void;
  onDishTypeChange: (dishType: 'main' | 'side' | null) => void;
  onPreferredFoodTypesChange: (preferredFoodTypes: PreferredFoodType[]) => void;
  selectedDishType: 'Main Dish' | 'Side Dish' | null;
  activeMealTypes: PreferredFoodType[];
  setSelectedDishType: React.Dispatch<
    React.SetStateAction<'Main Dish' | 'Side Dish' | null>
  >;
  setActiveMealTypes: React.Dispatch<React.SetStateAction<PreferredFoodType[]>>;
}

const MealTypeSection: React.FC<MealTypeSectionProps> = ({
  onFilterChange,
  onDishTypeChange,
  onPreferredFoodTypesChange,
  setSelectedDishType,
  setActiveMealTypes,
  activeMealTypes,
  selectedDishType,
}) => {
  useEffect(() => {
    const hasAnyFilter =
      activeMealTypes.length > 0 || selectedDishType !== null;
    onFilterChange(hasAnyFilter);

    onDishTypeChange(
      selectedDishType === 'Main Dish'
        ? 'main'
        : selectedDishType === 'Side Dish'
          ? 'side'
          : null,
    );

    onPreferredFoodTypesChange(activeMealTypes);
  }, [
    activeMealTypes,
    selectedDishType,
    onFilterChange,
    onDishTypeChange,
    onPreferredFoodTypesChange,
  ]);

  const toggleMealType = (option: PreferredFoodType) => {
    setActiveMealTypes((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option],
    );
  };

  const toggleDishType = (type: 'Main Dish' | 'Side Dish') => {
    if (selectedDishType === type) {
      setSelectedDishType(null);
    } else {
      setSelectedDishType(type);
    }
  };

  return (
    <>
      <div className='mb-3 flex'>
        <Button
          onClick={() => toggleDishType('Main Dish')}
          className={cn(
            'hover:border-primary rounded-l-full rounded-r-none border-r-0',
            selectedDishType === 'Main Dish'
              ? 'bg-primary text-black'
              : 'border border-gray-300 text-gray-700',
          )}
        >
          Main Dish
        </Button>
        <Button
          onClick={() => toggleDishType('Side Dish')}
          className={cn(
            'hover:border-primary rounded-l-none rounded-r-full',
            selectedDishType === 'Side Dish'
              ? 'bg-primary text-black'
              : 'border border-gray-300 text-gray-700',
          )}
        >
          Side Dish
        </Button>
      </div>

      <div className='flex flex-wrap gap-4'>
        {PREFERRED_FOOD_TYPES.map((option) => {
          const isActive = activeMealTypes.includes(option);
          return (
            <Button
              key={option}
              onClick={() => toggleMealType(option)}
              className={cn('rounded-md border border-gray-300 text-gray-700', {
                'bg-primary border-none text-black': isActive,
              })}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </Button>
          );
        })}
      </div>
    </>
  );
};

export default MealTypeSection;
