import React from 'react';

import { EmptyMealDay } from '@/molecules/EmptyMealDay';
import { MealBox } from '@/organisms/MealBox';
import type { MealPlanDay } from '@/types/mealPlan';
import {
  getTotalCalories,
  getTotalNutrition,
} from '@/utils/calculateNutrition';
import { getDayOfWeek } from '@/utils/day';

interface DayBoxMealsProps {
  mealItems: MealPlanDay['mealItems'];
  mealDate: Date;
  isLoading: boolean;
}

const DayBoxMeals: React.FC<DayBoxMealsProps> = ({
  mealItems,
  mealDate,
  isLoading,
}) => {
  const allDayMealItems = [
    ...mealItems.breakfast,
    ...mealItems.lunch,
    ...mealItems.dinner,
  ];

  return (
    <div className='flex flex-col gap-2 pt-2'>
      {allDayMealItems.length !== 0 || isLoading ? (
        <>
          <MealBox
            title='Breakfast'
            calories={getTotalCalories(mealItems.breakfast)}
            nutritionData={getTotalNutrition(mealItems.breakfast)}
            mealItems={mealItems.breakfast}
            isLoading={isLoading}
          />
          <MealBox
            title='Lunch'
            calories={getTotalCalories(mealItems.lunch)}
            nutritionData={getTotalNutrition(mealItems.lunch)}
            mealItems={mealItems.lunch}
            isLoading={isLoading}
          />
          <MealBox
            title='Dinner'
            calories={getTotalCalories(mealItems.dinner)}
            nutritionData={getTotalNutrition(mealItems.dinner)}
            mealItems={mealItems.dinner}
            isLoading={isLoading}
          />
        </>
      ) : (
        <EmptyMealDay dayOfWeek={getDayOfWeek(mealDate)} />
      )}
    </div>
  );
};

export default DayBoxMeals;
