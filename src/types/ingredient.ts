import { Food } from '@/types/food';

export interface IngredientInput {
  ingredientFoodId: string;
  amount: number;
  unit: number;
}

export interface IngredientDisplay {
  ingredientFoodId: string;
  amount: number;
  unit: number;
  food: Food;
}
