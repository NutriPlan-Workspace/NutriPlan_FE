import React, { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { AnimatePresence, motion } from 'framer-motion';

import { Button } from '@/atoms/Button';
import { RangeSlider } from '@/atoms/RangeSlider';
import type { FoodFilterQuery } from '@/types/foodFilterQuery';

const nutritionPerServingOptions = [
  { key: 'Calories', max: 1000, color: '#F87171' },
  { key: 'Carbs', max: 300, color: '#60A5FA' },
  { key: 'Protein', max: 200, color: '#34D399' },
  { key: 'Fat', max: 150, color: '#FBBF24' },
  { key: 'Fiber', max: 100, color: '#A78BFA' },
  { key: 'Sugar', max: 100, color: '#F472B6' },
  { key: 'Sodium', max: 5000, color: '#38BDF8' },
];

const filterKeysMap: Record<
  string,
  { min: keyof FoodFilterQuery; max: keyof FoodFilterQuery }
> = {
  Calories: { min: 'minCalories', max: 'maxCalories' },
  Carbs: { min: 'minCarbs', max: 'maxCarbs' },
  Protein: { min: 'minProteins', max: 'maxProteins' },
  Fat: { min: 'minFats', max: 'maxFats' },
  Fiber: { min: 'minFiber', max: 'maxFiber' },
  Sugar: { min: 'minSugar', max: 'maxSugar' },
  Sodium: { min: 'minSodium', max: 'maxSodium' },
};

interface NutritionPerServingSectionProps {
  onFilterChange: (filters: Partial<FoodFilterQuery>) => void;
  resetTrigger: boolean;
  isFilterCollection?: boolean;
}

const NutritionPerServingSection: React.FC<NutritionPerServingSectionProps> = ({
  onFilterChange,
  resetTrigger,
  isFilterCollection = false,
}) => {
  const [activeSliders, setActiveSliders] = useState<
    Record<string, { from: number; to: number }>
  >({});

  useEffect(() => {
    const filters: Partial<FoodFilterQuery> = {};

    for (const [key, value] of Object.entries(activeSliders)) {
      const map = filterKeysMap[key];
      if (map) {
        (filters[map.min] as number) = value.from;
        (filters[map.max] as number) = value.to;
      }
    }
    onFilterChange(filters);
  }, [activeSliders, onFilterChange]);

  useEffect(() => {
    if (resetTrigger) {
      setActiveSliders({});
      onFilterChange({});
    }
  }, [resetTrigger, onFilterChange]);

  const handleAddSlider = (key: string, max: number) => {
    setActiveSliders((prev) => ({
      ...prev,
      [key]: { from: 0, to: max },
    }));
  };

  const handleRemoveSlider = (key: string) => {
    setActiveSliders((prev) => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });
  };

  const handleSliderChange = (
    key: string,
    value: { from: number; to: number },
  ) => {
    setActiveSliders((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className='flex flex-col gap-4'>
      <AnimatePresence>
        {Object.entries(activeSliders).map(([key, value]) => {
          const item = nutritionPerServingOptions.find(
            (opt) => opt.key === key,
          );
          if (!item) return null;

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: 0.2, ease: 'easeInOut' } }}
              layout
              layoutId={key}
              className='relative overflow-hidden rounded-md border border-gray-200 p-4'
            >
              <button
                className='absolute top-2 right-2 text-gray-400 hover:text-red-500'
                onClick={() => handleRemoveSlider(key)}
              >
                <IoClose size={18} />
              </button>
              <RangeSlider
                title={key}
                color={item.color}
                value={value}
                maxValue={item.max}
                onChange={(val) => handleSliderChange(key, val)}
                isFilterCollection={isFilterCollection}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>

      <div className='flex flex-wrap gap-4'>
        {nutritionPerServingOptions
          .filter((item) => !(item.key in activeSliders))
          .map((item) => (
            <Button
              key={item.key}
              className='rounded-md border border-gray-300 text-sm'
              onClick={() => handleAddSlider(item.key, item.max)}
            >
              {item.key}
            </Button>
          ))}
      </div>
    </div>
  );
};

export default NutritionPerServingSection;
