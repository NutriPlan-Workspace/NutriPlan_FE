import { AUTO_GENERATE, AUTO_GENERATE_WEEK } from '@/constants/endpoints';
import { PrimaryDiet } from '@/constants/primaryDiet';
import { baseApiWithAuth } from '@/redux/query/apis/baseApi';
import {
  addCacheMealPlans,
  setViewingMealPlans,
  updateCacheMealPlanByDate,
  updateViewingMealPlanByDate,
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
import {
  SwapApplyRequest,
  SwapOptionsRequest,
  SwapOptionsResponse,
} from '@/types/mealSwap';
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
                  mealPlanDay: Array.isArray(data.data)
                    ? data.data[0]
                    : undefined,
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
      invalidatesTags: ['MealPlan'],
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
      invalidatesTags: ['MealPlan'],
    }),
    getGroceries: builder.query<
      GroceriesResponse,
      GetMealPlanDayRangeQueryArgs
    >({
      query: ({ from, to }) => {
        const params = new URLSearchParams({ from, to }).toString();
        return `/planner/groceries?${params}`;
      },
      providesTags: ['MealPlan'],
    }),
    autoGenerateMealPlan: builder.mutation<
      ApiResponse<MealPlanDay>,
      {
        date?: string;
        targetPercentage?: number;
        preferences?: {
          type: PrimaryDiet;
          calories: number;
          carbs: number;
          protein: number;
          fat: number;
        };
      }
    >({
      query: (params) => ({
        url: `/planner${AUTO_GENERATE}`,
        method: 'POST',
        body: params,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        if (data.data) {
          const mealPlan = data.data;
          const mealPlanWithDate = {
            mealDate: mealPlan.mealDate,
            mealPlanDay: mealPlan,
          };
          dispatch(updateViewingMealPlanByDate({ mealPlanWithDate }));
          dispatch(updateCacheMealPlanByDate({ mealPlanWithDate }));
        }
      },
      invalidatesTags: ['MealPlan'],
    }),
    autoGenerateMealPlanWeek: builder.mutation<
      ApiResponse<MealPlanDay[]>,
      { date?: string }
    >({
      query: (params) => ({
        url: `/planner${AUTO_GENERATE_WEEK}`,
        method: 'POST',
        body: params,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        if (data.data) {
          const mealPlanWithDates = data.data.map((mealPlan) => ({
            mealDate: mealPlan.mealDate,
            mealPlanDay: mealPlan,
          }));
          dispatch(setViewingMealPlans({ mealPlanWithDates }));
          dispatch(addCacheMealPlans({ mealPlanWithDates }));
        }
      },
      invalidatesTags: ['MealPlan'],
    }),
    searchFoods: builder.query<
      unknown,
      { q?: string; allSearch: boolean; filters: string[] }
    >({
      query: (params) => {
        const query = new URLSearchParams({
          q: params.q || '',
          allSearch: String(params.allSearch),
          filters: JSON.stringify(params.filters),
        }).toString();
        return `/foods/search?${query}`;
      },
    }),
    getSwapOptions: builder.mutation<
      SwapOptionsResponse,
      { mealPlanId: string; payload: SwapOptionsRequest }
    >({
      query: ({ mealPlanId, payload }) => ({
        url: `/planner/${mealPlanId}/swap-options`,
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response: ApiResponse<SwapOptionsResponse>) =>
        response.data,
    }),
    applySwap: builder.mutation<
      MealPlanDay,
      { mealPlanId: string; payload: SwapApplyRequest }
    >({
      query: ({ mealPlanId, payload }) => ({
        url: `/planner/${mealPlanId}/swap`,
        method: 'PATCH',
        body: payload,
      }),
      transformResponse: (response: ApiResponse<MealPlanDay>) => response.data,
      invalidatesTags: ['MealPlan'],
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
  useAutoGenerateMealPlanMutation,
  useAutoGenerateMealPlanWeekMutation,
  useLazySearchFoodsQuery,
  useGetSwapOptionsMutation,
  useApplySwapMutation,
} = mealPlanApi;
