import { z } from 'zod';

import { ERROR_MESSAGES } from '@/constants/message';

const MIN_RANGE = 60;

export const nutritionSchema = z.object({
  calories: z
    .number()
    .min(100, ERROR_MESSAGES.CALORIES_MIN)
    .max(5000, ERROR_MESSAGES.CALORIES_MAX),
  proteinTarget: z
    .object({
      from: z.number().min(0, ERROR_MESSAGES.NUTRIENT_MIN),
      to: z.number().min(0, ERROR_MESSAGES.NUTRIENT_MIN),
    })
    .refine((val) => val.to - val.from >= MIN_RANGE, {
      message: `Protein range must be at least ${MIN_RANGE}`,
      path: ['to'],
    }),

  carbTarget: z
    .object({
      from: z.number().min(0, ERROR_MESSAGES.NUTRIENT_MIN),
      to: z.number().min(0, ERROR_MESSAGES.NUTRIENT_MIN),
    })
    .refine((val) => val.to - val.from >= MIN_RANGE, {
      message: `Carb range must be at least ${MIN_RANGE}`,
      path: ['to'],
    }),

  fatTarget: z
    .object({
      from: z.number().min(0, ERROR_MESSAGES.NUTRIENT_MIN),
      to: z.number().min(0, ERROR_MESSAGES.NUTRIENT_MIN),
    })
    .refine((val) => val.to - val.from >= MIN_RANGE, {
      message: `Fat range must be at least ${MIN_RANGE}`,
      path: ['to'],
    }),
  minimumFiber: z.number().min(0, ERROR_MESSAGES.NUTRIENT_MIN).optional(),
  maxiumSodium: z.number().min(0, ERROR_MESSAGES.NUTRIENT_MIN).optional(),
  maxiumCholesterol: z.number().min(0, ERROR_MESSAGES.NUTRIENT_MIN).optional(),
});

export type NutritionFormSchema = z.infer<typeof nutritionSchema>;
