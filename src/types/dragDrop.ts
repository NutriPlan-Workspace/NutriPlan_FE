import { Food } from './food';
import { MealItems } from './mealPlan';

export interface DragData {
  type?: string;
  mealDate?: string;
  mealType?: keyof MealItems;
  index?: number;
  food?: Food;
}
