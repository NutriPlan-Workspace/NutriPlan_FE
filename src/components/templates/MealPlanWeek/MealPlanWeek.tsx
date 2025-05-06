import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { skipToken } from '@reduxjs/toolkit/query/react';

import { useDate } from '@/contexts/DateContext';
import { useCopyPreviousMealPlan } from '@/hooks/useCopyPreviousMealPlan';
import { useCreateBlankMealPlan } from '@/hooks/useCreateBlankMealPlan';
import { useMealTrackDragDrop } from '@/hooks/useMealTrackDragDrop';
import { EmptyMealDay } from '@/molecules/EmptyMealDay';
import MealPlanHeader from '@/molecules/MealPlanHeader/MealPlanHeader';
import { MealBox } from '@/organisms/MealBox';
import {
  useGetMealPlanDayRangeQuery,
  useRemoveMealPlanMutation,
} from '@/redux/query/apis/mealPlan/mealPlanApi';
import { mealPlanSelector, setViewingMealPlans } from '@/redux/slices/mealPlan';
import { getMealDate, isSameDay } from '@/utils/dateUtils';

const MealPlanWeek: React.FC = () => {
  const viewingMealPlans = useSelector(mealPlanSelector).viewingMealPlans;
  const mealRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const isFirstRender = useRef(true);
  const { rangeDate, selectedDate } = useDate();
  const { handleCreateBlank } = useCreateBlankMealPlan();
  const { handleCopyPreviousDay } = useCopyPreviousMealPlan();
  useMealTrackDragDrop();
  const [deleteMealPlan] = useRemoveMealPlanMutation();
  const { from, to } =
    rangeDate?.from && rangeDate?.to
      ? { from: getMealDate(rangeDate.from), to: getMealDate(rangeDate.to) }
      : {};
  const dispatch = useDispatch();
  const { isFetching, refetch } = useGetMealPlanDayRangeQuery(
    from && to ? { from, to } : skipToken,
  );
  const handleRemoveMealDay = async (mealDate: string) => {
    const mealPlanToDelete = viewingMealPlans.find((mealPlan) =>
      isSameDay(new Date(mealPlan.mealDate), new Date(mealDate)),
    );
    if (!mealPlanToDelete || !mealPlanToDelete.mealPlanDay?._id) {
      return;
    }
    await deleteMealPlan(mealPlanToDelete.mealPlanDay._id);
    const updatedPlans = viewingMealPlans.map((plan) =>
      isSameDay(new Date(plan.mealDate), new Date(mealDate))
        ? { ...plan, mealPlanDay: undefined }
        : plan,
    );
    dispatch(setViewingMealPlans({ mealPlanWithDates: updatedPlans }));
  };

  useEffect(() => {
    if (from && to) {
      refetch();
    }
  }, [from, to, refetch]);

  useEffect(() => {
    if (!isFetching && viewingMealPlans.length > 0) {
      mealRefs.current = {};

      viewingMealPlans.forEach(({ mealDate }) => {
        const element = document.getElementById(`meal-day-${mealDate}`);
        if (element) {
          mealRefs.current[mealDate] = element as HTMLDivElement;
        }
      });
    }
  }, [viewingMealPlans, isFetching]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const today = getMealDate(new Date());
    const selectedMealDate = selectedDate ? getMealDate(selectedDate) : today;
    const ref = mealRefs.current[selectedMealDate];
    if (ref) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedDate]);

  return (
    <div className='flex flex-wrap gap-4 space-y-5 border-t-4 border-t-black/10'>
      {viewingMealPlans.map(({ mealDate, mealPlanDay }) => (
        <div
          key={mealDate}
          id={`meal-day-${mealDate}`}
          className='mx-[15px] mt-4 w-full border-b-3 border-b-black/10 pb-4'
        >
          <MealPlanHeader
            mealDate={mealDate}
            mealPlanDay={mealPlanDay}
            onClearMealDay={() =>
              handleRemoveMealDay(new Date(mealDate).toISOString().slice(0, 10))
            }
          />

          {mealPlanDay ? (
            <div className='flex flex-wrap gap-4'>
              {(['breakfast', 'lunch', 'dinner'] as const).map((mealType) => (
                <div key={mealType} className='w-[390px]'>
                  <MealBox
                    mealItems={mealPlanDay.mealItems[mealType]}
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
              onCopyPreviousDay={handleCopyPreviousDay}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default MealPlanWeek;
