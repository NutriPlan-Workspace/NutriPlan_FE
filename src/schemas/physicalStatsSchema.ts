import { z } from 'zod';

const currentDate = new Date();
currentDate.setHours(0, 0, 0, 0);

export const physicalStatsSchema = z.object({
  height: z
    .number()
    .refine((val) => val > 50, {
      message: 'Height must be greater than 50',
    })
    .refine((val) => val < 200, {
      message: 'Height must be less than 200',
    })
    .nullable(),
  weight: z
    .number()
    .refine((val) => val > 10, {
      message: 'Weight must be greater than 10',
    })
    .refine((val) => val < 200, {
      message: 'Weight must be less than 200',
    })
    .nullable(),
  dateOfBirth: z.string().refine(
    (date) => {
      const parsedDate = new Date(date);
      parsedDate.setHours(0, 0, 0, 0);
      return parsedDate <= currentDate;
    },
    { message: 'Date of birth must be in the past' },
  ),
});
