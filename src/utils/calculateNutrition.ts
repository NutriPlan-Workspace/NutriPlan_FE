import type { NutritionFields } from '@/types/food';
import { IngredientDisplay } from '@/types/ingredient';
import type { MealPlanFood } from '@/types/mealPlan';
import { NutritionGoal } from '@/types/user';

import { getUnitAmountFromUnits } from './foodUnits';
import { roundNumber } from './roundNumber';

export function getTotalCalories(mealItems: MealPlanFood[]): number {
  return roundNumber(
    mealItems.reduce(
      (total, food) =>
        total +
        (food.amount /
          getUnitAmountFromUnits(food.foodId.units, food.unit, 1)) *
          food.foodId.nutrition.calories,
      0,
    ),
    2,
  );
}

export function getTotalNutrition(mealItems: MealPlanFood[]) {
  type NutritionKeys = keyof NutritionFields;

  const totalNutrition: NutritionFields = {
    carbs: 0,
    fats: 0,
    proteins: 0,
    calories: 0,
    netCarbs: 0,
    caffeine: 0,
    theobromine: 0,
    fiber: 0,
    calcium: 0,
    iron: 0,
    magnesium: 0,
    phosphorus: 0,
    potassium: 0,
    sodium: 0,
    zinc: 0,
    copper: 0,
    fluoride: 0,
    manganese: 0,
    selenium: 0,
    vitAIu: 0,
    vitA: 0,
    vitB6: 0,
    vitB12: 0,
    vitC: 0,
    vitDIu: 0,
    vitD: 0,
    vitD2: 0,
    vitD3: 0,
    vitE: 0,
    vitK: 0,
    retinol: 0,
    lycopene: 0,
    thiamine: 0,
    riboflavin: 0,
    niacin: 0,
    folate: 0,
    choline: 0,
    betaCarotene: 0,
    alphaCarotene: 0,
    cholesterol: 0,
    betaine: 0,
    sugar: 0,
    sucrose: 0,
    glucose: 0,
    fructose: 0,
    lactose: 0,
    maltose: 0,
    galactose: 0,
    starch: 0,
    alcohol: 0,
    water: 0,
    tryptophan: 0,
    threonine: 0,
    isoleucine: 0,
    leucine: 0,
    lysine: 0,
    methionine: 0,
    cystine: 0,
    phenylalanine: 0,
    tyrosine: 0,
    valine: 0,
    arginine: 0,
    histidine: 0,
    alanine: 0,
    asparticAcid: 0,
    glycine: 0,
    proline: 0,
    serine: 0,
    hydroxyproline: 0,
    transFats: 0,
    saturatedFats: 0,
    monounsaturatedFats: 0,
    polyunsaturatedFats: 0,
    alaFattyAcid: 0,
    dhaFattyAcid: 0,
    epaFattyAcid: 0,
    dpaFattyAcid: 0,
    totalOmega3: 0,
    totalOmega6: 0,
    glutamicAcid: 0,
    pantothenicAcid: 0,
  };

  for (const food of mealItems) {
    const multiply =
      food.amount / getUnitAmountFromUnits(food.foodId.units, food.unit, 1);
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
) => roundNumber((value * amount) / conversionFactor, 2);

export const calculateTotalNutrition = (
  ingredients: IngredientDisplay[],
): NutritionFields => {
  const total: NutritionFields = Object.keys(
    ingredients[0]?.food.nutrition || {},
  ).reduce((acc, key) => {
    acc[key as keyof NutritionFields] = 0;
    return acc;
  }, {} as NutritionFields);

  for (const ingredient of ingredients) {
    const { food, amount, unit } = ingredient;
    const unitAmount = getUnitAmountFromUnits(food.units, unit, 1);
    const defaultUnitAmount = getUnitAmountFromUnits(
      food.units,
      food.defaultUnit,
      1,
    );

    const multiply = (amount / unitAmount) * defaultUnitAmount;

    for (const key in total) {
      const k = key as keyof NutritionFields;
      const value = food.nutrition[k] || 0;
      total[k] += value * multiply;
    }
  }

  return total;
};

const MACRO_TOLERANCE_RATIO = 0.05;

export const getInvalidNutritionKeys = (
  nutritionData?: NutritionFields,
  targetNutrition?: NutritionGoal,
): string[] => {
  const invalidKeys: string[] = [];

  if (!nutritionData || !targetNutrition) {
    return invalidKeys;
  }

  const targetCalories = targetNutrition?.calories;
  if (
    Math.abs(nutritionData.calories - targetCalories) >
    targetCalories * 0.05
  ) {
    invalidKeys.push('calories');
  }

  const macros: string[] = ['carbs', 'fats', 'proteins'];
  const test: string[] = ['carb', 'fat', 'protein'];

  for (const macro of macros) {
    const targetKey = `${test[macros.indexOf(macro)]}Target`;
    const actual = nutritionData[macro];
    const targetRange = targetNutrition[targetKey];

    if (
      !targetRange ||
      typeof targetRange.from !== 'number' ||
      typeof targetRange.to !== 'number'
    ) {
      continue;
    }

    const tolerance = targetRange.to * MACRO_TOLERANCE_RATIO;
    const lowerBound = Math.max(0, targetRange.from - tolerance);
    const upperBound = targetRange.to + tolerance;

    if (actual < lowerBound || actual > upperBound) {
      invalidKeys.push(macro);
    }
  }

  return invalidKeys;
};
