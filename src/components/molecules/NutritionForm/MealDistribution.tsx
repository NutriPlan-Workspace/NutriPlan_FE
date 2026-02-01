import React, { useCallback } from 'react';
import {
  Control,
  Controller,
  UseFormSetValue,
  useWatch,
} from 'react-hook-form';
import { Slider } from 'antd';

import type { NutritionFormSchema } from '@/schemas/nutritionTargetSchema';

interface MealDistributionProps {
  control: Control<NutritionFormSchema>;
  setValue: UseFormSetValue<NutritionFormSchema>;
}

const MIN_RATIO = 0.2; // 20% minimum
const MAX_RATIO = 0.6; // 60% maximum

type MealKey = 'breakfastRatio' | 'lunchRatio' | 'dinnerRatio';

const MEAL_CONFIG: { key: MealKey; label: string; color: string }[] = [
  { key: 'breakfastRatio', label: 'Breakfast', color: '#f59e0b' },
  { key: 'lunchRatio', label: 'Lunch', color: '#10b981' },
  { key: 'dinnerRatio', label: 'Dinner', color: '#6366f1' },
];

const MealDistribution: React.FC<MealDistributionProps> = ({
  control,
  setValue,
}) => {
  const breakfast = Number(
    useWatch({ control, name: 'breakfastRatio' }) ?? 0.3,
  );
  const lunch = Number(useWatch({ control, name: 'lunchRatio' }) ?? 0.4);
  const dinner = Number(useWatch({ control, name: 'dinnerRatio' }) ?? 0.3);

  const values: Record<MealKey, number> = React.useMemo(
    () => ({
      breakfastRatio: breakfast,
      lunchRatio: lunch,
      dinnerRatio: dinner,
    }),
    [breakfast, lunch, dinner],
  );

  // Auto-balance logic: when one slider changes, adjust the other two proportionally
  // Ensures total always equals 100% by assigning remainder to dinner
  const handleChange = useCallback(
    (changedKey: MealKey, newValue: number) => {
      const otherKeys = MEAL_CONFIG.filter((m) => m.key !== changedKey).map(
        (m) => m.key,
      );

      // Clamp new value between MIN and MAX
      const clampedNew = Math.min(MAX_RATIO, Math.max(MIN_RATIO, newValue));

      // Calculate how much the other two need to share (must sum to 1 - clampedNew)
      const remaining = 1 - clampedNew;

      // Get current values of other two
      const other1Value = values[otherKeys[0]];
      const other2Value = values[otherKeys[1]];
      const otherSum = other1Value + other2Value;

      let new1: number;
      let new2: number;

      if (otherSum === 0) {
        // Edge case: distribute equally
        new1 = remaining / 2;
        new2 = remaining / 2;
      } else {
        // Distribute proportionally based on current ratio
        new1 = (other1Value / otherSum) * remaining;
        new2 = (other2Value / otherSum) * remaining;
      }

      // Ensure minimum constraint for other sliders
      if (new1 < MIN_RATIO) {
        new1 = MIN_RATIO;
        new2 = remaining - MIN_RATIO;
      }
      if (new2 < MIN_RATIO) {
        new2 = MIN_RATIO;
        new1 = remaining - MIN_RATIO;
      }

      // Final clamp to ensure values are valid
      new1 = Math.max(MIN_RATIO, Math.min(MAX_RATIO, new1));
      new2 = Math.max(MIN_RATIO, Math.min(MAX_RATIO, new2));

      // Round to integer percentages then convert back
      let roundedNewPct = Math.round(clampedNew * 100);
      let rounded1Pct = Math.round(new1 * 100);
      let rounded2Pct = Math.round(new2 * 100);

      // Ensure total is exactly 100% - assign remainder to dinner (last key)
      const total = roundedNewPct + rounded1Pct + rounded2Pct;
      if (total !== 100) {
        const diff = 100 - total;
        // Find which key is dinner and add the difference there
        if (changedKey === 'dinnerRatio') {
          roundedNewPct += diff;
        } else if (otherKeys[1] === 'dinnerRatio') {
          rounded2Pct += diff;
        } else if (otherKeys[0] === 'dinnerRatio') {
          rounded1Pct += diff;
        } else {
          // Fallback: add to the second other key
          rounded2Pct += diff;
        }
      }

      setValue(changedKey, roundedNewPct / 100, { shouldDirty: true });
      setValue(otherKeys[0], rounded1Pct / 100, { shouldDirty: true });
      setValue(otherKeys[1], rounded2Pct / 100, { shouldDirty: true });
      // Set snackRatio to 0
      setValue('snackRatio', 0, { shouldDirty: true });
    },
    [values, setValue],
  );

  return (
    <div className='flex flex-col gap-4'>
      <div className='text-xs text-gray-500'>
        Adjust one meal to auto-balance others (min 20%, max 60%)
      </div>

      {MEAL_CONFIG.map(({ key, label, color }) => {
        const value = values[key];
        return (
          <div key={key} className='flex flex-col gap-0'>
            <div className='flex justify-between text-xs text-gray-600'>
              <span className='flex items-center gap-1.5 font-medium'>
                <span
                  className='h-2 w-2 rounded-full'
                  style={{ backgroundColor: color }}
                />
                {label}
              </span>
              <span className='font-semibold'>{Math.round(value * 100)}%</span>
            </div>
            <Controller
              name={key}
              control={control}
              render={({ field }) => (
                <Slider
                  min={20}
                  max={60}
                  value={Math.round(Number(field.value ?? value) * 100)}
                  onChange={(val) => handleChange(key, val / 100)}
                  tooltip={{ formatter: (v) => `${v}%` }}
                  className='mb-2'
                  styles={{
                    track: { backgroundColor: color },
                    handle: { borderColor: color },
                  }}
                />
              )}
            />
          </div>
        );
      })}
    </div>
  );
};

export default MealDistribution;
