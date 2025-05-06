import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { env } from '@/configs/env';
import { HTTP_STATUS } from '@/constants/httpStatus';
import { PATH } from '@/constants/path';

const baseQuery = fetchBaseQuery({
  baseUrl: env.API_BASE_URL || 'http://localhost:3000/api',
  credentials: 'include', // HttpOnly Cookie
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const baseQueryWithAuth = async (args: any, api: any, extraOptions: any) => {
  const result = await baseQuery(args, api, extraOptions);

  if (
    result.error?.status === HTTP_STATUS.UNAUTHORIZED ||
    result.error?.status === HTTP_STATUS.FORBIDDEN
  ) {
    window.location.href = PATH.LOGIN;
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQuery,
  tagTypes: ['Favorites'],
  endpoints: () => ({}),
});

export const baseApiWithAuth = createApi({
  reducerPath: 'apiWithAuth',
  baseQuery: baseQueryWithAuth,
  endpoints: () => ({}),
});
