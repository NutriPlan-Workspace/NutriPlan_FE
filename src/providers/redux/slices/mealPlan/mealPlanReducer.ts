import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { MealPlanDay } from '@/types/mealPlan';

export type MealPlanState = {
  mealPlan: MealPlanDay[];
};

export const mealPlanInitialState: MealPlanState = {
  mealPlan: [],
};

const mealPlanSlice = createSlice({
  name: 'mealPlan',
  initialState: mealPlanInitialState,
  reducers: {
    setMealPlan: (state, action: PayloadAction<MealPlanDay[]>) => {
      state.mealPlan = action.payload;
    },
  },
});

export const { setMealPlan } = mealPlanSlice.actions;
export default mealPlanSlice.reducer;
