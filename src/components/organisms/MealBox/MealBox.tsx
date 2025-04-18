import React, { useState } from 'react';

import { MealBoxHeader } from '@/molecules/MealBoxHeader';
import { MealBoxSkeleton } from '@/molecules/MealBoxSkeleton';
import { MealBoxContent } from '@/organisms/MealBoxContent';
import type { MealItems, MealPlanDay, MealPlanFood } from '@/types/mealPlan';
import {
  getTotalCalories,
  getTotalNutrition,
} from '@/utils/calculateNutrition';

interface MealBoxProps {
  mealItems: MealPlanFood[];
  isLoading?: boolean;
  mealDate: string;
  mealType: keyof MealPlanDay['mealItems'];
}

const MealBox: React.FC<MealBoxProps> = ({
  mealItems,
  isLoading,
  mealDate,
  mealType,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className='mt-1 w-full rounded-sm bg-white p-4 shadow-[0_2px_2px_0_rgba(0,0,0,0.05),_0_0_2px_0_rgba(35,31,32,0.1)] transition-all duration-200 hover:shadow-[0px_12px_12px_rgba(0,0,0,0.05),_0px_0px_12px_rgba(35,31,32,0.1)]'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isLoading ? (
        <MealBoxSkeleton />
      ) : (
        <div>
          <MealBoxHeader
            mealType={mealType}
            calories={getTotalCalories(mealItems)}
            nutritionData={getTotalNutrition(mealItems)}
            mealItems={mealItems}
            isHovered={isHovered}
          />
          <div className='rounded-lg bg-white'>
            <MealBoxContent
              mealDate={mealDate}
              mealType={mealType as keyof MealItems}
              mealItems={mealItems}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MealBox;
