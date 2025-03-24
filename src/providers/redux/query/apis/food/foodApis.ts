import { baseApi } from '@/redux/query/apis/baseApi';
import type { ApiResponse } from '@/types/apiResponse';
import type { Food } from '@/types/food';

export const foodsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFoods: builder.query<
      ApiResponse<Food[]>,
      { page: number; limit?: number }
    >({
      query: ({ page, limit = 8 }) => `/foods?page=${page}&limit=${limit}`,
      keepUnusedDataFor: 15,
    }),
  }),
});

export const { useGetFoodsQuery } = foodsApi;
