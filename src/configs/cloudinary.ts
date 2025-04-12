import { env } from '@/configs/env';

export const CLOUDINARY_CONFIG = {
  BASE_URL: `https://api.cloudinary.com/v1_1/${env.CLOUD_NAME}/image/`,
  UPLOAD_PRESET: env.UPLOAD_PRESET,
};
