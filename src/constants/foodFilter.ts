import { FoodFilterQuery } from '@/types/foodFilterQuery';

export const VALID_FILTERS = [
  'basicFood',
  'recipe',
  'customFood',
  'customRecipe',
] as const;

export type ValidFilter = (typeof VALID_FILTERS)[number];

export const PREFERRED_FOOD_TYPES = [
  'breakfast',
  'lunch',
  'dinner',
  'snack',
  'dessert',
] as const;

export type PreferredFoodType = (typeof PREFERRED_FOOD_TYPES)[number];

export const DISH_TYPES = ['main', 'side'] as const;

export type DishType = (typeof DISH_TYPES)[number];

export const NUTRITION_KEYS: (keyof FoodFilterQuery)[] = [
  'minPer100CaloriesProteins',
  'maxPer100CaloriesCarbs',
  'maxPer100CaloriesFats',
  'minPer100CaloriesFiber',
  'maxPer100CaloriesSodium',
];
