import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { MealPlanWithDate } from '@/types/mealPlan';
import { isSameDay } from '@/utils/dateUtils';

export type MealPlanState = {
  cacheMealPlans: MealPlanWithDate[];
  viewingMealPlans: MealPlanWithDate[];
  draggingCardHeight: number;
};

export const mealPlanInitialState: MealPlanState = {
  cacheMealPlans: [],
  viewingMealPlans: [],
  draggingCardHeight: 0,
};

const mealPlanSlice = createSlice({
  name: 'mealPlan',
  initialState: mealPlanInitialState,
  reducers: {
    setViewingMealPlans: (
      state,
      action: PayloadAction<{ mealPlanWithDates: MealPlanWithDate[] }>,
    ) => {
      state.viewingMealPlans = action.payload.mealPlanWithDates;
    },
    updateViewingMealPlanByIndex: (
      state,
      action: PayloadAction<{
        mealPlanWithDate: MealPlanWithDate;
        index: number;
      }>,
    ) => {
      state.viewingMealPlans[action.payload.index] =
        action.payload.mealPlanWithDate;
    },
    updateViewingMealPlanByDate: (
      state,
      action: PayloadAction<{ mealPlanWithDate: MealPlanWithDate }>,
    ) => {
      const index = state.viewingMealPlans.findIndex((mealPlan) =>
        isSameDay(
          new Date(mealPlan.mealDate),
          new Date(action.payload.mealPlanWithDate.mealDate),
        ),
      );
      state.viewingMealPlans[index] = action.payload.mealPlanWithDate;
    },
    updateViewingMealPlanByDates: (
      state,
      action: PayloadAction<{ mealPlanWithDates: MealPlanWithDate[] }>,
    ) => {
      action.payload.mealPlanWithDates.forEach((mealPlan) => {
        const index = state.viewingMealPlans.findIndex((viewingMealPlan) =>
          isSameDay(
            new Date(viewingMealPlan.mealDate),
            new Date(mealPlan.mealDate),
          ),
        );
        state.viewingMealPlans[index] = mealPlan;
      });
    },
    addCacheMealPlans: (
      state,
      action: PayloadAction<{
        mealPlanWithDates: MealPlanWithDate[];
      }>,
    ) => {
      state.cacheMealPlans.push(...action.payload.mealPlanWithDates);
    },
    updateCacheMealPlanByDate: (
      state,
      action: PayloadAction<{ mealPlanWithDate: MealPlanWithDate }>,
    ) => {
      const index = state.cacheMealPlans.findIndex((mealPlan) =>
        isSameDay(
          new Date(mealPlan.mealDate),
          new Date(action.payload.mealPlanWithDate.mealDate),
        ),
      );
      state.cacheMealPlans[index] = action.payload.mealPlanWithDate;
    },
    setDraggingCardHeight: (
      state,
      action: PayloadAction<{ draggingCardHeight: number }>,
    ) => {
      state.draggingCardHeight = action.payload.draggingCardHeight;
    },
  },
});

export const {
  setViewingMealPlans,
  updateViewingMealPlanByIndex,
  updateViewingMealPlanByDate,
  updateViewingMealPlanByDates,
  addCacheMealPlans,
  updateCacheMealPlanByDate,
  setDraggingCardHeight,
} = mealPlanSlice.actions;
export default mealPlanSlice.reducer;
