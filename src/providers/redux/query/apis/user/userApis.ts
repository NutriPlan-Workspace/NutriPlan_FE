import { NUTRITION_TARGET_ENDPOINT } from '@/constants/endpoints';
import { baseApi } from '@/redux/query/apis/baseApi';
import type { ApiResponse } from '@/types/apiResponse';
import type { NutritionTarget } from '@/types/user';

export const nutritionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNutritionRequest: builder.query<ApiResponse<NutritionTarget>, void>({
      query: () => ({
        url: NUTRITION_TARGET_ENDPOINT,
        method: 'GET',
      }),
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
    }),
  }),
});

export const {
  useGetNutritionRequestQuery,
  useUpdateNutritionRequestMutation,
} = nutritionApi;
