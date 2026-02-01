import { SwapModalFilters } from '@/redux/slices/mealPlan';
import { MealType } from '@/types/mealPlan';

export interface ChatbotCommandParams {
  ingredients?: { name: string; quantity?: number; unit?: string }[];
  query?: string;
  foodName?: string;
  allSearch?: boolean;
  filters?: SwapModalFilters;
  mealDate?: string;
  mealType?: MealType;
  targetIndex?: number;
  fromIndex?: number;
  toIndex?: number;
  newOrder?: number[];
  replacementQuery?: string;
  limit?: number;
  tolerance?: number;
  autoPick?: boolean;
  to?: string;
  from?: string;
}
