import React, { useState } from 'react';
import { motion } from 'motion/react';

import { cn } from '@/helpers/helpers';
import { DayBoxHeader } from '@/molecules/DayBoxHeader';
import { DayBoxMeals } from '@/molecules/DayBoxMeals';
import { DayBoxSummary } from '@/molecules/DayBoxSummary';
import { NutritionPopoverDay } from '@/molecules/NutritionPopoverDay';
import type { MealPlanDay } from '@/types/mealPlan';
import { getTotalNutrition } from '@/utils/calculateNutrition';
import { isSameDayAsToday } from '@/utils/day';

interface DayBoxProps {
  mealPlanDay: MealPlanDay;
  isLoading: boolean;
  isSingleDay: boolean;
}

const DayBox: React.FC<DayBoxProps> = ({
  mealPlanDay,
  isLoading,
  isSingleDay,
}) => {
  const { mealDate, mealItems } = mealPlanDay;
  const allDayMealItems = [
    ...mealItems.breakfast,
    ...mealItems.lunch,
    ...mealItems.dinner,
  ];
  const isToday = isSameDayAsToday(mealDate);

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`border-l-borderGray border-t-[4px] border-l-[1px] p-5 ${
        isToday ? 'border-t-primary' : 'border-t-borderGray'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isSingleDay ? (
        <div className='flex pl-[160px]'>
          <div className={cn('flex-1', { 'px-40': !allDayMealItems.length })}>
            <DayBoxHeader
              mealDate={mealDate}
              isToday={isToday}
              isHovered={isHovered}
            />
            <motion.div
              key={isLoading ? 'loading' : 'content'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <DayBoxMeals
                allDayMealItems={allDayMealItems}
                mealItems={mealItems}
                mealDate={mealDate}
                isLoading={isLoading}
              />
            </motion.div>
          </div>
          {allDayMealItems.length ? (
            <div className='flex-1'>
              <div className='flex-1 pl-[60px]'>
                <NutritionPopoverDay
                  nutritionData={getTotalNutrition(allDayMealItems)}
                  title='PERCENT CALORIES FROM'
                  isSingleDay={isSingleDay}
                />
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <div>
          <DayBoxHeader
            mealDate={mealDate}
            isToday={isToday}
            isHovered={isHovered}
          />
          <motion.div
            key={isLoading ? 'loading' : 'content'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <DayBoxSummary
              allDayMealItems={allDayMealItems}
              isLoading={isLoading}
            />
            <DayBoxMeals
              allDayMealItems={allDayMealItems}
              mealItems={mealItems}
              mealDate={mealDate}
              isLoading={isLoading}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default DayBox;
