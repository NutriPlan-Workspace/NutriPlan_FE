interface NutritionRatio {
  carbs: number;
  protein: number;
  fat: number;
}

const DIET_RATIOS: Record<string, NutritionRatio> = {
  Anything: { carbs: 0.4, protein: 0.25, fat: 0.25 },
  Keto: { carbs: 0.1, protein: 0.25, fat: 0.55 },
  Mediterranean: { carbs: 0.35, protein: 0.25, fat: 0.25 },
  Paleo: { carbs: 0.2, protein: 0.35, fat: 0.3 },
  Vegan: { carbs: 0.5, protein: 0.15, fat: 0.2 },
  Vegetarian: { carbs: 0.45, protein: 0.2, fat: 0.2 },
};

const CALORIES_PER_GRAM = {
  carbs: 4,
  protein: 4,
  fat: 9,
};

const MICRONUTRIENT_RATIO = 0.03;

export const calculateNutritionAmounts = (
  calories: number,
  dietType: string,
) => {
  const ratio = DIET_RATIOS[dietType] || DIET_RATIOS.Anything;

  const availableCalories = calories * (1 - MICRONUTRIENT_RATIO);

  const carbsGrams = Math.round(
    (availableCalories * ratio.carbs) / CALORIES_PER_GRAM.carbs,
  );
  const proteinGrams = Math.round(
    (availableCalories * ratio.protein) / CALORIES_PER_GRAM.protein,
  );
  const fatGrams = Math.round(
    (availableCalories * ratio.fat) / CALORIES_PER_GRAM.fat,
  );

  return {
    carbs: `${carbsGrams}g`,
    protein: `${proteinGrams}g`,
    fat: `${fatGrams}g`,
  };
};
