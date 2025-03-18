export enum NUTRITION_TEXT_COLOR {
  CARBS = 'text-carbsYellow',
  FATS = 'text-fatsBlue',
  PROTEINS = 'text-proteinsPurple',
  DEFAULT = 'text-black',
}

export enum NUTRITION_HEX_COLOR {
  CARBS = '#fcb524',
  FATS = '#52c0bc',
  PROTEINS = '#976fe8',
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
    color: NUTRITION_TEXT_COLOR.CARBS,
  },
  {
    label: 'Fats',
    key: 'fats',
    unit: `g`,
    color: NUTRITION_TEXT_COLOR.FATS,
  },
  {
    label: 'Proteins',
    key: 'proteins',
    unit: `g`,
    color: NUTRITION_TEXT_COLOR.PROTEINS,
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
