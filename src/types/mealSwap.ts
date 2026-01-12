export type MealType = 'breakfast' | 'lunch' | 'dinner';

export type SwapOptionsRequest =
  | {
      swapType: 'food';
      mealType: MealType;
      targetFoodId?: string;
      targetItemId?: string;
      limit?: number;
      tolerance?: number;
    }
  | {
      swapType: 'meal';
      mealType: MealType;
      limit?: number;
    };

export type SwapApplyRequest =
  | {
      swapType: 'food';
      mealType: MealType;
      targetFoodId?: string;
      targetItemId?: string;
      replacement: {
        foodId: string;
        amount?: number;
        unit?: number;
      };
    }
  | {
      swapType: 'meal';
      mealType: MealType;
      replacement: {
        items: {
          foodId: string;
          amount: number;
          unit: number;
        }[];
      };
    };

export type SwapNutrition = {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
};

export type SwapFood = {
  _id?: string;
  name?: string;
  imgUrls?: string[];
  categories?: number[];
  units?: {
    amount: number;
    description: string;
  }[];
  nutrition?: {
    calories?: number;
    proteins?: number;
    carbs?: number;
    fats?: number;
  };
  property?: {
    mainDish?: boolean;
    sideDish?: boolean;
  };
};

export type SwapFoodOption = {
  foodId: string;
  amount?: number;
  unit?: number;
  nutrition?: SwapNutrition;
  food?: SwapFood;
};

export type SwapMealOption = {
  items: SwapFoodOption[];
  nutrition?: SwapNutrition;
};

export type SwapOptionsResponse =
  | {
      mealPlanId: string;
      mealType: MealType;
      swapType: 'food';
      target: {
        foodId?: string;
        amount?: number;
        unit?: number;
        food?: SwapFood;
      };
      options: SwapFoodOption[];
    }
  | {
      mealPlanId: string;
      mealType: MealType;
      swapType: 'meal';
      target: {
        items: SwapFoodOption[];
      };
      options: SwapMealOption[];
    };
