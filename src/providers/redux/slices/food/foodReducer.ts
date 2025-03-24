import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { Food } from '@/types/food';

interface FoodState {
  foods: Food[];
  selectedFood?: Food;
  page: number;
}

const initialState: FoodState = {
  foods: [],
  selectedFood: undefined,
  page: 1,
};

const foodSlice = createSlice({
  name: 'food',
  initialState,
  reducers: {
    setFoods: (state, action: PayloadAction<Food[]>) => {
      state.foods = [...state.foods, ...action.payload];
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setSelectedFood: (state, action: PayloadAction<Food>) => {
      state.selectedFood = action.payload;
    },
    resetFoods: (state) => {
      state.foods = [];
      state.page = 1;
    },
  },
});

export const { setFoods, setPage, setSelectedFood, resetFoods } =
  foodSlice.actions;
export default foodSlice.reducer;
