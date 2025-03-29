import React, { useState } from 'react';
import { motion } from 'motion/react';

import { MealBoxContent } from '@/molecules/MealBoxContent';
import { MealBoxHeader } from '@/molecules/MealBoxHeader';
import { MealBoxSkeleton } from '@/molecules/MealBoxSkeleton';
import type { NutritionFields } from '@/types/food';
import type { MealItem, MealPlanDay } from '@/types/mealPlan';

interface MealBoxProps {
  title: string;
  calories: number;
  nutritionData: NutritionFields;
  mealItems: MealItem[];
  isLoading?: boolean;
  mealDate: Date;
  mealType: keyof MealPlanDay['mealItems'];
  onAmountChange: (
    mealDate: Date,
    mealType: keyof MealPlanDay['mealItems'],
    mealItemId: string,
    newAmount: number,
    newUnit: number,
  ) => void;
}

const MealBox: React.FC<MealBoxProps> = ({
  title,
  calories,
  nutritionData,
  mealItems,
  isLoading,
  mealDate,
  mealType,
  onAmountChange,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className='mt-1 w-full rounded-sm bg-white p-4 shadow-[0_2px_2px_0_rgba(0,0,0,0.05),_0_0_2px_0_rgba(35,31,32,0.1)] transition-all duration-200 hover:shadow-[0px_12px_12px_rgba(0,0,0,0.05),_0px_0px_12px_rgba(35,31,32,0.1)]'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Framer Motion for fade-in effect */}
      <motion.div
        key={isLoading ? 'loading' : 'content'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        {isLoading ? (
          <MealBoxSkeleton />
        ) : (
          <>
            <MealBoxHeader
              title={title}
              calories={calories}
              nutritionData={nutritionData}
              mealItems={mealItems}
              isHovered={isHovered}
            />
            <MealBoxContent
              mealItems={mealItems}
              mealDate={mealDate}
              mealType={mealType}
              onAmountChange={onAmountChange}
            />
          </>
        )}
      </motion.div>
    </div>
  );
};

export default MealBox;
