import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';

import { cn } from '@/helpers/helpers';
import { DayBoxHeader } from '@/molecules/DayBoxHeader';
import { DayBoxSummary } from '@/molecules/DayBoxSummary';
import { NutritionPopoverDay } from '@/molecules/NutritionPopoverDay';
import { DayBoxContent } from '@/organisms/DayBoxContent';
import type { MealPlanDay } from '@/types/mealPlan';
import { getTotalNutrition } from '@/utils/calculateNutrition';
import { isSameDayAsToday } from '@/utils/dateUtils';

interface DayBoxProps {
  mealPlanDay: MealPlanDay | undefined;
  mealDate: Date;
  isLoading: boolean;
  isSingleDay: boolean;
  onCreateBlank: (mealDate: string) => void;
  onCopyPreviousDay: (mealDate: string) => void;
}

const DayBox: React.FC<DayBoxProps> = ({
  mealPlanDay,
  mealDate,
  isLoading,
  isSingleDay,
  onCreateBlank,
  onCopyPreviousDay,
}) => {
  const mealItems = mealPlanDay?.mealItems || undefined;
  const allDayMealItems = useMemo(
    () =>
      mealItems
        ? [...mealItems.breakfast, ...mealItems.lunch, ...mealItems.dinner]
        : [],
    [mealItems],
  );
  const isToday = isSameDayAsToday(mealDate);
  const [isHovered, setIsHovered] = useState(false);

  const totalNutrition = useMemo(
    () => getTotalNutrition(allDayMealItems),
    [allDayMealItems],
  );

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
          <div className={cn('flex-1', { 'px-40': !allDayMealItems?.length })}>
            <DayBoxHeader
              mealDate={mealDate}
              isToday={isToday}
              isHovered={isHovered}
            />
            <DayBoxContent
              mealItems={mealItems}
              mealDate={mealDate}
              isLoading={isLoading}
              onCreateBlank={onCreateBlank}
              onCopyPreviousDay={onCopyPreviousDay}
            />
          </div>
          {allDayMealItems?.length ? (
            <div className='flex-1'>
              <div className='flex-1 pl-[60px]'>
                <NutritionPopoverDay
                  nutritionData={totalNutrition}
                  title='PERCENT CALORIES FROM'
                  isSingleDay={isSingleDay}
                />
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <>
          {/* Header */}
          <DayBoxHeader
            mealDate={mealDate}
            isToday={isToday}
            isHovered={isHovered}
          />

          {/* Motion for smooth fade-in effect */}
          <motion.div
            key={isLoading ? 'loading' : 'content'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Calories Summary */}
            <DayBoxSummary
              allDayMealItems={allDayMealItems}
              isLoading={isLoading}
            />

            {/* Meal Boxes */}
            <DayBoxContent
              mealItems={mealItems}
              mealDate={mealDate}
              isLoading={isLoading}
              onCreateBlank={onCreateBlank}
              onCopyPreviousDay={onCopyPreviousDay}
            />
          </motion.div>
        </>
      )}
    </div>
  );
};

export default React.memo(DayBox);
