import React, { useState } from 'react';
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
  onCreateBlank: (mealDate: string) => Promise<void>;
  onCopyPreviousDay: (mealDate: string) => Promise<void>;
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
  const allDayMealItems = mealItems
    ? [...mealItems.breakfast, ...mealItems.lunch, ...mealItems.dinner]
    : undefined;
  const isToday = isSameDayAsToday(mealDate);
  const [isHovered, setIsHovered] = useState(false);

  const totalNutrition = allDayMealItems
    ? getTotalNutrition(allDayMealItems)
    : undefined;

  return (
    <div
      className={cn(
        'border-l-borderGray border-t-borderGray mb-3 border-t-[4px] border-l-[1px] p-5',
        {
          'border-t-primary': isToday,
        },
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isSingleDay ? (
        <div
          className={cn('flex w-full justify-end', {
            'justify-center': !mealItems || !allDayMealItems?.length,
          })}
        >
          <div className='max-w-[450px] flex-1 px-4'>
            <DayBoxHeader
              mealDate={mealDate}
              isToday={isToday}
              isHovered={isHovered}
              isLoading={isLoading}
            />
            <DayBoxContent
              mealItems={mealItems}
              mealDate={mealDate}
              isLoading={isLoading}
              onCreateBlank={onCreateBlank}
              onCopyPreviousDay={onCopyPreviousDay}
            />
          </div>
          {Boolean(allDayMealItems?.length) && (
            <div className='max-w-[450px] flex-1 px-4'>
              <NutritionPopoverDay
                nutritionData={totalNutrition}
                title='PERCENT CALORIES FROM'
                isSingleDay={isSingleDay}
              />
            </div>
          )}
        </div>
      ) : (
        <>
          <DayBoxHeader
            mealDate={mealDate}
            isToday={isToday}
            isHovered={isHovered}
            isLoading={isLoading}
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

export default DayBox;
