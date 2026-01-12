import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'motion/react';

import { cn } from '@/helpers/helpers';
import { DayBoxHeader } from '@/molecules/DayBoxHeader';
import { DayBoxSummary } from '@/molecules/DayBoxSummary';
import { NutritionPopoverDay } from '@/molecules/NutritionPopoverDay';
import { DayBoxContent } from '@/organisms/DayBoxContent';
import {
  useAutoGenerateMealPlanMutation,
  useRemoveMealPlanMutation,
} from '@/redux/query/apis/mealPlan/mealPlanApi';
import { useGetNutritionTargetQuery } from '@/redux/query/apis/user/userApis';
import { mealPlanSelector, setViewingMealPlans } from '@/redux/slices/mealPlan';
import type { MealPlanDay } from '@/types/mealPlan';
import { getTotalNutrition } from '@/utils/calculateNutrition';
import { isSameDay, isSameDayAsToday } from '@/utils/dateUtils';
import { showToastError } from '@/utils/toastUtils';

interface DayBoxProps {
  mealPlanDay: MealPlanDay | undefined;
  mealDate: Date;
  isLoading: boolean;
  isSingleDay: boolean;
  onCreateBlank: (mealDate: string) => Promise<void>;
  onCopyPreviousDay: (mealDate: string) => Promise<void>;
}

const DayBox: React.FC<DayBoxProps> = ({
  mealPlanDay,
  mealDate,
  isLoading,
  isSingleDay,
  onCreateBlank,
  onCopyPreviousDay,
}) => {
  const mealItems = mealPlanDay?.mealItems || undefined;
  const allDayMealItems = useMemo(
    () =>
      mealItems
        ? [...mealItems.breakfast, ...mealItems.lunch, ...mealItems.dinner]
        : undefined,
    [mealItems],
  );
  const isToday = isSameDayAsToday(mealDate);
  const [isHovered, setIsHovered] = useState(false);

  const totalNutrition = useMemo(
    () => (allDayMealItems ? getTotalNutrition(allDayMealItems) : undefined),
    [allDayMealItems],
  );
  const { data } = useGetNutritionTargetQuery();
  const dispatch = useDispatch();
  const viewingMealPlans = useSelector(mealPlanSelector).viewingMealPlans;
  const [deleteMealPlan] = useRemoveMealPlanMutation();
  const [autoGenerateMealPlan, { isLoading: isGenerating }] =
    useAutoGenerateMealPlanMutation();
  const date = new Date(mealDate);
  const formattedDate = date.toISOString().slice(0, 10);

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

  const handleGenerateMealDay = async () => {
    try {
      await autoGenerateMealPlan({ date: date.toISOString() }).unwrap();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Auto generate failed';
      showToastError(message);
    }
  };

  return (
    <div
      className={cn(
        'border-l-borderGray border-t-borderGray mb-3 border-t-[4px] border-l-[1px] p-5',
        {
          'border-t-primary': isToday,
        },
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isSingleDay ? (
        <div
          className={cn('flex w-full justify-center', {
            'justify-center': !mealItems || !allDayMealItems?.length,
          })}
        >
          <div className='max-w-[450px] flex-1 px-4'>
            <DayBoxHeader
              onClearMealDay={() => handleRemoveMealDay(formattedDate)}
              onGenerateMealDay={handleGenerateMealDay}
              isGenerating={isGenerating}
              mealDate={mealDate}
              isToday={isToday}
              isHovered={isHovered}
              isLoading={isLoading}
            />
            <DayBoxContent
              mealItems={mealItems}
              mealDate={mealDate}
              isLoading={isLoading}
              onCreateBlank={onCreateBlank}
              onCopyPreviousDay={onCopyPreviousDay}
            />
          </div>
          {Boolean(allDayMealItems?.length) && (
            <div className='max-w-[450px] flex-1 px-4'>
              <NutritionPopoverDay
                targetNutrition={data?.data}
                nutritionData={totalNutrition}
                title='PERCENT CALORIES FROM'
                isSingleDay={isSingleDay}
              />
            </div>
          )}
        </div>
      ) : (
        <>
          <DayBoxHeader
            onClearMealDay={() => handleRemoveMealDay(formattedDate)}
            onGenerateMealDay={handleGenerateMealDay}
            isGenerating={isGenerating}
            mealDate={mealDate}
            isToday={isToday}
            isHovered={isHovered}
            isLoading={isLoading}
          />

          <motion.div
            key={isLoading ? 'loading' : 'content'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <DayBoxSummary
              targetNutrition={data?.data}
              allDayMealItems={allDayMealItems}
              isLoading={isLoading}
            />

            {/* Meal Boxes */}
            <DayBoxContent
              mealItems={mealItems}
              mealDate={mealDate}
              isLoading={isLoading}
              onCreateBlank={onCreateBlank}
              onCopyPreviousDay={onCopyPreviousDay}
            />
          </motion.div>
        </>
      )}
    </div>
  );
};

export default DayBox;
