import { z } from 'zod';

import { ERROR_MESSAGES } from '@/constants/message';
import {
  NUTRITION_TARGET_MIN_GAP,
  NUTRITION_TARGET_MIN_GAP_MESSAGE,
} from '@/constants/nutritionTargets';

const makeRangeSchema = (minGap: number) =>
  z
    .object({
      from: z.number().min(0, ERROR_MESSAGES.NUTRIENT_MIN),
      to: z.number().min(0, ERROR_MESSAGES.NUTRIENT_MIN),
    })
    .refine((val) => val.from < val.to, {
      message: 'Max must be greater than Min',
      path: ['to'],
    })
    .refine((val) => val.to - val.from >= minGap, {
      message: NUTRITION_TARGET_MIN_GAP_MESSAGE(minGap),
      path: ['to'],
    });

export const nutritionSchema = z.object({
  calories: z
    .number()
    .min(100, ERROR_MESSAGES.CALORIES_MIN)
    .max(5000, ERROR_MESSAGES.CALORIES_MAX),
  proteinTarget: makeRangeSchema(NUTRITION_TARGET_MIN_GAP.PROTEIN),
  carbTarget: makeRangeSchema(NUTRITION_TARGET_MIN_GAP.CARB),
  fatTarget: makeRangeSchema(NUTRITION_TARGET_MIN_GAP.FAT),
  minimumFiber: z.number().min(0, ERROR_MESSAGES.NUTRIENT_MIN).optional(),
  maxiumSodium: z.number().min(0, ERROR_MESSAGES.NUTRIENT_MIN).optional(),
  maxiumCholesterol: z.number().min(0, ERROR_MESSAGES.NUTRIENT_MIN).optional(),
});

export type NutritionFormSchema = z.infer<typeof nutritionSchema>;
