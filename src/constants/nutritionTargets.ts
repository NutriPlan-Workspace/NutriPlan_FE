export const NUTRITION_TARGET_MIN_GAP = {
  PROTEIN: 12,
  CARB: 25,
  FAT: 20,
} as const;

export const NUTRITION_TARGET_MIN_GAP_MESSAGE = (minGap: number) =>
  `Range is too small. Min must be at least ${minGap}.`;

export const NUTRITION_TARGET_MIN_GAP_COOLDOWN_MS = 800;
