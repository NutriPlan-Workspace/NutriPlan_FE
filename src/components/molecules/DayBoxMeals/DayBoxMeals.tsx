import React from 'react';

import type { MealPlanDay } from '@/types/mealPlan';

interface DayBoxMealsProps {
  mealItems: MealPlanDay['mealItems'];
  isLoading: boolean;
}

const DayBoxMeals: React.FC<DayBoxMealsProps> = ({ mealItems, isLoading }) => {
  const allDayMealItems = [
    ...mealItems.breakfast,
    ...mealItems.lunch,
    ...mealItems.dinner,
  ];

  return (
    <div className='flex flex-col gap-[4px]'>
      {/* TODO: Implement MealBox and EmptyMealDay component */}
      {allDayMealItems.length !== 0 || isLoading ? <></> : <></>}
    </div>
  );
};

export default DayBoxMeals;
