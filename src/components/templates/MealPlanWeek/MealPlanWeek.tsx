import React, { useState } from 'react';

import MealPlanHeader from '@/molecules/MealPlanHeader/MealPlanHeader';
import { MealBox } from '@/organisms/MealBox';
import { useUpdateMealPlanMutation } from '@/redux/query/apis/mealPlan/mealPlanApi';
import type { MealPlanDay } from '@/types/mealPlan';
import {
  getTotalCalories,
  getTotalNutrition,
} from '@/utils/calculateNutrition';

interface MealPlanWeekProps {
  data: MealPlanDay[];
}

const MealPlanWeek: React.FC<MealPlanWeekProps> = ({ data }) => {
  const [mealPlans, setMealPlans] = useState<MealPlanDay[]>(data);
  const [updateMealPlan] = useUpdateMealPlanMutation();
  const handleUpdateMealItem = async (
    mealDate: Date,
    mealType: keyof MealPlanDay['mealItems'],
    mealItemId: string,
    newAmount: number,
    newUnit: number,
  ) => {
    const updatedMealPlans = mealPlans.map((mealPlan) => {
      if (mealPlan.mealDate.toString() === mealDate.toString()) {
        return {
          ...mealPlan,
          mealItems: {
            ...mealPlan.mealItems,
            [mealType]: mealPlan.mealItems[mealType].map((item) =>
              item.id === mealItemId
                ? { ...item, amount: newAmount, unit: newUnit }
                : item,
            ),
          },
        };
      }
      return mealPlan;
    });

    setMealPlans(updatedMealPlans);

    const updatedPlan = updatedMealPlans.find(
      (plan) => plan.mealDate.toString() === mealDate.toString(),
    );

    if (updatedPlan) {
      updateMealPlan(updatedPlan);
    }
  };

  return (
    <div className='flex flex-wrap gap-4 space-y-5'>
      {mealPlans.map((mealPlan) => (
        <div key={mealPlan.mealDate.toString()} className='w-full'>
          <MealPlanHeader mealDate={mealPlan.mealDate} />
          <div className='flex flex-wrap gap-4'>
            {(['breakfast', 'lunch', 'dinner'] as const).map((mealType) => (
              <div key={mealType} className='w-[400px]'>
                <MealBox
                  title={mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                  calories={getTotalCalories(mealPlan.mealItems[mealType])}
                  nutritionData={getTotalNutrition(
                    mealPlan.mealItems[mealType],
                  )}
                  mealItems={mealPlan.mealItems[mealType]}
                  onAmountChange={handleUpdateMealItem}
                  mealDate={mealPlan.mealDate}
                  mealType={mealType}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MealPlanWeek;
