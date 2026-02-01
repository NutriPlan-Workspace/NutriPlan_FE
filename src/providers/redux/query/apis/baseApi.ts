import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';

import { env } from '@/configs/env';
import { HTTP_STATUS } from '@/constants/httpStatus';
import { PATH } from '@/constants/path';

const baseQuery = fetchBaseQuery({
  baseUrl: env.API_BASE_URL || 'http://localhost:3000/api',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (
    result.error?.status === HTTP_STATUS.UNAUTHORIZED ||
    result.error?.status === HTTP_STATUS.FORBIDDEN
  ) {
    const refreshToken = localStorage.getItem('refreshToken');

    if (refreshToken) {
      // prevent infinite loop
      const url = typeof args === 'string' ? args : args.url;
      if (url === '/auth/refresh-token') {
        localStorage.clear();
        window.location.href = PATH.LOGIN;
        return result;
      }

      const refreshResult = await baseQuery(
        {
          url: '/auth/refresh-token',
          method: 'POST',
          body: { refreshToken },
        },
        api,
        extraOptions,
      );

      if (refreshResult.data) {
        const { accessToken, refreshToken: newRefreshToken } = (
          refreshResult.data as unknown as {
            data: { accessToken: string; refreshToken: string };
          }
        ).data;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        // retry the initial query with new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        localStorage.clear();
        window.location.href = PATH.LOGIN;
      }
    } else {
      localStorage.clear();
      window.location.href = PATH.LOGIN;
    }
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQuery,
  tagTypes: [
    'Favorites',
    'NutritionTarget',
    'PrimaryDiet',
    'FoodExclusions',
    'PhysicalStats',
  ],
  endpoints: () => ({}),
});

export const baseApiWithAuth = createApi({
  reducerPath: 'apiWithAuth',
  baseQuery: baseQueryWithAuth,
  tagTypes: [
    'MealPlan',
    'Articles',
    'Users',
    'Foods',
    'Collections',
    'Categories',
    'Pantry',
    'Favorites',
    'NutritionTarget',
    'PrimaryDiet',
    'FoodExclusions',
    'PhysicalStats',
  ],
  endpoints: () => ({}),
});
