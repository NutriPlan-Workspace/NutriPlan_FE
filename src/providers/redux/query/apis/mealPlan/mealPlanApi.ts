import { baseApi } from '@/redux/query/apis/baseApi';
import type { MealPlanDay, MealPlanResponse } from '@/types/mealPlan';

export const mealPlanApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMealPlan: builder.mutation<MealPlanResponse, string>({
      query: (userId) => ({
        url: `/mealplan/${userId}`,
        method: 'GET',
      }),
    }),
    getMealPlanWeekly: builder.mutation<
      MealPlanResponse,
      { date: string; userId: string }
    >({
      query: ({ date, userId }) => ({
        url: `/planner/week/${date}/${userId}`,
        method: 'GET',
      }),
    }),
    updateMealPlan: builder.mutation<MealPlanResponse, MealPlanDay>({
      query: (mealPlan) => ({
        url: `/planner/edit`,
        method: 'PUT',
        body: mealPlan,
      }),
    }),
  }),
});

export const {
  useGetMealPlanMutation,
  useGetMealPlanWeeklyMutation,
  useUpdateMealPlanMutation,
} = mealPlanApi;
