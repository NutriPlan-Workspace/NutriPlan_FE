import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { reorder } from '@atlaskit/pragmatic-drag-and-drop/reorder';

import { useUpdateMealPlanMutation } from '@/redux/query/apis/mealPlan/mealPlanApi';
import {
  mealPlanSelector,
  updateCacheMealPlanByDate,
  updateViewingMealPlanByDates,
} from '@/redux/slices/mealPlan';
import { MealItems, MealPlanDay } from '@/types/mealPlan';
import { isSameDay } from '@/utils/dateUtils';
import {
  getMealPlanDayAfterAddNewMeal,
  getMealPlanDayAfterMovingMealInSameDay,
  getMealPlanDayAfterRemoveMealItem,
  getMealPlanDayDatabaseDTOByMealPlanDay,
} from '@/utils/mealPlan';

interface MoveMealCardParams {
  movedMealCardIndexInSourceMealBox: number;
  sourceMealDate: string;
  sourceMealType: keyof MealItems;
  movedMealCardIndexInDestinationMealBox: number;
  destinationMealDate: string;
  destinationMealType: keyof MealItems;
}

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

  const updateMealPlans = useCallback(
    async (updates: { mealDate: string; mealPlanDay: MealPlanDay }[]) => {
      const responses = await Promise.all(
        updates.map(({ mealPlanDay }) =>
          updateMealPlan({
            mealPlan: getMealPlanDayDatabaseDTOByMealPlanDay(mealPlanDay),
          }).unwrap(),
        ),
      );

      if (responses.every((res) => res.success)) {
        dispatch(updateViewingMealPlanByDates({ mealPlanWithDates: updates }));
        updates.forEach(({ mealDate, mealPlanDay }) => {
          dispatch(
            updateCacheMealPlanByDate({
              mealPlanWithDate: { mealDate, mealPlanDay },
            }),
          );
        });
      }
    },
    [dispatch, updateMealPlan],
  );

  const moveMealCard = useCallback(
    async (params: MoveMealCardParams) => {
      const isSameDayMove =
        params.sourceMealDate === params.destinationMealDate;
      const mealPlanDay = findMealPlanDay(params.sourceMealDate);
      if (!mealPlanDay) return;

      const sourceMealBoxItems = mealPlanDay.mealItems[params.sourceMealType];
      const mealItemToMove =
        sourceMealBoxItems?.[params.movedMealCardIndexInSourceMealBox];
      if (!mealItemToMove) return;

      const newSourceMealItems = sourceMealBoxItems.filter(
        (mealItem) => mealItem._id !== mealItemToMove._id,
      );

      const newDestinationMealItems = [
        ...(isSameDayMove
          ? mealPlanDay.mealItems[params.destinationMealType]
          : findMealPlanDay(params.destinationMealDate)?.mealItems[
              params.destinationMealType
            ] || []),
      ];
      newDestinationMealItems.splice(
        params.movedMealCardIndexInDestinationMealBox ?? 0,
        0,
        { ...mealItemToMove },
      );

      const newMealPlanDay = isSameDayMove
        ? getMealPlanDayAfterMovingMealInSameDay(
            newSourceMealItems,
            newDestinationMealItems,
            params.sourceMealType,
            params.destinationMealType,
            mealPlanDay,
          )
        : getMealPlanDayAfterRemoveMealItem(
            mealPlanDay,
            params.sourceMealType,
            mealItemToMove._id,
          );

      const newDestinationMealPlanDay = !isSameDayMove
        ? getMealPlanDayAfterAddNewMeal(
            newDestinationMealItems,
            params.destinationMealType,
            findMealPlanDay(params.destinationMealDate),
          )
        : undefined;

      await updateMealPlans([
        { mealDate: params.sourceMealDate, mealPlanDay: newMealPlanDay },
        ...(newDestinationMealPlanDay
          ? [
              {
                mealDate: params.destinationMealDate,
                mealPlanDay: newDestinationMealPlanDay,
              },
            ]
          : []),
      ]);
    },
    [findMealPlanDay, updateMealPlans],
  );

  const reorderMealCard = useCallback(
    async ({
      mealDate,
      mealType,
      startIndex,
      finishIndex,
    }: {
      mealDate: string;
      mealType: keyof MealItems;
      startIndex: number;
      finishIndex: number;
    }) => {
      const mealPlanDay = findMealPlanDay(mealDate);
      if (!mealPlanDay) return;

      const mealBoxItems = mealPlanDay.mealItems[mealType];
      if (!mealBoxItems) return;

      const reorderedMealBoxItems = reorder({
        list: mealBoxItems,
        startIndex,
        finishIndex,
      });

      const newMealPlanDay = getMealPlanDayAfterAddNewMeal(
        reorderedMealBoxItems,
        mealType,
        mealPlanDay,
      );

      await updateMealPlans([{ mealDate, mealPlanDay: newMealPlanDay }]);
    },
    [findMealPlanDay, updateMealPlans],
  );

  return { moveMealCard, reorderMealCard };
};
