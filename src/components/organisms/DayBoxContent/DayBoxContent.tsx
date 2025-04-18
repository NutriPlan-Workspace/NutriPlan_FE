import React from 'react';

import { EmptyMealDay } from '@/molecules/EmptyMealDay';
import { MealBox } from '@/organisms/MealBox';
import type { MealItems } from '@/types/mealPlan';
import { getMealDate } from '@/utils/dateUtils';

interface DayBoxContentProps {
  mealItems: MealItems | undefined;
  mealDate: Date;
  isLoading: boolean;
  onCreateBlank: (mealDate: string) => Promise<void>;
  onCopyPreviousDay: (mealDate: string) => Promise<void>;
}

const DayBoxContent: React.FC<DayBoxContentProps> = ({
  mealItems,
  mealDate,
  isLoading,
  onCreateBlank,
  onCopyPreviousDay,
}) => (
  <div className='flex flex-col gap-2 pt-2'>
    {mealItems || isLoading ? (
      <div>
        <MealBox
          mealDate={getMealDate(mealDate)}
          mealType='breakfast'
          mealItems={mealItems?.breakfast}
          isLoading={isLoading}
        />
        <MealBox
          mealDate={getMealDate(mealDate)}
          mealType='lunch'
          mealItems={mealItems?.lunch}
          isLoading={isLoading}
        />
        <MealBox
          mealDate={getMealDate(mealDate)}
          mealType='dinner'
          mealItems={mealItems?.dinner}
          isLoading={isLoading}
        />
      </div>
    ) : (
      <EmptyMealDay
        mealDate={getMealDate(mealDate)}
        onCreateBlank={onCreateBlank}
        onCopyPreviousDay={onCopyPreviousDay}
      />
    )}
  </div>
);

export default DayBoxContent;
