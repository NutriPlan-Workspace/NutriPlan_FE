export const CATEGORY_KEY_LABELS = {
  basicFood: 'basicFood',
  customFood: 'customFood',
  recipe: 'recipe',
  customRecipe: 'customRecipe',
} as const;

export type CategoryKey = keyof typeof CATEGORY_KEY_LABELS;

export const categoryKeys: CategoryKey[] = Object.keys(
  CATEGORY_KEY_LABELS,
) as CategoryKey[];

export const CATEGORY_KEYS = {
  RECIPE: '5',
  CUSTOM_RECIPE: '7',
  BASIC_FOOD: '8',
  CUSTOM_FOOD: '11',
};

export const categoryKeysMap: Record<string, CategoryKey> = {
  [CATEGORY_KEYS.RECIPE]: CATEGORY_KEY_LABELS.recipe,
  [CATEGORY_KEYS.CUSTOM_RECIPE]: CATEGORY_KEY_LABELS.customRecipe,
  [CATEGORY_KEYS.BASIC_FOOD]: CATEGORY_KEY_LABELS.basicFood,
  [CATEGORY_KEYS.CUSTOM_FOOD]: CATEGORY_KEY_LABELS.customFood,
};
