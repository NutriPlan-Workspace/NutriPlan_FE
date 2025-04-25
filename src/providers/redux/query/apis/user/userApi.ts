import { baseApi } from '@/redux/query/apis/baseApi';
import type {
  FoodExclusionsArgs,
  FoodExclusionsResponse,
  NutritionGoal,
  NutritionGoalResponse,
  PhysicalStat,
  PhysicalStatResponse,
  PrimaryDietArgs,
  PrimaryDietResponse,
} from '@/types/user';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPhysicalStats: builder.query<PhysicalStatResponse, void>({
      query: () => ({
        url: '/user/stats',
        method: 'GET',
      }),
    }),
    getNutritionTarget: builder.query<
      NutritionGoalResponse,
      { userId: string }
    >({
      query: () => ({
        url: '/user/nutrition-target',
        method: 'GET',
      }),
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
    }),
    updatePhysicalStats: builder.mutation<PhysicalStatResponse, PhysicalStat>({
      query: (physicalStat) => ({
        url: '/user/stats',
        method: 'PUT',
        body: physicalStat,
      }),
    }),
    getPrimaryDiet: builder.query<PrimaryDietResponse, void>({
      query: () => ({
        url: '/user/primary-diet',
        method: 'GET',
      }),
    }),
    updatePrimaryDiet: builder.mutation<PrimaryDietResponse, PrimaryDietArgs>({
      query: (primaryDiet) => ({
        url: '/user/primary-diet',
        method: 'PUT',
        body: primaryDiet,
      }),
    }),
    getFoodExclusions: builder.query<FoodExclusionsResponse, void>({
      query: () => ({
        url: '/user/food-exclusions',
        method: 'GET',
      }),
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
