import { NUTRITION_TARGET_ENDPOINT } from '@/constants/endpoints';
import { baseApi } from '@/redux/query/apis/baseApi';
import type { ApiResponse } from '@/types/apiResponse';
import type { NutritionGoalResponse, NutritionTarget } from '@/types/user';

export const nutritionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNutritionRequest: builder.query<ApiResponse<NutritionTarget>, void>({
      query: () => ({
        url: NUTRITION_TARGET_ENDPOINT,
        method: 'GET',
      }),
      providesTags: ['NutritionTarget'],
    }),
    updateNutritionRequest: builder.mutation<
      ApiResponse<NutritionTarget>,
      Partial<NutritionTarget>
    >({
      query: (body) => ({
        url: NUTRITION_TARGET_ENDPOINT,
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: ['NutritionTarget'],
    }),
    getNutritionTarget: builder.query<NutritionGoalResponse, void>({
      query: () => ({
        url: '/user/nutrition-target',
        method: 'GET',
      }),
      providesTags: ['NutritionTarget'],
    }),
  }),
});

export const {
  useGetNutritionRequestQuery,
  useUpdateNutritionRequestMutation,
  useGetNutritionTargetQuery,
} = nutritionApi;
