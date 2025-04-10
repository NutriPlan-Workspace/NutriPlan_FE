import { RECENT_FOOD_KEY } from '@/constants/localStorage';
import type { Food } from '@/types/food';

export const getRecentFoods = (): Food[] => {
  const storedRecent = localStorage.getItem(RECENT_FOOD_KEY);
  return storedRecent ? JSON.parse(storedRecent) : [];
};

export const setRecentFoods = (foods: Food[]): void => {
  localStorage.setItem(RECENT_FOOD_KEY, JSON.stringify(foods));
};
