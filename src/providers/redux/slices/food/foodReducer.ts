import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { Food } from '@/types/food';
import type { MealPlanFood } from '@/types/mealPlan';

interface FoodState {
  isModalDetailOpen: boolean;
  viewingDetailFood: Food | MealPlanFood | null;
  previousViewingDetailFood: Food | MealPlanFood | null;
}

const initialState: FoodState = {
  isModalDetailOpen: false,
  viewingDetailFood: null,
  previousViewingDetailFood: null,
};

const foodSlice = createSlice({
  name: 'food',
  initialState,
  reducers: {
    setIsModalDetailOpen: (state, action: PayloadAction<boolean>) => {
      state.isModalDetailOpen = action.payload;
    },
    setViewingDetailFood: (
      state,
      action: PayloadAction<Food | MealPlanFood>,
    ) => {
      state.viewingDetailFood = action.payload;
    },
    removeViewingDetailFood: (state) => {
      state.viewingDetailFood = null;
    },
    setPreviousViewingDetailFood: (
      state,
      action: PayloadAction<Food | MealPlanFood>,
    ) => {
      state.previousViewingDetailFood = action.payload;
    },
    removePreviousViewingDetailFood: (state) => {
      state.previousViewingDetailFood = null;
    },
  },
});

export const {
  setIsModalDetailOpen,
  setViewingDetailFood,
  removeViewingDetailFood,
  setPreviousViewingDetailFood,
  removePreviousViewingDetailFood,
} = foodSlice.actions;
export default foodSlice.reducer;
