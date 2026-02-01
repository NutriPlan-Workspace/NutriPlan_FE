import type { NutritionGoal } from '@/types/user';

export enum NUTRITION_TEXT_COLOR {
  CARBS = 'text-carbsBlue',
  FATS = 'text-fatsYellow',
  PROTEINS = 'text-proteinsPurple',
  DEFAULT = 'text-black',
}

export enum NUTRITION_HEX_COLOR {
  CARBS = '#3b82f6', // blue-500
  FATS = '#eab308', // yellow-500
  PROTEINS = '#a855f7', // purple-500
  FIBER = '#22c55e', // green-500
  SODIUM = '#94a3b8', // slate-400
  CHOLESTEROL = '#f59e0b', // amber-500 (yellow-orange)
  CALORIES = '#f97316', // orange-500
}

export const nutritionFormat = [
  {
    label: 'Calories',
    key: 'calories',
    unit: '',
    color: NUTRITION_TEXT_COLOR.DEFAULT,
  },
  {
    label: 'Carbs',
    key: 'carbs',
    unit: `g`,
    color: NUTRITION_TEXT_COLOR.DEFAULT,
  },
  {
    label: 'Fats',
    key: 'fats',
    unit: `g`,
    color: NUTRITION_TEXT_COLOR.DEFAULT,
  },
  {
    label: 'Proteins',
    key: 'proteins',
    unit: `g`,
    color: NUTRITION_TEXT_COLOR.DEFAULT,
  },
  {
    label: 'Fiber',
    key: 'fiber',
    unit: 'g',
    color: NUTRITION_TEXT_COLOR.DEFAULT,
  },
  {
    label: 'Sodium',
    key: 'sodium',
    unit: 'mg',
    color: NUTRITION_TEXT_COLOR.DEFAULT,
  },
  {
    label: 'Cholesterol',
    key: 'cholesterol',
    unit: 'mg',
    color: NUTRITION_TEXT_COLOR.DEFAULT,
  },
] as const;

export const nutritionChart = [
  {
    label: 'Carbs',
    key: 'carbs',
    unit: `g`,
    color: NUTRITION_HEX_COLOR.CARBS,
  },
  {
    label: 'Fats',
    key: 'fats',
    unit: `g`,
    color: NUTRITION_HEX_COLOR.FATS,
  },
  {
    label: 'Proteins',
    key: 'proteins',
    unit: `g`,
    color: NUTRITION_HEX_COLOR.PROTEINS,
  },
] as const;

export const nutritionFieldGroup = [
  {
    nutriName: 'general',
    label1: 'Main Nutrients',
    label2: 'Amount',
    label3: 'Target',
    hasTarget: true,
    field: [
      { key: 'calories', title: 'Calories', unit: '' },
      { key: 'carbs', title: 'Carbs', unit: 'g' },
      { key: 'fats', title: 'Fats', unit: 'g' },
      { key: 'proteins', title: 'Protein', unit: 'g' },
      { key: 'fiber', title: 'Fiber', unit: 'g' },
      { key: 'sodium', title: 'Sodium', unit: 'mg' },
      { key: 'cholesterol', title: 'Cholesterol', unit: 'mg' },
    ],
  },
  {
    nutriName: 'breakdown',
    label1: 'Breakdown',
    label2: 'Amount',
    label3: '',
    hasTarget: false,
    field: [
      { key: 'netCarbs', title: 'Net Carbs', unit: 'g' },
      { key: 'calcium', title: 'Calcium', unit: 'mg' },
      { key: 'iron', title: 'Iron', unit: 'mg' },
      { key: 'potassium', title: 'Potassium', unit: 'mg' },
      { key: 'vitD', title: 'Vitamin D', unit: 'μg' },
    ],
  },
  {
    nutriName: 'vitamins',
    label1: 'Vitamins and Minerals',
    label2: '',
    label3: 'Daily Value',
    field: [
      { key: 'alphaCarotene', title: 'Alpha carotene', unit: 'μg' },
      { key: 'betaCarotene', title: 'Beta carotene', unit: 'μg' },
      { key: 'caffeine', title: 'Caffeine', unit: 'mg' },
      { key: 'choline', title: 'Choline', unit: 'mg' },
      { key: 'copper', title: 'Copper', unit: 'mg' },
      { key: 'fluoride', title: 'Fluoride', unit: 'μg' },
      { key: 'folate', title: 'Folate (B9)', unit: 'μg' },
      { key: 'lycopene', title: 'Lycopene', unit: 'μg' },
      { key: 'magnesium', title: 'Magnesium', unit: 'mg' },
      { key: 'manganese', title: 'Manganese', unit: 'mg' },
      { key: 'niacin', title: 'Niacin', unit: 'mg' },
      { key: 'pantothenicAcid', title: 'Pantothenic acid', unit: 'mg' },
      { key: 'phosphorus', title: 'Phosphorus', unit: 'mg' },
      { key: 'retinol', title: 'Retinol', unit: 'μg' },
      { key: 'riboflavin', title: 'Riboflavin (B2)', unit: 'mg' },
      { key: 'selenium', title: 'Selenium', unit: 'μg' },
      { key: 'theobromine', title: 'Theobromine', unit: 'mg' },
      { key: 'thiamine', title: 'Thiamine', unit: 'mg' },
      { key: 'vitAIu', title: 'Vitamin A IU', unit: 'IU' },
      { key: 'vitA', title: 'Vitamin A', unit: 'μg' },
      { key: 'vitB12', title: 'Vitamin B12', unit: 'μg' },
      { key: 'vitB6', title: 'Vitamin B6', unit: 'mg' },
      { key: 'vitC', title: 'Vitamin C', unit: 'mg' },
      { key: 'vitDIu', title: 'Vitamin D IU', unit: 'IU' },
      { key: 'vitD2', title: 'Vitamin D2', unit: 'μg' },
      { key: 'vitD3', title: 'Vitamin D3', unit: 'μg' },
      { key: 'vitE', title: 'Vitamin E', unit: 'mg' },
      { key: 'vitK', title: 'Vitamin K', unit: 'μg' },
      { key: 'zinc', title: 'Zinc', unit: 'mg' },
    ],
  },
  {
    nutriName: 'sugars',
    label1: 'Sugars',
    label2: '',
    label3: '',
    field: [
      { key: 'sugar', title: 'Sugar', unit: 'g' },
      { key: 'sucrose', title: 'Sucrose', unit: 'g' },
      { key: 'glucose', title: 'Glucose', unit: 'g' },
      { key: 'fructose', title: 'Fructose', unit: 'g' },
      { key: 'lactose', title: 'Lactose', unit: 'g' },
      { key: 'maltose', title: 'Maltose', unit: 'g' },
      { key: 'galactose', title: 'Galactose', unit: 'g' },
      { key: 'starch', title: 'Starch', unit: 'g' },
    ],
  },
  {
    nutriName: 'fats',
    label1: 'Fats',
    label2: '',
    label3: '',
    field: [
      { key: 'saturatedFats', title: 'Saturated fats', unit: 'g' },
      { key: 'monounsaturatedFats', title: 'Monounsaturated fats', unit: 'g' },
      { key: 'polyunsaturatedFats', title: 'Polyunsaturated fats', unit: 'g' },
      { key: 'transFats', title: 'Trans fats', unit: 'g' },
    ],
  },
  {
    nutriName: 'fattyAcids',
    label1: 'Fatty Acids',
    label2: '',
    label3: '',
    field: [
      { key: 'totalOmega3', title: 'Total omega 3', unit: 'g' },
      { key: 'totalOmega6', title: 'Total omega 6', unit: 'g' },
      { key: 'alaFattyAcid', title: 'Alpha Linolenic Acid (ALA)', unit: 'g' },
      { key: 'dhaFattyAcid', title: 'Docosahexaenoic Acid (DHA)', unit: 'g' },
      { key: 'epaFattyAcid', title: 'Eicosapentaenoic Acid (EPA)', unit: 'g' },
      { key: 'dpaFattyAcid', title: 'Docosapentaenoic Acid (DPA)', unit: 'g' },
    ],
  },
  {
    nutriName: 'aminoAcids',
    label1: 'Amino Acids',
    label2: '',
    label3: '',
    field: [
      { key: 'alanine', title: 'Alanine', unit: 'g' },
      { key: 'arginine', title: 'Arginine', unit: 'g' },
      { key: 'asparticAcid', title: 'Aspartic acid', unit: 'g' },
      { key: 'cystine', title: 'Cystine', unit: 'g' },
      { key: 'glutamicAcid', title: 'Glutamic acid', unit: 'g' },
      { key: 'glycine', title: 'Glycine', unit: 'g' },
      { key: 'histidine', title: 'Histidine', unit: 'g' },
      { key: 'hydroxyproline', title: 'Hydroxyproline', unit: 'mg' },
      { key: 'isoleucine', title: 'Isoleucine', unit: 'g' },
      { key: 'leucine', title: 'Leucine', unit: 'g' },
      { key: 'lysine', title: 'Lysine', unit: 'g' },
      { key: 'methionine', title: 'Methionine', unit: 'g' },
      { key: 'phenylalanine', title: 'Phenylalanine', unit: 'g' },
      { key: 'proline', title: 'Proline', unit: 'g' },
      { key: 'serine', title: 'Serine', unit: 'g' },
      { key: 'threonine', title: 'Threonine', unit: 'g' },
      { key: 'tryptophan', title: 'Tryptophan', unit: 'g' },
      { key: 'tyrosine', title: 'Tyrosine', unit: 'g' },
      { key: 'valine', title: 'Valine', unit: 'g' },
    ],
  },
];

export const targetKeyMap: Record<
  | 'calories'
  | 'carbs'
  | 'fats'
  | 'proteins'
  | 'fiber'
  | 'sodium'
  | 'cholesterol',
  keyof NutritionGoal
> = {
  calories: 'calories',
  carbs: 'carbTarget',
  fats: 'fatTarget',
  proteins: 'proteinTarget',
  fiber: 'minimumFiber',
  sodium: 'maxiumSodium',
  cholesterol: 'maxiumCholesterol',
};

// Nutrients that have target values (shown in TARGET column)
export const NUTRIENTS_WITH_TARGETS = [
  'calories',
  'carbs',
  'fats',
  'proteins',
  'fiber',
  'sodium',
  'cholesterol',
] as const;
export const nutritionalValue = [
  {
    label: 'Calories',
    key: 'calories',
    unit: 'kcal',
    color: NUTRITION_HEX_COLOR.CARBS,
  },
  {
    label: 'Carbs',
    key: 'carbs',
    unit: `g`,
    color: NUTRITION_HEX_COLOR.CARBS,
  },
  {
    label: 'Fats',
    key: 'fats',
    unit: `g`,
    color: NUTRITION_HEX_COLOR.FATS,
  },
  {
    label: 'Proteins',
    key: 'proteins',
    unit: `g`,
    color: NUTRITION_HEX_COLOR.PROTEINS,
  },
] as const;
