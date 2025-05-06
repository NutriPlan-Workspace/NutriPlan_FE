import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { MealBoxHeader } from '@/molecules/MealBoxHeader';
import { MealBoxSkeleton } from '@/molecules/MealBoxSkeleton';
import { MealBoxContent } from '@/organisms/MealBoxContent';
import { useUpdateMealPlanMutation } from '@/redux/query/apis/mealPlan/mealPlanApi';
import {
  mealPlanSelector,
  updateViewingMealPlanByDate,
} from '@/redux/slices/mealPlan';
import type { MealItems, MealPlanDay, MealPlanFood } from '@/types/mealPlan';
import {
  getTotalCalories,
  getTotalNutrition,
} from '@/utils/calculateNutrition';
import { isSameDay } from '@/utils/dateUtils';
import { getMealPlanDayDatabaseDTOByMealPlanDay } from '@/utils/mealPlan';

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
  const dispatch = useDispatch();
  const [updateMealPlan] = useUpdateMealPlanMutation();
  const viewingMealPlan = useSelector(mealPlanSelector).viewingMealPlans;

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

  return (
    <div
      className='mt-1 w-full rounded-sm bg-white p-4 shadow-[0_2px_2px_0_rgba(0,0,0,0.05),_0_0_2px_0_rgba(35,31,32,0.1)] transition-all duration-200 hover:shadow-[0px_12px_12px_rgba(0,0,0,0.05),_0px_0px_12px_rgba(35,31,32,0.1)]'
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
            calories={getTotalCalories(mealItems)}
            nutritionData={getTotalNutrition(mealItems)}
            mealItems={mealItems}
            isHovered={isHovered}
          />
          <div className='rounded-lg bg-white'>
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
