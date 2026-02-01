import { baseApiWithAuth } from '@/redux/query/apis/baseApi';
import type {
  FoodExclusionsArgs,
  FoodExclusionsResponse,
  NutritionGoal,
  NutritionGoalResponse,
  PhysicalStatResponse,
  PhysicalStatUpdate,
  PrimaryDietArgs,
  PrimaryDietResponse,
} from '@/types/user';

export const userApi = baseApiWithAuth.injectEndpoints({
  endpoints: (builder) => ({
    getPhysicalStats: builder.query<PhysicalStatResponse, void>({
      query: () => ({
        url: '/user/stats',
        method: 'GET',
      }),
      providesTags: ['PhysicalStats'],
    }),
    getNutritionTarget: builder.query<
      NutritionGoalResponse,
      { userId: string }
    >({
      query: () => ({
        url: '/user/nutrition-target',
        method: 'GET',
      }),
      providesTags: ['NutritionTarget'],
    }),
    getNewNutritionTarget: builder.query<
      NutritionGoalResponse,
      { userId: string }
    >({
      query: () => ({
        url: '/user/nutrition-by-stats',
        method: 'GET',
      }),
    }),
    updateNutritionTarget: builder.mutation<
      NutritionGoalResponse,
      NutritionGoal
    >({
      query: (nutritionGoal) => ({
        url: '/user/nutrition-target',
        method: 'PUT',
        body: nutritionGoal,
      }),
      invalidatesTags: ['NutritionTarget'],
    }),
    updatePhysicalStats: builder.mutation<
      PhysicalStatResponse,
      PhysicalStatUpdate
    >({
      query: (physicalStat) => ({
        url: '/user/stats',
        method: 'PUT',
        body: physicalStat,
      }),
      invalidatesTags: ['PhysicalStats'],
    }),
    getPrimaryDiet: builder.query<PrimaryDietResponse, void>({
      query: () => ({
        url: '/user/primary-diet',
        method: 'GET',
      }),
      providesTags: ['PrimaryDiet'],
    }),
    updatePrimaryDiet: builder.mutation<PrimaryDietResponse, PrimaryDietArgs>({
      query: (primaryDiet) => ({
        url: '/user/primary-diet',
        method: 'PUT',
        body: primaryDiet,
      }),
      invalidatesTags: ['PrimaryDiet', 'FoodExclusions'],
      async onQueryStarted(arg, api) {
        const patch = api.dispatch(
          userApi.util.updateQueryData('getPrimaryDiet', undefined, (draft) => {
            draft.data = arg.primaryDiet;
          }),
        );

        try {
          const { data } = await api.queryFulfilled;
          api.dispatch(
            userApi.util.updateQueryData(
              'getPrimaryDiet',
              undefined,
              (draft) => {
                draft.data = data.data;
              },
            ),
          );
        } catch {
          patch.undo();
        }
      },
    }),
    getFoodExclusions: builder.query<FoodExclusionsResponse, void>({
      query: () => ({
        url: '/user/food-exclusions',
        method: 'GET',
      }),
      providesTags: ['FoodExclusions'],
    }),
    updateFoodExclusions: builder.mutation<
      FoodExclusionsResponse,
      FoodExclusionsArgs
    >({
      query: (excluded) => ({
        url: '/user/food-exclusions',
        method: 'PUT',
        body: excluded,
      }),
      invalidatesTags: ['FoodExclusions'],
    }),
  }),
});

export const {
  useGetPhysicalStatsQuery,
  useGetNutritionTargetQuery,
  useGetNewNutritionTargetQuery,
  useUpdatePhysicalStatsMutation,
  useUpdateNutritionTargetMutation,
  useGetPrimaryDietQuery,
  useUpdatePrimaryDietMutation,
  useGetFoodExclusionsQuery,
  useUpdateFoodExclusionsMutation,
} = userApi;
