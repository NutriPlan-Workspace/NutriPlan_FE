import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from '@tanstack/react-router';

import { useMealPlanSetupStatus } from '@/hooks/useMealPlanSetupStatus';
import { MealBoxHeader } from '@/molecules/MealBoxHeader';
import { MealBoxSkeleton } from '@/molecules/MealBoxSkeleton';
import { MealBoxContent } from '@/organisms/MealBoxContent';
import {
  useGetSwapOptionsMutation,
  useUpdateMealPlanMutation,
} from '@/redux/query/apis/mealPlan/mealPlanApi';
import { useGetNutritionTargetQuery } from '@/redux/query/apis/user/userApi';
import {
  closeSwapModal,
  mealPlanSelector,
  openSwapModal,
  setSwapModalData,
  setSwapModalLoading,
  updateViewingMealPlanByDate,
} from '@/redux/slices/mealPlan';
import { userSelector } from '@/redux/slices/user/userSelector';
import type { MealItems, MealPlanDay, MealPlanFood } from '@/types/mealPlan';
import type { MealType, SwapOptionsResponse } from '@/types/mealSwap';
import {
  getTotalCalories,
  getTotalNutrition,
} from '@/utils/calculateNutrition';
import { isSameDay } from '@/utils/dateUtils';
import { getMealPlanDayDatabaseDTOByMealPlanDay } from '@/utils/mealPlan';
import { showToastError } from '@/utils/toastUtils';

interface MealBoxProps {
  mealItems: MealPlanFood[];
  isLoading?: boolean;
  mealDate: string;
  mealType: keyof MealPlanDay['mealItems'];
}

const MealBox: React.FC<MealBoxProps> = ({
  mealItems,
  isLoading,
  mealDate,
  mealType,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const { canGenerate, nextSetupPath } = useMealPlanSetupStatus();
  const dispatch = useDispatch();
  const [updateMealPlan] = useUpdateMealPlanMutation();
  const viewingMealPlan = useSelector(mealPlanSelector).viewingMealPlans;
  const swapModal = useSelector(mealPlanSelector).swapModal;

  const totalCalories = useMemo(() => getTotalCalories(mealItems), [mealItems]);
  const totalNutrition = useMemo(
    () => getTotalNutrition(mealItems),
    [mealItems],
  );

  const handleRemoveAllFoodInMealType = async (
    mealDate: string,
    mealType: keyof MealItems,
  ) => {
    const currentMealPlanDay = viewingMealPlan.find((plan) =>
      isSameDay(new Date(plan.mealDate), new Date(mealDate)),
    );
    if (!currentMealPlanDay || !currentMealPlanDay.mealPlanDay?.mealItems)
      return;
    const updatedMealItems = { ...currentMealPlanDay.mealPlanDay.mealItems };
    updatedMealItems[mealType] = [];
    const updatedMealPlanDay = {
      ...currentMealPlanDay.mealPlanDay,
      mealItems: updatedMealItems,
    };
    dispatch(
      updateViewingMealPlanByDate({
        mealPlanWithDate: {
          mealPlanDay: updatedMealPlanDay,
          mealDate: mealDate,
        },
      }),
    );
    const updatedMealPlanDatabaseDTO =
      getMealPlanDayDatabaseDTOByMealPlanDay(updatedMealPlanDay);
    await updateMealPlan({ mealPlan: updatedMealPlanDatabaseDTO });
  };

  const [getSwapOptions] = useGetSwapOptionsMutation();
  const handleOpenSwapOptions = useCallback(async () => {
    if (!canGenerate) {
      showToastError('Complete setup to enable meal generation.');
      router.navigate({ to: nextSetupPath });
      return;
    }
    const currentMealPlanDay = viewingMealPlan.find((plan) =>
      isSameDay(new Date(plan.mealDate), new Date(mealDate)),
    )?.mealPlanDay;

    if (!currentMealPlanDay?._id) {
      showToastError('Meal plan not found for this day.');
      return;
    }

    dispatch(
      openSwapModal({
        swapType: 'meal',
        mealPlanId: currentMealPlanDay._id,
        mealDate,
        mealType: mealType as MealType,
        filters: {},
      }),
    );
    dispatch(setSwapModalLoading({ loading: true }));
    try {
      const data = await getSwapOptions({
        mealPlanId: currentMealPlanDay._id,
        payload: {
          swapType: 'meal',
          mealType: mealType as MealType,
          limit: 20,
          generationMode: 'percentage',
        },
      }).unwrap();
      // Handle case where transformResponse doesn't unwrap the API wrapper
      const swapData =
        (data as unknown as { data?: SwapOptionsResponse }).data ?? data;
      dispatch(setSwapModalData({ data: swapData as SwapOptionsResponse }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Swap options failed';
      showToastError(message);
      dispatch(closeSwapModal());
    } finally {
      dispatch(setSwapModalLoading({ loading: false }));
    }
  }, [
    canGenerate,
    dispatch,
    getSwapOptions,
    mealDate,
    mealType,
    nextSetupPath,
    router,
    viewingMealPlan,
  ]);

  const isGeneratingThisMeal =
    swapModal.open &&
    swapModal.loading &&
    swapModal.swapType === 'meal' &&
    swapModal.mealDate === mealDate &&
    swapModal.mealType === (mealType as MealType);

  const userState = useSelector(userSelector);
  const { data: nutritionTargetData } = useGetNutritionTargetQuery(
    { userId: userState?.user?.id ?? '' },
    { skip: !userState?.user?.id },
  );

  return (
    <div
      className='mt-2 w-full rounded-2xl border border-white/70 bg-white/80 p-4 shadow-[0_8px_18px_-12px_rgba(15,23,42,0.35),_0_2px_4px_rgba(15,23,42,0.06)] backdrop-blur-sm transition-all duration-200 hover:shadow-[0_16px_28px_-18px_rgba(15,23,42,0.35),_0_6px_12px_rgba(15,23,42,0.08)]'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isLoading ? (
        <MealBoxSkeleton />
      ) : (
        <div>
          <MealBoxHeader
            onClearMealItems={() =>
              handleRemoveAllFoodInMealType(mealDate, mealType)
            }
            mealType={mealType}
            calories={totalCalories}
            dailyTarget={nutritionTargetData?.data?.calories}
            nutritionData={totalNutrition}
            mealItems={mealItems}
            isHovered={isHovered}
            onGenerateOptions={handleOpenSwapOptions}
            isGenerating={isGeneratingThisMeal}
            canGenerate={canGenerate}
            onOpenSetup={() => router.navigate({ to: nextSetupPath })}
          />
          <div className='rounded-xl bg-white/70'>
            <MealBoxContent
              mealDate={mealDate}
              mealType={mealType as keyof MealItems}
              mealItems={mealItems}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MealBox;
