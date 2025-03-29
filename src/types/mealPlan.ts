import { Food } from './food';

export interface MealPlanDay {
  id: string;
  userId: string;
  mealDate: Date;
  mealItems: {
    breakfast: MealItem[];
    lunch: MealItem[];
    dinner: MealItem[];
  };
}

export interface MealItem {
  id: string;
  foodId: Food;
  amount: number;
  unit: number;
}

export interface MealPlanResponse {
  // TODO: Refine this
  success: boolean;
  total: number;
  data: MealPlanDay[];
  message: string;
  additionalData: object;
}
