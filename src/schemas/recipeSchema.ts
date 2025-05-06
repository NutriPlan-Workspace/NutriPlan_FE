import { z } from 'zod';

import { ERROR_MESSAGES } from '@/constants/message';
import { FOOD_TYPES } from '@/constants/recipeForm';

const PropertySchema = z.object({
  mainDish: z.boolean().default(true),
  sideDish: z.boolean().default(false),
  perishable: z.boolean().default(false),
  expirationTime: z.number().default(0),
  isBasicFood: z.boolean().default(false),
  prepTime: z.number().default(1),
  cookTime: z.number().default(1),
  waitTime: z.number().default(0),
  totalTime: z.number().default(1),
  isBreakfast: z.boolean().default(true),
  isLunch: z.boolean().default(true),
  isDinner: z.boolean().default(true),
  isSnack: z.boolean().default(true),
  isDessert: z.boolean().default(true),
});

export const FoodSchema = z.object({
  name: z.string().nonempty(ERROR_MESSAGES.NAME_REQUIRED),
  description: z.string().optional(),
  imgUrls: z.array(z.string().url(ERROR_MESSAGES.INVALID_IMAGE_URL)).optional(),
  property: PropertySchema.optional(),
  videoUrl: z.string().url(ERROR_MESSAGES.INVALID_VIDEO_URL).optional(),
  units: z
    .array(
      z.object({
        amount: z.number(),
        description: z.string(),
      }),
    )
    .optional(),
  directions: z.array(z.object({ step: z.string() })),
  ingredients: z
    .array(
      z.object({
        ingredientFoodId: z.string(),
        amount: z.number(),
        unit: z.number(),
      }),
    )
    .min(1, { message: ERROR_MESSAGES.INGREDIENTS_MINIMUM_REQUIRED }),
  isRecipe: z.boolean().optional(),
  isCustom: z.boolean().optional(),
  type: z.enum(FOOD_TYPES).optional(),
});

export type FoodFormSchema = z.infer<typeof FoodSchema>;

export type PropertyInput = z.infer<typeof PropertySchema>;
