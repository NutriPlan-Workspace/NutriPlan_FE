import { baseApiWithAuth } from '@/redux/query/apis/baseApi';
import {
  addCacheMealPlans,
  setViewingMealPlans,
} from '@/redux/slices/mealPlan';
import type { ApiResponse } from '@/types/apiResponse';
import type {
  GetMealPlanDayRangeQueryArgs,
  GetMealPlanSingleDayQueryArgs,
  GroceriesResponse,
  MealPlanDay,
  MealPlanSingleDayResponse,
  PostMealPlanQueryArgs,
  PostMealPlanResponse,
  UpdateMealPlanQueryArgs,
  UpdateMealPlanResponse,
} from '@/types/mealPlan';
import { getDayRangeFromTo, getMealDate, isSameDay } from '@/utils/dateUtils';

export const mealPlanApi = baseApiWithAuth.injectEndpoints({
  endpoints: (builder) => ({
    getMealPlanSingleDay: builder.query<
      MealPlanSingleDayResponse,
      GetMealPlanSingleDayQueryArgs
    >({
      query: ({ date }) => {
        const params = new URLSearchParams({ date }).toString();
        return `/planner?${params}`;
      },
      async onQueryStarted({ date }, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        if (data.success) {
          dispatch(
            addCacheMealPlans({
              mealPlanWithDates: [
                {
                  mealDate: date,
                  mealPlanDay: data.data[0],
                },
              ],
            }),
          );
        }
      },
    }),

    getMealPlanDayRange: builder.query<
      ApiResponse<MealPlanDay[]>,
      GetMealPlanDayRangeQueryArgs
    >({
      query: ({ from, to }) => {
        const params = new URLSearchParams({ from, to }).toString();
        return `/planner?${params}`;
      },
      async onQueryStarted({ from, to }, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        if (data.success) {
          const viewingMealPlans = [];
          const dates = getDayRangeFromTo(from, to);

          for (const date of dates) {
            const mealPlan =
              data.data.find((mealPlanDay) =>
                isSameDay(new Date(mealPlanDay.mealDate), date),
              ) || undefined;
            viewingMealPlans.push({
              mealDate: getMealDate(date),
              mealPlanDay: mealPlan,
            });
          }
          dispatch(
            setViewingMealPlans({ mealPlanWithDates: viewingMealPlans }),
          );
          dispatch(addCacheMealPlans({ mealPlanWithDates: viewingMealPlans }));
        }
      },
    }),
    getLatestMealPlan: builder.mutation<
      MealPlanSingleDayResponse,
      GetMealPlanSingleDayQueryArgs
    >({
      query: ({ date }) => {
        const params = new URLSearchParams({ date }).toString();
        return {
          url: `/planner/copy?${params}`,
          method: 'GET',
        };
      },
    }),
    updateMealPlan: builder.mutation<
      UpdateMealPlanResponse,
      UpdateMealPlanQueryArgs
    >({
      query: ({ mealPlan }) => ({
        url: `/planner/${mealPlan._id}`,
        method: 'PUT',
        body: mealPlan,
      }),
    }),

    createMealPlan: builder.mutation<
      PostMealPlanResponse,
      PostMealPlanQueryArgs
    >({
      query: ({ mealPlan }) => ({
        url: '/planner',
        method: 'POST',
        body: mealPlan,
      }),
    }),
    removeMealPlan: builder.mutation<
      { success: boolean; message?: string },
      string
    >({
      query: (mealPlanId) => ({
        url: `/planner/${mealPlanId}`,
        method: 'DELETE',
      }),
    }),
    getGroceries: builder.query<
      GroceriesResponse,
      GetMealPlanDayRangeQueryArgs
    >({
      query: ({ from, to }) => {
        const params = new URLSearchParams({ from, to }).toString();
        return `/planner/groceries?${params}`;
      },
    }),
  }),
});

export const {
  useGetMealPlanSingleDayQuery,
  useLazyGetMealPlanSingleDayQuery,
  useGetMealPlanDayRangeQuery,
  useUpdateMealPlanMutation,
  useCreateMealPlanMutation,
  useGetLatestMealPlanMutation,
  useRemoveMealPlanMutation,
  useGetGroceriesQuery,
} = mealPlanApi;
