import { NutritionFields, PropertyFields } from './food';

export interface MealPlanFood {
  _id: string;
  foodId: {
    _id: string;
    name: string;
    description: string;
    isRecipe: boolean;
    defaultUnit: number;
    categoryId: string;
    secondaryCategoryId: string;
    imgUrls: string[];
    nutrition: NutritionFields;
    property: PropertyFields;
    directions: string[];
    units: {
      _id: string;
      amount: number;
      description: string;
    }[];
    ingredients: {
      _id: string;
      ingredientFoodId: {
        _id: string;
        name: string;
      };
      amount: number;
      unit: number;
      preparation: string;
    }[];
    isCustom: boolean;
    userId: string;
    videoUrl: string;
    deleted: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
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
