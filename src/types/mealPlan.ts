import { Food } from './food';

export interface MealPlanDay {
  id: string;
  userId: string;
  mealDate: Date;
  mealItems: {
    breakfast: Food[];
    lunch: Food[];
    dinner: Food[];
  };
}

export interface MealPlanResponse {
  // TODO: Refine this
  success: boolean;
  total: number;
  data: MealPlanDay[];
  message: string;
  additionalData: object;
}
