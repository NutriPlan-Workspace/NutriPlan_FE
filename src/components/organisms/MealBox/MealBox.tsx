import React, { useState } from 'react';
import { motion } from 'motion/react';

import useMealBoxDrop from '@/hooks/useMealBoxDrop';
import { MealBoxHeader } from '@/molecules/MealBoxHeader';
import { MealBoxSkeleton } from '@/molecules/MealBoxSkeleton';
import { MealBoxContent } from '@/organisms/MealBoxContent';
import type { MealItems, MealPlanDay, MealPlanFood } from '@/types/mealPlan';
import {
  getTotalCalories,
  getTotalNutrition,
} from '@/utils/calculateNutrition';

interface MealBoxProps {
  mealItems: MealPlanFood[] | undefined;
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
  const mealBoxRef = useMealBoxDrop({ mealDate, mealType, setIsHovered });

  return (
    <div
      className='mt-1 w-full rounded-sm bg-white p-4 shadow-[0_2px_2px_0_rgba(0,0,0,0.05),_0_0_2px_0_rgba(35,31,32,0.1)] transition-all duration-200 hover:shadow-[0px_12px_12px_rgba(0,0,0,0.05),_0px_0px_12px_rgba(35,31,32,0.1)]'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        key={`${isLoading}-${mealItems?.length}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        {isLoading ? (
          <MealBoxSkeleton />
        ) : (
          mealItems && (
            <>
              <MealBoxHeader
                mealType={mealType}
                calories={getTotalCalories(mealItems)}
                nutritionData={getTotalNutrition(mealItems)}
                mealItems={mealItems}
                isHovered={isHovered}
              />
              <div ref={mealBoxRef} className='rounded-lg bg-white'>
                <MealBoxContent
                  mealDate={mealDate}
                  mealType={mealType as keyof MealItems}
                  mealItems={mealItems}
                />
              </div>
            </>
          )
        )}
      </motion.div>
    </div>
  );
};

export default MealBox;
