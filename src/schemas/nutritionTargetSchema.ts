import { z } from 'zod';

import { ERROR_MESSAGES } from '@/constants/message';

export const nutritionSchema = z.object({
  calories: z
    .number()
    .min(100, ERROR_MESSAGES.CALORIES_MIN)
    .max(5000, ERROR_MESSAGES.CALORIES_MAX),
  proteinTarget: z.object({
    from: z.number().min(0, ERROR_MESSAGES.NUTRIENT_MIN),
    to: z.number().min(0, ERROR_MESSAGES.NUTRIENT_MIN),
  }),
  carbTarget: z.object({
    from: z.number().min(0, ERROR_MESSAGES.NUTRIENT_MIN),
    to: z.number().min(0, ERROR_MESSAGES.NUTRIENT_MIN),
  }),
  fatTarget: z.object({
    from: z.number().min(0, ERROR_MESSAGES.NUTRIENT_MIN),
    to: z.number().min(0, ERROR_MESSAGES.NUTRIENT_MIN),
  }),
  minimumFiber: z.number().min(0, ERROR_MESSAGES.NUTRIENT_MIN),
  maxiumSodium: z.number().min(0, ERROR_MESSAGES.NUTRIENT_MIN),
  maxiumCholesterol: z.number().min(0, ERROR_MESSAGES.NUTRIENT_MIN),
});

export type NutritionFormSchema = z.infer<typeof nutritionSchema>;
