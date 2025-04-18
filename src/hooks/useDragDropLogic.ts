import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/dist/types/types';

import { useUpdateMealPlanMutation } from '@/redux/query/apis/mealPlan/mealPlanApi';
import {
  mealPlanSelector,
  updateCacheMealPlanByDate,
  updateViewingMealPlanByDates,
} from '@/redux/slices/mealPlan';
import { MealItems, MealPlanDay, MealPlanFood } from '@/types/mealPlan';
import { isSameDay } from '@/utils/dateUtils';
import {
  getMealPlanDayAfterAddAndRemoveMealItem,
  getMealPlanDayAfterAddNewMealItem,
  getMealPlanDayAfterRemoveMealItem,
  getMealPlanDayDatabaseDTOByMealPlanDay,
} from '@/utils/mealPlan';
import { showToastError } from '@/utils/toastUtils';

export const useDragDropLogic = () => {
  const dispatch = useDispatch();
  const userMealPlan = useSelector(mealPlanSelector).viewingMealPlans;
  const [updateMealPlan] = useUpdateMealPlanMutation();

  const findMealPlanDay = useCallback(
    (mealDate: string) =>
      userMealPlan.find((mealPlan) =>
        isSameDay(new Date(mealPlan.mealDate), new Date(mealDate)),
      )?.mealPlanDay,
    [userMealPlan],
  );

  const findDestinationIndex = ({
    isSameMealBox,
    sourceMealCardIndex,
    destinationMealCardIndex,
    closestEdgeOfTarget,
  }: {
    isSameMealBox?: boolean | undefined;
    sourceMealCardIndex?: number | undefined;
    destinationMealCardIndex: number;
    closestEdgeOfTarget: Edge | null;
  }) => {
    if (isSameMealBox === undefined || sourceMealCardIndex === undefined) {
      return closestEdgeOfTarget === 'top'
        ? destinationMealCardIndex
        : destinationMealCardIndex + 1;
    }

    let newDestinationIndex =
      isSameMealBox && sourceMealCardIndex < destinationMealCardIndex
        ? destinationMealCardIndex - 1
        : destinationMealCardIndex;
    return closestEdgeOfTarget === 'top'
      ? newDestinationIndex
      : newDestinationIndex + 1;
  };

  const updateMealPlans = useCallback(
    async (updates: { mealDate: string; mealPlanDay: MealPlanDay }[]) => {
      // 1. Backup current state
      const previousState = updates.map(({ mealDate }) => {
        const current = findMealPlanDay(mealDate);
        return { mealDate, mealPlanDay: current };
      });

      try {
        // 2. Update UI
        dispatch(updateViewingMealPlanByDates({ mealPlanWithDates: updates }));
        updates.forEach(({ mealDate, mealPlanDay }) => {
          dispatch(
            updateCacheMealPlanByDate({
              mealPlanWithDate: { mealDate, mealPlanDay },
            }),
          );
        });

        // 3. Call API
        const responses = await Promise.all(
          updates.map(({ mealPlanDay }) =>
            updateMealPlan({
              mealPlan: getMealPlanDayDatabaseDTOByMealPlanDay(mealPlanDay),
            }).unwrap(),
          ),
        );

        // 4. Check for failures
        if (!responses.every((res) => res.success)) {
          throw new Error('Some API calls failed');
        }
      } catch (error) {
        showToastError(`Reverting optimistic update due to error:${error}`);

        // 5. Revert to previous state
        dispatch(
          updateViewingMealPlanByDates({ mealPlanWithDates: previousState }),
        );
        previousState.forEach(({ mealDate, mealPlanDay }) => {
          dispatch(
            updateCacheMealPlanByDate({
              mealPlanWithDate: { mealDate, mealPlanDay },
            }),
          );
        });
      }
    },
    [dispatch, updateMealPlan, findMealPlanDay],
  );

  const insertDestination = useCallback(
    ({
      mealDate,
      mealType,
      destinationIndex,
      mealCard,
    }: {
      mealDate: string;
      mealType: keyof MealItems;
      destinationIndex: number;
      mealCard: MealPlanFood;
    }) => {
      const mealPlanDay = findMealPlanDay(mealDate);
      const newMealPlanDay = getMealPlanDayAfterAddNewMealItem(
        mealPlanDay,
        mealType,
        mealCard,
        destinationIndex,
      );

      updateMealPlans([{ mealDate, mealPlanDay: newMealPlanDay }]);
    },
    [findMealPlanDay, updateMealPlans],
  );

  const removeSource = useCallback(
    ({
      mealDate,
      mealType,
      index,
    }: {
      mealDate: string;
      mealType: keyof MealItems;
      index: number;
    }) => {
      const mealPlanDay = findMealPlanDay(mealDate);
      const newMealPlanDay = getMealPlanDayAfterRemoveMealItem(
        mealPlanDay,
        mealType,
        index,
      );

      updateMealPlans([{ mealDate, mealPlanDay: newMealPlanDay }]);
    },
    [findMealPlanDay, updateMealPlans],
  );

  const removeSourceAndInsertDestinationSameDay = useCallback(
    ({
      mealDate,
      sourceMealType,
      sourceIndex,
      destinationMealType,
      destinationIndex,
    }: {
      mealDate: string;
      sourceMealType: keyof MealItems;
      sourceIndex: number;
      destinationMealType: keyof MealItems;
      destinationIndex: number;
    }) => {
      const mealPlanDay = findMealPlanDay(mealDate);

      const newMealPlanDay = getMealPlanDayAfterAddAndRemoveMealItem(
        mealPlanDay,
        sourceMealType,
        sourceIndex,
        destinationMealType,
        destinationIndex,
      );

      updateMealPlans([
        {
          mealDate,
          mealPlanDay: newMealPlanDay,
        },
      ]);
    },
    [findMealPlanDay, updateMealPlans],
  );

  const removeSourceAndInsertDestinationDiffDay = useCallback(
    ({
      sourceMealDate,
      sourceMealType,
      sourceIndex,
      destinationMealDate,
      destinationMealType,
      destinationIndex,
    }: {
      sourceMealDate: string;
      sourceMealType: keyof MealItems;
      sourceIndex: number;
      destinationMealDate: string;
      destinationMealType: keyof MealItems;
      destinationIndex: number;
    }) => {
      const sourceMealPlanDay = findMealPlanDay(sourceMealDate);
      const destinationMealPlanDay = findMealPlanDay(destinationMealDate);

      if (!sourceMealPlanDay || !destinationMealPlanDay) return;

      const newSourceMealPlanDay = getMealPlanDayAfterRemoveMealItem(
        sourceMealPlanDay,
        sourceMealType,
        sourceIndex,
      );

      const newDestinationMealPlanDay = getMealPlanDayAfterAddNewMealItem(
        destinationMealPlanDay,
        destinationMealType,
        sourceMealPlanDay.mealItems[sourceMealType][sourceIndex],
        destinationIndex,
      );

      updateMealPlans([
        {
          mealDate: sourceMealDate,
          mealPlanDay: newSourceMealPlanDay,
        },
        {
          mealDate: destinationMealDate,
          mealPlanDay: newDestinationMealPlanDay,
        },
      ]);
    },
    [findMealPlanDay, updateMealPlans],
  );

  return {
    insertDestination,
    removeSource,
    removeSourceAndInsertDestinationSameDay,
    removeSourceAndInsertDestinationDiffDay,
    findDestinationIndex,
  };
};
