import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { SwapOptionsModal } from '@/organisms/SwapOptionsModal';
import {
  useApplySwapMutation,
  useGetSwapOptionsMutation,
} from '@/redux/query/apis/mealPlan/mealPlanApi';
import { useGetNutritionTargetQuery } from '@/redux/query/apis/user/userApi';
import type { SwapModalFilters } from '@/redux/slices/mealPlan';
import {
  closeSwapModal,
  mealPlanSelector,
  setFlashMealCardIds,
  setSwapModalData,
  setSwapModalFilters,
  setSwapModalGenerationMode,
  setSwapModalLoading,
  setSwapModalTargetItemCount,
  updateCacheMealPlanByDate,
  updateViewingMealPlanByDate,
} from '@/redux/slices/mealPlan';
import type {
  SwapFoodOption,
  SwapMealOption,
  SwapOptionsRequest,
  SwapOptionsResponse as PlannerSwapOptionsResponse,
} from '@/types/mealSwap';
import { showToastError } from '@/utils/toastUtils';

const MealSwapModalController: React.FC = () => {
  const dispatch = useDispatch();
  const swapModal = useSelector(mealPlanSelector).swapModal;

  const [applySwap] = useApplySwapMutation();
  const [isDeepSearching, setIsDeepSearching] = React.useState(false);
  const [getSwapOptions] = useGetSwapOptionsMutation();

  const { data: nutritionData } = useGetNutritionTargetQuery({ userId: 'me' });

  const handleClose = useCallback(() => {
    dispatch(closeSwapModal());
  }, [dispatch]);
  // ... (skipping to props)
  // I can't do non-contiguous with replace_file_content properly if distance is large.
  // I'll do two replaces. First restore variables.

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

          const updatedMealPlan = await applySwap({
            mealPlanId: swapModal.mealPlanId,
            payload: {
              swapType: 'food',
              mealType: swapModal.mealType,
              targetItemId: swapModal.targetItemId,
              targetFoodId: swapModal.targetFoodId,
              replacement: {
                foodId: foodOption.foodId,
                amount: foodOption.amount,
                unit: foodOption.unit,
              },
            },
          }).unwrap();

          const mealPlanWithDate = {
            mealPlanDay: updatedMealPlan,
            mealDate: updatedMealPlan.mealDate,
          };
          dispatch(updateViewingMealPlanByDate({ mealPlanWithDate }));
          dispatch(updateCacheMealPlanByDate({ mealPlanWithDate }));

          // Find the new item ID to flash
          // We look for the item that matches the new foodId
          // If multiple match, we might take the last one or try to map index if possible.
          // For now, flashing all instances of the new food in that meal seems acceptable.
          const newItems = updatedMealPlan.mealItems[swapModal.mealType] || [];
          const flashedIds = newItems
            .filter((item) => {
              // Check if it matches the replacement foodId
              // Handle both populated object and string ID
              const fId =
                typeof item.foodId === 'string' ? item.foodId : item.foodId._id;
              return fId === foodOption.foodId;
            })
            .map((item) => item._id);

          dispatch(
            setFlashMealCardIds({
              mealCardIds:
                flashedIds.length > 0 ? flashedIds : [swapModal.targetItemId],
            }),
          );
          dispatch(closeSwapModal());
          return;
        }

        const mealOption = option as SwapMealOption;
        const updatedMealPlan = await applySwap({
          mealPlanId: swapModal.mealPlanId,
          payload: {
            swapType: 'meal',
            mealType: swapModal.mealType,
            replacement: {
              items: mealOption.items.map((item) => ({
                foodId: item.foodId,
                amount: item.amount ?? 0,
                unit: item.unit ?? 0,
              })),
            },
          },
        }).unwrap();

        const mealPlanWithDate = {
          mealPlanDay: updatedMealPlan,
          mealDate: updatedMealPlan.mealDate,
        };
        dispatch(updateViewingMealPlanByDate({ mealPlanWithDate }));

        // Flash all items in the replaced meal
        const newItems = updatedMealPlan.mealItems[swapModal.mealType] || [];
        const flashIds = newItems.map((item) => item._id);

        dispatch(setFlashMealCardIds({ mealCardIds: flashIds }));
        dispatch(closeSwapModal());
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Swap apply failed';
        showToastError(message);
      } finally {
        dispatch(setSwapModalLoading({ loading: false }));
        // Clear flash after animation
        setTimeout(() => {
          dispatch(setFlashMealCardIds({ mealCardIds: [] }));
        }, 2000);
      }
    },
    [
      applySwap,
      dispatch,
      swapModal.data,
      swapModal.mealPlanId,
      swapModal.mealType,
      swapModal.swapType,
      swapModal.targetFoodId,
      swapModal.targetItemId,
    ],
  );

  const fetchOptions = useCallback(
    async (
      overrides: {
        deepSearch?: boolean;
        generationMode?: 'percentage' | 'remaining';
        targetItemCount?: number;
        targetRatio?: number;
      } = {},
    ) => {
      if (!swapModal.mealPlanId || !swapModal.mealType || !swapModal.swapType) {
        return;
      }
      // Only set loading for non-deep search (deep search has its own loader)
      if (!overrides.deepSearch) {
        dispatch(setSwapModalLoading({ loading: true }));
      }

      try {
        const mode = overrides.generationMode ?? swapModal.generationMode;

        // Logic for targetItemCount: override > state > undefined
        // If passed as argument (e.g. from UI change), use it.
        const count =
          overrides.targetItemCount !== undefined
            ? overrides.targetItemCount
            : swapModal.targetItemCount;

        // Logic for targetRatio
        const ratio =
          overrides.targetRatio !== undefined
            ? overrides.targetRatio
            : swapModal.targetRatio;

        const resp = await getSwapOptions({
          mealPlanId: swapModal.mealPlanId,
          payload: {
            swapType: swapModal.swapType, // Using strict type from state
            mealType: swapModal.mealType,
            targetItemId: swapModal.targetItemId,
            targetFoodId: swapModal.targetFoodId,
            limit: 20,
            deepSearch: overrides.deepSearch,
            generationMode: mode,
            targetItemCount: count === 0 ? undefined : count, // Treat 0 as 'Auto'
            targetRatio: ratio,
            // Pass filters to the API payload
            search: swapModal.filters?.q,
            categoryIds: swapModal.filters?.categoryIds,
            dishType: swapModal.filters?.dishType as 'main' | 'side',
          } as unknown as SwapOptionsRequest,
        }).unwrap();

        // Handle potentially wrapped response
        const swapData =
          (resp as unknown as { data?: PlannerSwapOptionsResponse }).data ??
          resp;
        dispatch(setSwapModalData({ data: swapData }));
      } catch (error) {
        showToastError(
          error instanceof Error ? error.message : 'Failed to fetch options',
        );
      } finally {
        dispatch(setSwapModalLoading({ loading: false }));
        setIsDeepSearching(false);
      }
    },
    [
      dispatch,
      getSwapOptions,
      swapModal.generationMode,
      swapModal.targetItemCount,
      swapModal.targetRatio,
      swapModal.mealPlanId,
      swapModal.mealType,
      swapModal.swapType,
      swapModal.targetFoodId,
      swapModal.targetItemId,
      swapModal.filters, // Add filters dependency
    ],
  );

  // Trigger fetch when filters change
  React.useEffect(() => {
    // Debounce or check valid state before fetching
    if (swapModal.open && swapModal.mealPlanId) {
      fetchOptions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swapModal.filters]); // Only trigger on filter changes

  const handleGenerationModeChange = useCallback(
    (mode: 'percentage' | 'remaining') => {
      dispatch(setSwapModalGenerationMode({ mode }));
      // Fetch new options with new mode
      fetchOptions({ generationMode: mode });
    },
    [dispatch, fetchOptions],
  );

  const handleTargetItemCountChange = useCallback(
    (count?: number) => {
      dispatch(setSwapModalTargetItemCount({ count }));
      fetchOptions({ targetItemCount: count });
    },
    [dispatch, fetchOptions],
  );

  const handleDeepSearch = useCallback(() => {
    setIsDeepSearching(true);
    fetchOptions({ deepSearch: true });
  }, [fetchOptions]);

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
      generationMode={swapModal.generationMode}
      onGenerationModeChange={handleGenerationModeChange}
      targetItemCount={swapModal.targetItemCount}
      onTargetItemCountChange={handleTargetItemCountChange}
      // mealType not supported by component props
      onDeepSearch={handleDeepSearch}
      isDeepSearching={isDeepSearching}
      swapType={swapModal.swapType || undefined}
      currentMealRatio={(() => {
        if (!nutritionData?.data) return undefined;
        const goals = nutritionData.data;
        let ratio: number | undefined;
        if (swapModal.mealType === 'breakfast') ratio = goals.breakfastRatio;
        if (swapModal.mealType === 'lunch') ratio = goals.lunchRatio;
        if (swapModal.mealType === 'dinner') ratio = goals.dinnerRatio;
        return ratio ? Math.round(ratio * 100) : undefined;
      })()}
    />
  );
};

export default MealSwapModalController;
