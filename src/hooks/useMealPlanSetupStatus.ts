import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { PATH } from '@/constants/path';
import {
  useGetNutritionTargetQuery,
  useGetPhysicalStatsQuery,
} from '@/redux/query/apis/user/userApi';
import { userSelector } from '@/redux/slices/user';
import { hasNutritionTargets, hasPhysicalStats } from '@/utils/mealPlanSetup';

export type MealPlanSetupStatus = {
  canGenerate: boolean;
  physicalOk: boolean;
  nutritionOk: boolean;
  isLoading: boolean;
  nextSetupPath: string;
};

export function useMealPlanSetupStatus(): MealPlanSetupStatus {
  const { user } = useSelector(userSelector);

  const {
    data: physicalStatsResponse,
    isLoading: isLoadingPhysical,
    isFetching: isFetchingPhysical,
  } = useGetPhysicalStatsQuery(undefined, {
    skip: !user?.id,
  });

  const {
    data: nutritionTargetResponse,
    isLoading: isLoadingNutrition,
    isFetching: isFetchingNutrition,
  } = useGetNutritionTargetQuery(
    { userId: user?.id ?? '' },
    {
      skip: !user?.id,
    },
  );

  const physicalOk = useMemo(
    () => hasPhysicalStats(physicalStatsResponse?.data),
    [physicalStatsResponse?.data],
  );

  const nutritionOk = useMemo(
    () => hasNutritionTargets(nutritionTargetResponse?.data),
    [nutritionTargetResponse?.data],
  );

  const canGenerate = physicalOk && nutritionOk;
  const isLoading =
    isLoadingPhysical ||
    isLoadingNutrition ||
    isFetchingPhysical ||
    isFetchingNutrition;

  const nextSetupPath = !physicalOk
    ? PATH.PHYSICAL_STATS
    : PATH.NUTRITION_TARGETS;

  return {
    canGenerate,
    physicalOk,
    nutritionOk,
    isLoading,
    nextSetupPath,
  };
}
