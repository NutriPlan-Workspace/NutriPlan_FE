import React from 'react';

import { EmptyMealDay } from '@/molecules/EmptyMealDay';
import { MealBoxSkeleton } from '@/molecules/MealBoxSkeleton';
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
    {isLoading ? (
      <div className='space-y-2'>
        <div className='w-full rounded-2xl border border-white/70 bg-white/80 p-4 shadow-[0_8px_18px_-12px_rgba(15,23,42,0.35),_0_2px_4px_rgba(15,23,42,0.06)]'>
          <MealBoxSkeleton />
        </div>
        <div className='w-full rounded-2xl border border-white/70 bg-white/80 p-4 shadow-[0_8px_18px_-12px_rgba(15,23,42,0.35),_0_2px_4px_rgba(15,23,42,0.06)]'>
          <MealBoxSkeleton />
        </div>
        <div className='w-full rounded-2xl border border-white/70 bg-white/80 p-4 shadow-[0_8px_18px_-12px_rgba(15,23,42,0.35),_0_2px_4px_rgba(15,23,42,0.06)]'>
          <MealBoxSkeleton />
        </div>
      </div>
    ) : mealItems ? (
      <div>
        <MealBox
          mealDate={getMealDate(mealDate)}
          mealType='breakfast'
          mealItems={mealItems?.breakfast ?? []}
        />
        <MealBox
          mealDate={getMealDate(mealDate)}
          mealType='lunch'
          mealItems={mealItems?.lunch ?? []}
        />
        <MealBox
          mealDate={getMealDate(mealDate)}
          mealType='dinner'
          mealItems={mealItems?.dinner ?? []}
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
