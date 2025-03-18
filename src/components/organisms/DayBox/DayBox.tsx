import React, { useState } from 'react';

import { DayBoxHeader } from '@/molecules/DayBoxHeader';
import { DayBoxMeals } from '@/molecules/DayBoxMeals';
import { DayBoxSummary } from '@/molecules/DayBoxSummary';
import type { MealPlanDay } from '@/types/mealPlan';
import { isSameDayAsToday } from '@/utils/day';

interface DayBoxProps {
  mealPlanDay: MealPlanDay;
  isLoading: boolean;
}

const DayBox: React.FC<DayBoxProps> = ({ mealPlanDay, isLoading }) => {
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
      {/* Header */}
      <DayBoxHeader
        mealDate={mealDate}
        isToday={isToday}
        isHovered={isHovered}
      />

      {/* Calories Summary */}
      <DayBoxSummary allDayMealItems={allDayMealItems} isLoading={isLoading} />

      {/* Meal Boxes */}
      <DayBoxMeals mealItems={mealItems} isLoading={isLoading} />
    </div>
  );
};

export default DayBox;
