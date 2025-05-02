import { PropertyInput } from '@/schemas/recipeSchema';

export const mealOptions = [
  'Breakfast',
  'Lunch',
  'Dinner',
  'Snack',
  'Dessert',
] as const;

export const propertyKeysMap = {
  Breakfast: 'isBreakfast',
  Lunch: 'isLunch',
  Dinner: 'isDinner',
  Snack: 'isSnack',
  Dessert: 'isDessert',
} as const;

export type TimeField = {
  label: string;
  unit: string;
  key?: keyof PropertyInput;
};

export const timeFields: TimeField[] = [
  { label: 'Prep time', unit: 'minutes', key: 'prepTime' },
  { label: 'Cook time', unit: 'minutes', key: 'totalTime' },
];

export const FOOD_TYPES = ['customFood', 'customRecipe', 'create'] as const;

export type FoodType = (typeof FOOD_TYPES)[number];

export const FOOD_TYPE_MAP: Record<
  'customFood' | 'customRecipe' | 'create',
  FoodType
> = {
  customFood: 'customFood',
  customRecipe: 'customRecipe',
  create: 'create',
};
