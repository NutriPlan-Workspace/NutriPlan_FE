import { FOODS_ENDPOINT, SEARCH_FOOD_ENDPOINT } from '@/constants/endpoints';
import { baseApi } from '@/redux/query/apis/baseApi';
import type { ApiResponse } from '@/types/apiResponse';
import type { DetailedFoodResponse, Food, FoodCategory } from '@/types/food';
import type { FoodFilterQuery } from '@/types/foodFilterQuery';

export const foodsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFoods: builder.query<ApiResponse<Food[]>, FoodFilterQuery>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value === undefined || value === null) return;
          if (Array.isArray(value)) {
            searchParams.set(key, JSON.stringify(value));
          } else {
            searchParams.set(key, String(value));
          }
        });
        return `${FOODS_ENDPOINT}?${searchParams.toString()}`;
      },
    }),
    getFoodById: builder.query<DetailedFoodResponse, string>({
      query: (idFood) => ({
        url: `${FOODS_ENDPOINT}/${idFood}`,
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

export const {
  useGetFoodsQuery,
  useGetFoodByIdQuery,
  useLazyGetFoodByIdQuery,
  useSearchFoodQuery,
} = foodsApi;
