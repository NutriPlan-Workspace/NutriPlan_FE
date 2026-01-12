import type { Food } from '@/types/food';

export const UNIT_AMOUNT_FALLBACK = 1;

export function getUnitAmountFromUnits(
  units: Array<{ amount: number }> | undefined,
  unitIndex: number | undefined,
  fallback: number = UNIT_AMOUNT_FALLBACK,
): number {
  if (!Array.isArray(units) || units.length === 0) return fallback;

  const direct =
    typeof unitIndex === 'number' && Number.isFinite(unitIndex)
      ? units[unitIndex]?.amount
      : undefined;

  return direct ?? units[0]?.amount ?? fallback;
}

export function getSafeUnitIndex(
  units: Array<unknown> | undefined,
  unitIndex: number | undefined,
): number {
  if (!Array.isArray(units) || units.length === 0) return 0;
  if (typeof unitIndex !== 'number' || !Number.isFinite(unitIndex)) return 0;
  return units[unitIndex] ? unitIndex : 0;
}

export function getDefaultUnitAmount(food: Food | undefined): number {
  if (!food) return UNIT_AMOUNT_FALLBACK;
  return getUnitAmountFromUnits(food.units, food.defaultUnit);
}
