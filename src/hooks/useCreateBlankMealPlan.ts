import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useCreateMealPlanMutation } from '@/redux/query/apis/mealPlan/mealPlanApi';
import {
  addCacheMealPlans,
  mealPlanSelector,
  updateViewingMealPlanByIndex,
} from '@/redux/slices/mealPlan';
import { isSameDay } from '@/utils/dateUtils';
import { generateEmptyMealPlan } from '@/utils/mealPlan';

export const useCreateBlankMealPlan = () => {
  const dispatch = useDispatch();
  const viewingMealPlans = useSelector(mealPlanSelector).viewingMealPlans;
  const [createMealPlan] = useCreateMealPlanMutation();

  const handleCreateBlank = useCallback(
    async (mealDate: string) => {
      const mealPlanData = generateEmptyMealPlan(mealDate);
      try {
        const response = await createMealPlan({
          mealPlan: mealPlanData,
        }).unwrap();

        const mealPlanWithDate = {
          mealDate,
          mealPlanDay: response.data,
        };

        const index = viewingMealPlans.findIndex((mealPlan) =>
          isSameDay(new Date(mealPlan.mealDate), new Date(mealDate)),
        );

        if (index >= 0) {
          dispatch(updateViewingMealPlanByIndex({ mealPlanWithDate, index }));
        } else {
          dispatch(
            addCacheMealPlans({ mealPlanWithDates: [mealPlanWithDate] }),
          );
        }
      } catch (error) {
        console.error('Failed to create meal plan', error);
        throw error;
      }
    },
    [viewingMealPlans, dispatch],
  );

  return { handleCreateBlank };
};
