import { z } from 'zod';

import { ERROR_MESSAGES } from '@/constants/message';

const optionalNonNegativeNumber = z.preprocess(
  (val) => {
    if (val === '' || val === null || val === undefined) return undefined;
    const num = Number(val);
    return isNaN(num) ? undefined : num;
  },
  z.number().min(0, { message: ERROR_MESSAGES.NUTRIENT_MIN }).optional(),
);

export const nutritionSchema = z.object({
  calories: z
    .number({ message: ERROR_MESSAGES.NUMBER_REQUIRED })
    .refine((val) => val > 0, { message: ERROR_MESSAGES.AMOUNT_MIN }),
  carbs: z
    .number({ message: ERROR_MESSAGES.NUMBER_REQUIRED })
    .refine((val) => val > 0, { message: ERROR_MESSAGES.AMOUNT_MIN }),
  fat: z
    .number({ message: ERROR_MESSAGES.NUMBER_REQUIRED })
    .refine((val) => val > 0, { message: ERROR_MESSAGES.AMOUNT_MIN }),
  proteins: z
    .number({ message: ERROR_MESSAGES.NUMBER_REQUIRED })
    .refine((val) => val > 0, { message: ERROR_MESSAGES.AMOUNT_MIN }),

  netCarbs: optionalNonNegativeNumber,
  fiber: optionalNonNegativeNumber,
  sodium: optionalNonNegativeNumber,
  cholesterol: optionalNonNegativeNumber,
  calcium: optionalNonNegativeNumber,
  iron: optionalNonNegativeNumber,
  potassium: optionalNonNegativeNumber,
  vitD: optionalNonNegativeNumber,
  alphaCarotene: optionalNonNegativeNumber,
  betaCarotene: optionalNonNegativeNumber,
  caffeine: optionalNonNegativeNumber,
  choline: optionalNonNegativeNumber,
  copper: optionalNonNegativeNumber,
  fluoride: optionalNonNegativeNumber,
  folate: optionalNonNegativeNumber,
  lycopene: optionalNonNegativeNumber,
  magnesium: optionalNonNegativeNumber,
  manganese: optionalNonNegativeNumber,
  niacin: optionalNonNegativeNumber,
  pantothenicAci: optionalNonNegativeNumber,
  phosphorus: optionalNonNegativeNumber,
  retinol: optionalNonNegativeNumber,
  riboflavin: optionalNonNegativeNumber,
  selenium: optionalNonNegativeNumber,
  theobromine: optionalNonNegativeNumber,
  thiamine: optionalNonNegativeNumber,
  vitAIu: optionalNonNegativeNumber,
  vitA: optionalNonNegativeNumber,
  vitB12: optionalNonNegativeNumber,
  vitB6: optionalNonNegativeNumber,
  vitC: optionalNonNegativeNumber,
  vitDIu: optionalNonNegativeNumber,
  vitD2: optionalNonNegativeNumber,
  vitD3: optionalNonNegativeNumber,
  vitE: optionalNonNegativeNumber,
  vitK: optionalNonNegativeNumber,
  zinc: optionalNonNegativeNumber,
  sugar: optionalNonNegativeNumber,
  sucrose: optionalNonNegativeNumber,
  glucose: optionalNonNegativeNumber,
  fructose: optionalNonNegativeNumber,
  lactose: optionalNonNegativeNumber,
  maltose: optionalNonNegativeNumber,
  galactose: optionalNonNegativeNumber,
  starch: optionalNonNegativeNumber,
  saturatedFats: optionalNonNegativeNumber,
  monounsaturatedFats: optionalNonNegativeNumber,
  polyunsaturatedFats: optionalNonNegativeNumber,
  transFats: optionalNonNegativeNumber,
  totalOmega3: optionalNonNegativeNumber,
  totalOmega6: optionalNonNegativeNumber,
  alaFattyAcid: optionalNonNegativeNumber,
  dhaFattyAcid: optionalNonNegativeNumber,
  epaFattyAcid: optionalNonNegativeNumber,
  dpaFattyAcid: optionalNonNegativeNumber,
  alanine: optionalNonNegativeNumber,
  arginine: optionalNonNegativeNumber,
  asparticAcid: optionalNonNegativeNumber,
  cystine: optionalNonNegativeNumber,
  glutamicAcid: optionalNonNegativeNumber,
  glycine: optionalNonNegativeNumber,
  histidine: optionalNonNegativeNumber,
  hydroxyproline: optionalNonNegativeNumber,
  isoleucine: optionalNonNegativeNumber,
  leucine: optionalNonNegativeNumber,
  lysine: optionalNonNegativeNumber,
  methionine: optionalNonNegativeNumber,
  phenylalanine: optionalNonNegativeNumber,
  proline: optionalNonNegativeNumber,
  serine: optionalNonNegativeNumber,
  threonine: optionalNonNegativeNumber,
  tryptophan: optionalNonNegativeNumber,
  tyrosine: optionalNonNegativeNumber,
  valine: optionalNonNegativeNumber,
});

export const foodSchema = z.object({
  name: z.string().min(1, { message: ERROR_MESSAGES.FIELD_REQUIRED }),
  description: z.string().optional(),
  defaultUnit: z.number(),
  units: z.array(
    z.object({
      amount: z
        .number({ message: ERROR_MESSAGES.NUMBER_REQUIRED })
        .refine((val) => val > 0, { message: ERROR_MESSAGES.AMOUNT_MIN }),
      description: z.string().min(1, ERROR_MESSAGES.FIELD_REQUIRED),
    }),
  ),
  imgUrls: z.array(z.string().optional()),
  nutrition: nutritionSchema,
});
