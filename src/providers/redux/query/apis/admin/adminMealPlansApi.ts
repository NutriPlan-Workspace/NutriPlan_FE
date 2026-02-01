import { ADMIN_MEAL_PLANS_ENDPOINT } from '@/constants/endpoints';
import { baseApiWithAuth } from '@/redux/query/apis/baseApi';
import type { AdminListResponse, AdminMealPlan } from '@/types/admin';
import type { ApiResponse } from '@/types/apiResponse';

export const adminMealPlansApi = baseApiWithAuth.injectEndpoints({
  endpoints: (builder) => ({
    getAdminMealPlans: builder.query<
      ApiResponse<AdminListResponse<AdminMealPlan>>,
      {
        page?: number;
        limit?: number;
        userId?: string;
        from?: string;
        to?: string;
      }
    >({
      query: ({ page = 1, limit = 10, userId, from, to } = {}) => ({
        url: ADMIN_MEAL_PLANS_ENDPOINT,
        params: {
          page,
          limit,
          ...(userId ? { userId } : {}),
          ...(from ? { from } : {}),
          ...(to ? { to } : {}),
        },
      }),
      providesTags: ['MealPlan'],
    }),

    createAdminMealPlan: builder.mutation<
      ApiResponse<AdminMealPlan>,
      {
        userId: string;
        mealDate: string;
        mealItems?: AdminMealPlan['mealItems'];
      }
    >({
      query: (body) => ({
        url: ADMIN_MEAL_PLANS_ENDPOINT,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['MealPlan'],
    }),

    updateAdminMealPlan: builder.mutation<
      ApiResponse<AdminMealPlan>,
      {
        id: string;
        data: Partial<Pick<AdminMealPlan, 'mealDate' | 'mealItems'>>;
      }
    >({
      query: ({ id, data }) => ({
        url: `${ADMIN_MEAL_PLANS_ENDPOINT}/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, arg) => [
        'MealPlan',
        { type: 'MealPlan', id: arg.id },
      ],
    }),

    deleteAdminMealPlan: builder.mutation<ApiResponse<unknown>, { id: string }>(
      {
        query: ({ id }) => ({
          url: `${ADMIN_MEAL_PLANS_ENDPOINT}/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['MealPlan'],
      },
    ),
  }),
});

export const {
  useGetAdminMealPlansQuery,
  useCreateAdminMealPlanMutation,
  useUpdateAdminMealPlanMutation,
  useDeleteAdminMealPlanMutation,
} = adminMealPlansApi;
