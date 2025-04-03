import z from 'zod';

import { ERROR_MESSAGES } from '@/constants/message';

export const passwordSchema = z
  .string()
  .min(8, { message: ERROR_MESSAGES.PASSWORD_MIN_LENGTH })
  .regex(/[A-Z]/, { message: ERROR_MESSAGES.PASSWORD_UPPERCASE })
  .regex(/[a-z]/, { message: ERROR_MESSAGES.PASSWORD_LOWERCASE })
  .regex(/\d/, { message: ERROR_MESSAGES.PASSWORD_NUMBER })
  .regex(/[\W_]/, { message: ERROR_MESSAGES.PASSWORD_SPECIAL_CHAR });

export const passwordConfirmSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: ERROR_MESSAGES.PASSWORDS_DO_NOT_MATCH,
    path: ['confirmPassword'],
  });

export const changePasswordSchema = z
  .object({
    currentPassword: passwordSchema,
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: ERROR_MESSAGES.NEW_PASSWORD_MUST_BE_DIFFERENT,
    path: ['newPassword'],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: ERROR_MESSAGES.PASSWORDS_DO_NOT_MATCH,
    path: ['confirmPassword'],
  });

export type PasswordSchemaType = z.infer<typeof passwordSchema>;
export type PasswordConfirmSchemaType = z.infer<typeof passwordConfirmSchema>;
export type ChangePasswordSchemaType = z.infer<typeof changePasswordSchema>;
