import { z } from 'zod';

import { DIET_LABELS } from '@/constants/dietLabels';
import { ERROR_MESSAGES } from '@/constants/message';

export const mealPlanSchema = z.object({
  calories: z
    .number({ invalid_type_error: ERROR_MESSAGES.CALORIES_MUST_BE_NUMBER })
    .min(1200, ERROR_MESSAGES.CALORIES_MIN)
    .max(3000, ERROR_MESSAGES.CALORIES_MAX),
  meals: z.literal('3', {
    errorMap: () => ({ message: ERROR_MESSAGES.SELECT_MEALS_COUNT }),
  }),
  diet: z.enum(Object.values(DIET_LABELS) as [string, ...string[]]),
});

export type MealPlanFormData = z.infer<typeof mealPlanSchema>;
