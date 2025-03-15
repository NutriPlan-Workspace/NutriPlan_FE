import z from 'zod';

import { ERROR_MESSAGES } from '@/constants/message';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: ERROR_MESSAGES.emailRequired })
    .email({ message: ERROR_MESSAGES.invalidEmail }),
  password: z
    .string()
    .min(8, { message: ERROR_MESSAGES.passwordMinLength })
    .regex(/[A-Z]/, { message: ERROR_MESSAGES.passwordUppercase })
    .regex(/[a-z]/, { message: ERROR_MESSAGES.passwordLowercase })
    .regex(/\d/, { message: ERROR_MESSAGES.passwordNumber })
    .regex(/[\W_]/, { message: ERROR_MESSAGES.passwordSpecialChar }),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
