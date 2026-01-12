import { NutritionFields } from './food';

export interface NutritionSummaryFields {
  calories: number;
  carbs: number;
  fats: number;
  proteins: number;
  fiber: number;
  sodium: number;
  cholesterol: number;
}
export interface PropertySummaryFields {
  prepTime: number;
  cookTime: number;
}

export interface MealPlanFoodDetail {
  _id: string;
  name: string;
  imgUrls: string[];
  categories?: number[];
  property: PropertySummaryFields;
  nutrition: NutritionFields;
  units: {
    _id: string;
    amount: number;
    description: string;
  }[];
}
export interface MealPlanFood {
  _id: string;
  foodId: MealPlanFoodDetail;
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
  mealDate: string;
  mealItems: MealItems;
}

export interface MealPlanWithDate {
  mealDate: string;
  mealPlanDay: MealPlanDay | undefined;
}
export interface MealPlanDatabaseDTO {
  _id: string;
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

export interface MealPlanBody {
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
  mealPlan: MealPlanBody;
}
export interface GetMealPlanSingleDayQueryArgs {
  date: string;
}

export interface GetMealPlanDayRangeQueryArgs {
  from: string;
  to: string;
}

export interface UpdateMealPlanQueryArgs {
  mealPlan: MealPlanDatabaseDTO;
}

export interface PostMealPlanResponse {
  success: boolean;
  data: MealPlanDay;
  message: string;
  code: number;
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
  data: MealPlanDay;
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

export interface GroceriesResponse {
  success: boolean;
  code: number;
  data: IngreResponse[];
  message: string;
}

export interface IngreResponse {
  _id: string;
  name: string;
  categories?: number[];
  totalAmount: number;
  unit: {
    _id: string;
    amount: number;
    description: string;
  };
  units: {
    _id: string;
    amount: number;
    description: string;
  }[];
  imgUrls: string[];
  nutrition: {
    calories: number;
    carbs: number;
    fats: number;
    proteins: number;
    fiber?: number;
    sodium?: number;
    cholesterol?: number;
  };
  foodDetails: {
    name: string;
    date: string;
    imgUrls: string[];
    amount: number;
    description: string;
  }[];
}
