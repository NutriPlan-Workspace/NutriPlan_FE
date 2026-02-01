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
  showProgress?: boolean;
  targetPercentage?: number;
}

const DayBoxSummary: React.FC<DayBoxSummaryProps> = ({
  allDayMealItems,
  isLoading,
  targetNutrition,
  isWeekly,
  showProgress = true,
  targetPercentage = 100,
}) => {
  const [isTotalCaloriesOpen, setIsTotalCaloriesOpen] = useState(false);

  // Scale target nutrition by targetPercentage
  const scaledTargetNutrition = useMemo(() => {
    if (!targetNutrition) return undefined;
    const scale = targetPercentage / 100;
    return {
      ...targetNutrition,
      calories: Math.round(targetNutrition.calories * scale),
      proteinTarget: {
        from: Math.round(targetNutrition.proteinTarget.from * scale),
        to: Math.round(targetNutrition.proteinTarget.to * scale),
      },
      carbTarget: {
        from: Math.round(targetNutrition.carbTarget.from * scale),
        to: Math.round(targetNutrition.carbTarget.to * scale),
      },
      fatTarget: {
        from: Math.round(targetNutrition.fatTarget.from * scale),
        to: Math.round(targetNutrition.fatTarget.to * scale),
      },
      minimumFiber: targetNutrition.minimumFiber
        ? Math.round(targetNutrition.minimumFiber * scale)
        : undefined,
      maxiumSodium: targetNutrition.maxiumSodium
        ? Math.round(targetNutrition.maxiumSodium * scale)
        : undefined,
      maxiumCholesterol: targetNutrition.maxiumCholesterol
        ? Math.round(targetNutrition.maxiumCholesterol * scale)
        : undefined,
    };
  }, [targetNutrition, targetPercentage]);

  const totalNutrition = useMemo(
    () => (allDayMealItems ? getTotalNutrition(allDayMealItems) : undefined),
    [allDayMealItems],
  );

  const totalCalories = useMemo(
    () => (allDayMealItems ? getTotalCalories(allDayMealItems) : 0),
    [allDayMealItems],
  );

  const progress = useMemo(() => {
    if (!allDayMealItems || allDayMealItems.length === 0) return 0;
    const eatenCount = allDayMealItems.filter((item) => item.isEaten).length;
    return Math.round((eatenCount / allDayMealItems.length) * 100);
  }, [allDayMealItems]);

  const invalidKeys = useMemo(
    () => getInvalidNutritionKeys(totalNutrition, scaledTargetNutrition),
    [totalNutrition, scaledTargetNutrition],
  );
  return (
    <div
      className={cn({
        'invisible opacity-0': !allDayMealItems && !isLoading,
      })}
    >
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
              targetNutrition={scaledTargetNutrition}
              nutritionData={totalNutrition}
              onClick={() => setIsTotalCaloriesOpen(false)}
              title='PERCENT CALORIES FROM'
              targetPercentage={targetPercentage}
            />
          )
        }
      >
        <Button
          className={cn(
            'align-center flex h-[42px] w-full justify-start rounded-2xl border border-white/70 bg-white/75 px-4 shadow-[0_8px_18px_-12px_rgba(15,23,42,0.35),_0_2px_4px_rgba(15,23,42,0.06)] backdrop-blur-sm transition-all duration-200 hover:shadow-[0_14px_22px_-16px_rgba(15,23,42,0.35),_0_6px_10px_rgba(15,23,42,0.08)]',
            {
              'backdrop-blur-0 border-none bg-transparent shadow-none':
                isWeekly,
            },
          )}
        >
          {isLoading ? (
            <DayBoxSummarySkeleton />
          ) : (
            allDayMealItems && (
              <div className='flex items-center justify-start gap-2.5'>
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

      {!isLoading && allDayMealItems && showProgress && (
        <div className='mt-2'>
          <div className='relative h-3 w-full overflow-hidden rounded-full bg-slate-100'>
            <div
              className='bg-primary h-full rounded-full transition-[width] duration-500 ease-out'
              style={{ width: `${progress}%` }}
            />
            <span className='absolute inset-0 flex items-center justify-center text-xs font-bold text-black'>
              {progress}% eaten
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DayBoxSummary;
