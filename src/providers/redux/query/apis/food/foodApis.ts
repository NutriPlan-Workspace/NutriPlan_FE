import { FOODS_ENDPOINT, SEARCH_FOOD_ENDPOINT } from '@/constants/endpoints';
import { baseApi } from '@/redux/query/apis/baseApi';
import { FoodFormSchema } from '@/schemas/recipeSchema';
import type { ApiResponse } from '@/types/apiResponse';
import type { DetailedFoodResponse, Food, FoodCategory } from '@/types/food';
import type { PostCustomFoodQueryArgs, PostFoodResponse } from '@/types/food';
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
    createCustomRecipe: builder.mutation<ApiResponse<Food>, FoodFormSchema>({
      query: (data) => ({
        url: FOODS_ENDPOINT,
        method: 'POST',
        body: data,
      }),
    }),
    createCustomFood: builder.mutation<
      PostFoodResponse,
      PostCustomFoodQueryArgs
    >({
      query: (body) => ({
        url: '/foods/',
        method: 'POST',
        body: body,
      }),
    }),
    updateCustomFood: builder.mutation<
      PostFoodResponse,
      PostCustomFoodQueryArgs
    >({
      query: (body) => ({
        url: `/foods/${body._id}`,
        method: 'PUT',
        body: body,
      }),
    }),
    removeCustomFood: builder.mutation<
      { success: boolean; message?: string },
      string
    >({
      query: (foodId) => ({
        url: `/foods/${foodId}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetFoodsQuery,
  useGetFoodByIdQuery,
  useLazyGetFoodByIdQuery,
  useSearchFoodQuery,
  useLazyGetFoodsQuery,
  useCreateCustomRecipeMutation,
  useCreateCustomFoodMutation,
  useUpdateCustomFoodMutation,
  useRemoveCustomFoodMutation,
} = foodsApi;
