import { Food } from './food';


export interface MealPlanFood {
  _id: string;
  foodId: Food;
  amount: number;
  unit: number;
}

export interface MealItems {
  breakfast: MealPlanFood[];
  lunch: MealPlanFood[];
  dinner: MealPlanFood[];
}

export interface MealPlanDay {
  _id: string;
  userId: string;
  mealDate: string;
  mealItems: MealItems;
}

export interface MealPlanWithDate {
  mealDate: string;
  mealPlanDay: MealPlanDay | undefined;
}
export interface MealPlanDatabaseDTO {
  _id: string;
  userId: string;
  mealDate: string;
  mealItems: {
    breakfast: {
      foodId: string;
      amount: number;
      unit: number;
    }[];
    lunch: {
      foodId: string;
      amount: number;
      unit: number;
    }[];
    dinner: {
      foodId: string;
      amount: number;
      unit: number;
    }[];
  };
}

export interface PostMealPlanQueryArgs {
  mealPlan: MealPlanDatabaseDTO;
}
export interface GetMealPlanSingleDayQueryArgs {
  date: string;
  userId: string;
}

export interface GetMealPlanDayRangeQueryArgs {
  from: string;
  to: string;
  userId: string;
}

export interface UpdateMealPlanQueryArgs {
  mealPlan: MealPlanDatabaseDTO;
}

export interface PostMealPlanResponse {
  success: boolean;
  total: number;
  data: MealPlanDay;
  message: string;
  additionalData: object;
}
export interface MealPlanDayRangeResponse {
  success: boolean;
  total: number;
  data: MealPlanDay[];
  message: string;
  additionalData: object;
}

export interface MealPlanSingleDayResponse {
  success: boolean;
  total: number;
  data: MealPlanDay[];
  message: string;
  additionalData: object;
}

export interface UpdateMealPlanResponse {
  success: boolean;
  total: number;
  data: UpdateMealPlanQueryArgs;
  message: string;
  additionalData: object;
}
