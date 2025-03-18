import z from 'zod';

import { ERROR_MESSAGES } from '@/constants/message';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: ERROR_MESSAGES.EMAIL_REQUIRED })
    .email({ message: ERROR_MESSAGES.INVALID_EMAIL }),
  password: z
    .string()
    .min(8, { message: ERROR_MESSAGES.PASSWORD_MIN_LENGTH })
    .regex(/[A-Z]/, { message: ERROR_MESSAGES.PASSWORD_UPPERCASE })
    .regex(/[a-z]/, { message: ERROR_MESSAGES.PASSWORD_LOWERCASE })
    .regex(/\d/, { message: ERROR_MESSAGES.PASSWORD_NUMBER })
    .regex(/[\W_]/, { message: ERROR_MESSAGES.PASSWORD_SPECIAL_CHAR }),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
