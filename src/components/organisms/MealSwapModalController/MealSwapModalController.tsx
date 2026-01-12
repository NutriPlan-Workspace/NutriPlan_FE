import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { SwapOptionsModal } from '@/organisms/SwapOptionsModal';
import type { SwapModalFilters } from '@/redux/slices/mealPlan';
import {
  closeSwapModal,
  mealPlanSelector,
  setFlashMealCardIds,
  setSwapModalFilters,
  setSwapModalLoading,
  updateCacheMealPlanByDate,
  updateViewingMealPlanByDate,
} from '@/redux/slices/mealPlan';
import type { SwapFoodOption, SwapMealOption } from '@/types/mealSwap';
import { applySwap } from '@/utils/mealSwapApi';
import { showToastError } from '@/utils/toastUtils';

const MealSwapModalController: React.FC = () => {
  const dispatch = useDispatch();
  const swapModal = useSelector(mealPlanSelector).swapModal;

  const handleClose = useCallback(() => {
    dispatch(closeSwapModal());
  }, [dispatch]);

  const handleFiltersChange = useCallback(
    (filters: SwapModalFilters) => {
      dispatch(setSwapModalFilters({ filters }));
    },
    [dispatch],
  );

  const handleApply = useCallback(
    async (option: SwapFoodOption | SwapMealOption) => {
      if (
        !swapModal.data ||
        !swapModal.swapType ||
        !swapModal.mealPlanId ||
        !swapModal.mealType
      ) {
        return;
      }

      dispatch(setSwapModalLoading({ loading: true }));
      try {
        if (swapModal.swapType === 'food') {
          const foodOption = option as SwapFoodOption;
          if (!swapModal.targetItemId) {
            showToastError('Missing target item for swap.');
            return;
          }

          const updatedMealPlan = await applySwap(swapModal.mealPlanId, {
            swapType: 'food',
            mealType: swapModal.mealType,
            targetItemId: swapModal.targetItemId,
            targetFoodId: swapModal.targetFoodId,
            replacement: {
              foodId: foodOption.foodId,
              amount: foodOption.amount,
              unit: foodOption.unit,
            },
          });

          const mealPlanWithDate = {
            mealPlanDay: updatedMealPlan,
            mealDate: updatedMealPlan.mealDate,
          };
          dispatch(updateViewingMealPlanByDate({ mealPlanWithDate }));
          dispatch(updateCacheMealPlanByDate({ mealPlanWithDate }));
          dispatch(
            setFlashMealCardIds({ mealCardIds: [swapModal.targetItemId] }),
          );
          dispatch(closeSwapModal());
          return;
        }

        const mealOption = option as SwapMealOption;
        const updatedMealPlan = await applySwap(swapModal.mealPlanId, {
          swapType: 'meal',
          mealType: swapModal.mealType,
          replacement: {
            items: mealOption.items.map((item) => ({
              foodId: item.foodId,
              amount: item.amount ?? 0,
              unit: item.unit ?? 0,
            })),
          },
        });

        const mealPlanWithDate = {
          mealPlanDay: updatedMealPlan,
          mealDate: updatedMealPlan.mealDate,
        };
        dispatch(updateViewingMealPlanByDate({ mealPlanWithDate }));
        dispatch(updateCacheMealPlanByDate({ mealPlanWithDate }));
        dispatch(closeSwapModal());
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Swap apply failed';
        showToastError(message);
      } finally {
        dispatch(setSwapModalLoading({ loading: false }));
      }
    },
    [
      dispatch,
      swapModal.data,
      swapModal.mealPlanId,
      swapModal.mealType,
      swapModal.swapType,
      swapModal.targetFoodId,
      swapModal.targetItemId,
    ],
  );

  return (
    <SwapOptionsModal
      open={swapModal.open}
      onClose={handleClose}
      data={swapModal.data}
      isLoading={swapModal.loading}
      onApply={handleApply}
      title={
        swapModal.swapType === 'meal'
          ? `Generate meal options${swapModal.mealType ? ` for ${swapModal.mealType}` : ''}`
          : 'Swap options'
      }
      filters={swapModal.filters}
      onFiltersChange={handleFiltersChange}
    />
  );
};

export default MealSwapModalController;
