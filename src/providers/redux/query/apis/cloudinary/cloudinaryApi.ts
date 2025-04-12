import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { CLOUDINARY_CONFIG } from '@/configs/cloudinary';
import { UploadImageResponse } from '@/types/cloudinary';
import { createUploadFormData } from '@/utils/uploadImage';

export const cloudinaryApi = createApi({
  reducerPath: 'cloudinaryApi',
  baseQuery: fetchBaseQuery({ baseUrl: CLOUDINARY_CONFIG.BASE_URL }),
  endpoints: (builder) => ({
    uploadImage: builder.mutation<string, File>({
      query: (file) => ({
        url: 'upload',
        method: 'POST',
        body: createUploadFormData(file),
      }),
      transformResponse: (response: UploadImageResponse) => response.secure_url,
    }),
  }),
});

export const { useUploadImageMutation } = cloudinaryApi;
