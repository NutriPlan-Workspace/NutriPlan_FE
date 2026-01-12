import React, { useMemo, useState } from 'react';
import { IoWarning } from 'react-icons/io5';
import { LuInfo } from 'react-icons/lu';
import { Button, Popover, Typography } from 'antd';

import { cn } from '@/helpers/helpers';
import { NutritionPopoverDay } from '@/molecules/NutritionPopoverDay';
import { PieChart } from '@/molecules/PieChart';
import type { MealPlanFood } from '@/types/mealPlan';
import type { NutritionGoal } from '@/types/user';
import {
  getInvalidNutritionKeys,
  getTotalCalories,
  getTotalNutrition,
} from '@/utils/calculateNutrition';

import { DayBoxSummarySkeleton } from '../DayBoxSummarySkeleton';

interface DayBoxSummaryProps {
  allDayMealItems: MealPlanFood[] | undefined;
  isLoading?: boolean;
  isWeekly?: boolean;
  targetNutrition?: NutritionGoal;
}

const DayBoxSummary: React.FC<DayBoxSummaryProps> = ({
  allDayMealItems,
  isLoading,
  targetNutrition,
  isWeekly,
}) => {
  const [isTotalCaloriesOpen, setIsTotalCaloriesOpen] = useState(false);

  const totalNutrition = useMemo(
    () => (allDayMealItems ? getTotalNutrition(allDayMealItems) : undefined),
    [allDayMealItems],
  );

  const totalCalories = useMemo(
    () => (allDayMealItems ? getTotalCalories(allDayMealItems) : 0),
    [allDayMealItems],
  );

  const invalidKeys = useMemo(
    () => getInvalidNutritionKeys(totalNutrition, targetNutrition),
    [totalNutrition, targetNutrition],
  );
  return (
    <Popover
      mouseEnterDelay={0.5}
      open={isTotalCaloriesOpen}
      onOpenChange={setIsTotalCaloriesOpen}
      trigger='click'
      placement={isWeekly ? 'right' : 'left'}
      color='white'
      styles={{
        body: {
          padding: 0,
          borderRadius: '10px',
          overflow: 'hidden',
        },
      }}
      content={
        allDayMealItems && (
          <NutritionPopoverDay
            targetNutrition={targetNutrition}
            nutritionData={totalNutrition}
            onClick={() => setIsTotalCaloriesOpen(false)}
            title='PERCENT CALORIES FROM'
          />
        )
      }
    >
      <Button
        className={cn(
          'align-center flex h-[42px] w-full justify-start rounded-2xl border border-white/70 bg-white/75 px-4 shadow-[0_8px_18px_-12px_rgba(15,23,42,0.35),_0_2px_4px_rgba(15,23,42,0.06)] backdrop-blur-sm transition-all duration-200 hover:shadow-[0_14px_22px_-16px_rgba(15,23,42,0.35),_0_6px_10px_rgba(15,23,42,0.08)]',
          {
            'backdrop-blur-0 border-none bg-transparent shadow-none': isWeekly,
            'invisible opacity-0': !allDayMealItems && !isLoading,
          },
        )}
      >
        {isLoading ? (
          <DayBoxSummarySkeleton />
        ) : (
          allDayMealItems && (
            <div className='flex items-center justify-start gap-2.5'>
              {/* Default calories content */}
              <PieChart
                nutritionData={totalNutrition}
                size={25}
                label={false}
              />
              <Typography
                className={cn('inline-flex items-center gap-1', {
                  'cursor-pointer hover:underline': isWeekly,
                })}
              >
                {totalCalories} Calories
                <LuInfo className='text-textGray text-base' />
                {invalidKeys.length !== 0 && (
                  <IoWarning className='text-[20px] text-yellow-500' />
                )}
              </Typography>
            </div>
          )
        )}
      </Button>
    </Popover>
  );
};

export default DayBoxSummary;
