import type { MealPlanFood, NutritionSummaryFields } from '@/types/mealPlan';

import { roundNumber } from './roundNumber';

export function getTotalCalories(mealItems: MealPlanFood[]): number {
  return roundNumber(
    mealItems.reduce(
      (total, food) =>
        total +
        (food.amount / food.foodId.units[food.unit].amount) *
          food.foodId.nutrition.calories,
      0,
    ),
    2,
  );
}

export function getTotalNutrition(mealItems: MealPlanFood[]) {
  type NutritionKeys = keyof NutritionSummaryFields;

  const totalNutrition: NutritionSummaryFields = {
    calories: 0,
    carbs: 0,
    fats: 0,
    proteins: 0,
    fiber: 0,
    cholesterol: 0,
    sodium: 0,
  };

  for (const food of mealItems) {
    const multiply = food.amount / food.foodId.units[food.unit].amount;
    for (const key in totalNutrition) {
      const nutritionKey = key as NutritionKeys;
      if (food.foodId.nutrition[nutritionKey] !== undefined) {
        totalNutrition[nutritionKey] +=
          multiply * food.foodId.nutrition[nutritionKey];
      }
    }
  }

  return totalNutrition;
}
export const calculateNutrition = (
  value: number,
  amount: number,
  conversionFactor: number,
) => roundNumber((value * amount) / conversionFactor, 1);
