import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { env } from '@/configs/env';

const baseQuery = fetchBaseQuery({
  baseUrl: env.API_BASE_URL,
  credentials: 'include', // HttpOnly Cookie
});

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery,
  endpoints: () => ({}),
});
