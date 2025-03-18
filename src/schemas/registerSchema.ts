import z from 'zod';

import { ERROR_MESSAGES } from '@/constants/message';

import { loginSchema } from './loginSchema';

export const registerSchema = loginSchema
  .extend({
    fullName: z
      .string()
      .min(3, { message: ERROR_MESSAGES.FULLNAME_MIN_LENGTH }),
    confirmPassword: z
      .string()
      .min(8, { message: ERROR_MESSAGES.CONFIRM_PASSWORD_REQUIRED }),
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: ERROR_MESSAGES.TERMS_NOT_ACCEPTED,
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: ERROR_MESSAGES.PASSWORDS_DO_NOT_MATCH,
    path: ['confirmPassword'],
  });

export type RegisterSchemaType = z.infer<typeof registerSchema>;
