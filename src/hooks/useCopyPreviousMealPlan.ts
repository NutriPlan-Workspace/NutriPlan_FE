import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useGetLatestMealPlanMutation } from '@/redux/query/apis/mealPlan/mealPlanApi';
import {
  mealPlanSelector,
  updateViewingMealPlanByIndex,
} from '@/redux/slices/mealPlan';
import { isSameDay } from '@/utils/dateUtils';
import { showToastError } from '@/utils/toastUtils';

export const useCopyPreviousMealPlan = () => {
  const dispatch = useDispatch();
  const viewingMealPlans = useSelector(mealPlanSelector).viewingMealPlans;
  const [getLatestMealPlan] = useGetLatestMealPlanMutation();

  const handleCopyPreviousDay = useCallback(
    async (mealDate: string) => {
      const currentIndex = viewingMealPlans.findIndex((mealPlan) =>
        isSameDay(new Date(mealPlan.mealDate), new Date(mealDate)),
      );

      try {
        const mealPlan = await getLatestMealPlan({
          date: viewingMealPlans[currentIndex].mealDate,
        }).unwrap();

        if (mealPlan) {
          dispatch(
            updateViewingMealPlanByIndex({
              mealPlanWithDate: {
                mealDate: viewingMealPlans[currentIndex].mealDate,
                mealPlanDay: mealPlan.data,
              },
              index: currentIndex,
            }),
          );
        }
      } catch (error) {
        showToastError(`Error while fetching Meal Plan: ${error}`);
      }
    },
    [dispatch, getLatestMealPlan, viewingMealPlans],
  );

  return { handleCopyPreviousDay };
};
