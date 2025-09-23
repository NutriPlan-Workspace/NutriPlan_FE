import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '@/redux/store';
import type { MealPlanDay, MealPlanWithDate } from '@/types/mealPlan';

// Base selectors
export const selectMealPlanState = (state: RootState) => state.mealPlan;
export const selectViewingMealPlans = (state: RootState) =>
  state.mealPlan.viewingMealPlans;

// Helper: find mealPlan by exact ISO date string (yyyy-MM-dd) or Date
const normalizeDate = (d: string | Date) =>
  typeof d === 'string' ? new Date(d) : d;

export const makeSelectMealPlanByDate = () =>
  createSelector(
    [
      selectViewingMealPlans,
      (_: RootState, mealDate: string | Date) => mealDate,
    ],
    (mealPlans: MealPlanWithDate[], mealDate) => {
      const target = normalizeDate(mealDate);
      return mealPlans.find(
        (mp) => new Date(mp.mealDate).toDateString() === target.toDateString(),
      );
    },
  );

export const makeSelectMealItemsByDateAndType = () =>
  createSelector(
    [
      makeSelectMealPlanByDate(),
      (
        _: RootState,
        __: string | Date,
        mealType: keyof MealPlanDay['mealItems'],
      ) => mealType,
    ],
    (mealPlan, mealType) => {
      if (!mealPlan?.mealPlanDay)
        return [] as MealPlanDay['mealItems'][keyof MealPlanDay['mealItems']];
      return mealPlan.mealPlanDay.mealItems[mealType] || [];
    },
  );

export const makeSelectTotalNutritionByDate = () =>
  createSelector([makeSelectMealPlanByDate()], (mealPlan) => {
    if (!mealPlan?.mealPlanDay)
      return { calories: 0, proteins: 0, carbs: 0, fats: 0 };
    // If you have a utility to compute total, plug it here.
    // Placeholder returns zeros to keep types consistent.
    return { calories: 0, proteins: 0, carbs: 0, fats: 0 };
  });
