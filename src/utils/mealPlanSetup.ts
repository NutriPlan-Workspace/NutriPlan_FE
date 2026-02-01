export type PhysicalStatsLike = {
  heightRecords?: Array<unknown>;
  weightRecords?: Array<unknown>;
  activityLevel?: unknown;
  dateOfBirth?: unknown;
};

export type NutritionTargetLike = {
  calories?: unknown;
  proteinTarget?: { from?: unknown; to?: unknown };
  carbTarget?: { from?: unknown; to?: unknown };
  fatTarget?: { from?: unknown; to?: unknown };
  goalType?: unknown;
};

export function hasPhysicalStats(physicalStats: unknown): boolean {
  if (!physicalStats || typeof physicalStats !== 'object') return false;
  const typed = physicalStats as PhysicalStatsLike;

  const hasHeight =
    Array.isArray(typed.heightRecords) && typed.heightRecords.length > 0;
  const hasWeight =
    Array.isArray(typed.weightRecords) && typed.weightRecords.length > 0;
  const hasActivity =
    typeof typed.activityLevel === 'string' && typed.activityLevel.length > 0;
  const hasDob = Boolean(typed.dateOfBirth);

  return hasHeight && hasWeight && hasActivity && hasDob;
}

export function hasNutritionTargets(nutritionTarget: unknown): boolean {
  if (!nutritionTarget || typeof nutritionTarget !== 'object') return false;
  const typed = nutritionTarget as NutritionTargetLike;

  const calories =
    typeof typed.calories === 'number'
      ? typed.calories
      : Number(typed.calories);
  if (!Number.isFinite(calories) || calories <= 0) return false;

  const proteinFrom = Number(typed.proteinTarget?.from);
  const proteinTo = Number(typed.proteinTarget?.to);
  const carbFrom = Number(typed.carbTarget?.from);
  const carbTo = Number(typed.carbTarget?.to);
  const fatFrom = Number(typed.fatTarget?.from);
  const fatTo = Number(typed.fatTarget?.to);

  const hasMacros =
    Number.isFinite(proteinFrom) &&
    Number.isFinite(proteinTo) &&
    Number.isFinite(carbFrom) &&
    Number.isFinite(carbTo) &&
    Number.isFinite(fatFrom) &&
    Number.isFinite(fatTo) &&
    proteinTo > 0 &&
    carbTo > 0 &&
    fatTo > 0;

  const goalType = typeof typed.goalType === 'string' ? typed.goalType : '';
  return hasMacros && goalType.length > 0;
}
