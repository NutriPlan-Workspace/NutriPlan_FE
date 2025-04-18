import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { skipToken } from '@reduxjs/toolkit/query/react';

import { useDate } from '@/contexts/DateContext';
import { useCreateBlankMealPlan } from '@/hooks/useCreateBlankMealPlan';
import { EmptyMealDay } from '@/molecules/EmptyMealDay';
import MealPlanHeader from '@/molecules/MealPlanHeader/MealPlanHeader';
import { MealBox } from '@/organisms/MealBox';
import {
  useGetMealPlanDayRangeQuery,
  useUpdateMealPlanMutation,
} from '@/redux/query/apis/mealPlan/mealPlanApi';
import { mealPlanSelector } from '@/redux/slices/mealPlan';
import type { MealPlanDay } from '@/types/mealPlan';
import { getMealDate } from '@/utils/dateUtils';

const MealPlanWeek: React.FC = () => {
  const viewingMealPlans = useSelector(mealPlanSelector).viewingMealPlans;
  const [updateMealPlan] = useUpdateMealPlanMutation();
  const { rangeDate, selectedDate } = useDate();
  const { handleCreateBlank } = useCreateBlankMealPlan();
  const mealRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const { from, to } =
    rangeDate?.from && rangeDate?.to
      ? { from: getMealDate(rangeDate.from), to: getMealDate(rangeDate.to) }
      : {};

  const { isFetching, refetch } = useGetMealPlanDayRangeQuery(
    from && to ? { from, to } : skipToken,
  );

  useEffect(() => {
    if (from && to) {
      refetch();
    }
  }, [from, to, refetch]);

  useEffect(() => {
    const today = getMealDate(new Date());
    const selectedMealDate = selectedDate ? getMealDate(selectedDate) : today;
    const ref = mealRefs.current[selectedMealDate];
    if (ref) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedDate, viewingMealPlans]);

  const handleUpdateMealItem = async (
    mealDate: Date,
    mealType: keyof MealPlanDay['mealItems'],
    mealItemId: string,
    newAmount: number,
    newUnit: number,
  ) => {
    const updatedMealPlans = viewingMealPlans.map((mealPlan) => {
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

    const updatedPlan = updatedMealPlans.find(
      (plan) => plan.mealDate.toString() === mealDate.toString(),
    );

    if (updatedPlan) {
      updateMealPlan(updatedPlan);
    }
  };

  // TODO: implement when task copy previous in progress
  const onCopyPreviousDay = () => {};

  return (
    <div className='flex flex-wrap gap-4 space-y-5 border-t-4 border-t-black/10'>
      {viewingMealPlans.map(({ mealDate, mealPlanDay }) => (
        <div
          key={mealDate}
          ref={(el) => {
            mealRefs.current[mealDate] = el;
          }}
          className='mx-[15px] mt-4 w-full border-b-3 border-b-black/10 pb-4'
        >
          <MealPlanHeader mealDate={mealDate} />

          {mealPlanDay ? (
            <div className='flex flex-wrap gap-4'>
              {(['breakfast', 'lunch', 'dinner'] as const).map((mealType) => (
                <div key={mealType} className='w-[390px]'>
                  <MealBox
                    mealItems={mealPlanDay.mealItems[mealType]}
                    onAmountChange={handleUpdateMealItem}
                    mealDate={mealDate}
                    mealType={mealType}
                    isLoading={isFetching}
                  />
                </div>
              ))}
            </div>
          ) : (
            <EmptyMealDay
              mealDate={getMealDate(new Date(mealDate))}
              isWeekly={true}
              onCreateBlank={handleCreateBlank}
              onCopyPreviousDay={onCopyPreviousDay}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default MealPlanWeek;
