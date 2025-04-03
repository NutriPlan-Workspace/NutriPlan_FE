import z from 'zod';

import { ERROR_MESSAGES } from '@/constants/message';

import { passwordSchema } from './passwordSchema';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: ERROR_MESSAGES.EMAIL_REQUIRED })
    .email({ message: ERROR_MESSAGES.INVALID_EMAIL }),
  password: passwordSchema,
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
