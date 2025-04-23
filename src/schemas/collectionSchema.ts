import { z } from 'zod';

import { ERROR_MESSAGES } from '@/constants/message';

export const createCollectionSchema = z.object({
  title: z.string().min(1, ERROR_MESSAGES.TITLE_REQUIRED),
  description: z.string().optional(),
});

export type CreateCollectionFormValues = z.infer<typeof createCollectionSchema>;
