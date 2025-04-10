import { FOODS_ENDPOINT, SEARCH_FOOD_ENDPOINT } from '@/constants/endpoints';
import { baseApi } from '@/redux/query/apis/baseApi';
import type { ApiResponse } from '@/types/apiResponse';
import type { DetailedFoodResponse, Food, FoodCategory } from '@/types/food';

export const foodsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFoods: builder.query<
      ApiResponse<Food[]>,
      { page: number; limit?: number }
    >({
      query: ({ page, limit = 8 }) =>
        `${FOODS_ENDPOINT}?page=${page}&limit=${limit}`,
      keepUnusedDataFor: 15,
    }),
    getFoodById: builder.query<DetailedFoodResponse, string>({
      query: (idFood) => ({
        url: `/get-food?idFood=${idFood}`,
      }),
    }),
    searchFood: builder.query<
      ApiResponse<FoodCategory>,
      { q: string; filters?: string[]; allSearch?: boolean }
    >({
      query: ({ q, filters, allSearch }) => {
        const params = new URLSearchParams();
        if (q) params.append('q', q);
        if (filters && filters.length > 0) {
          params.append('filters', JSON.stringify(filters));
        }
        if (allSearch !== undefined) {
          params.append('allSearch', allSearch.toString());
        }
        return `${SEARCH_FOOD_ENDPOINT}?${params.toString()}`;
      },
    }),
  }),
});

export const { useGetFoodsQuery, useGetFoodByIdQuery, useSearchFoodQuery } =
  foodsApi;
