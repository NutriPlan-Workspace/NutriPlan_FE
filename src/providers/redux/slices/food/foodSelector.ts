import { RootState } from '@/redux/store';

export const selectFoods = (state: RootState) => state.food.foods;

export const selectPage = (state: RootState) => state.food.page;

export const selectSelectedFood = (state: RootState) => state.food.selectedFood;
