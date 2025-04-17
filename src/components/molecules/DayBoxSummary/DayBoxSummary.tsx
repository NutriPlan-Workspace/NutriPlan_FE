import React, { useState } from 'react';
import { LuInfo } from 'react-icons/lu';
import { Button, Popover, Typography } from 'antd';

import { cn } from '@/helpers/helpers';
import { NutritionPopoverDay } from '@/molecules/NutritionPopoverDay';
import { PieChart } from '@/molecules/PieChart';
import type { MealPlanFood } from '@/types/mealPlan';
import {
  getTotalCalories,
  getTotalNutrition,
} from '@/utils/calculateNutrition';

import { DayBoxSummarySkeleton } from '../DayBoxSummarySkeleton';

interface DayBoxSummaryProps {
  allDayMealItems: MealPlanFood[] | undefined;
  isLoading: boolean;
}

const DayBoxSummary: React.FC<DayBoxSummaryProps> = ({
  allDayMealItems,
  isLoading,
}) => {
  const [isTotalCaloriesOpen, setIsTotalCaloriesOpen] = useState(false);

  return (
    <Popover
      open={isTotalCaloriesOpen}
      onOpenChange={setIsTotalCaloriesOpen}
      trigger='click'
      placement='left'
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
            nutritionData={getTotalNutrition(allDayMealItems)}
            onClick={() => setIsTotalCaloriesOpen(false)}
            title='PERCENT CALORIES FROM'
          />
        )
      }
    >
      <Button
        className={cn(
          'align-center border-borderGray flex h-[42px] w-full justify-start rounded-md border-1 px-4 shadow-[0_2px_2px_0_rgba(0,0,0,0.05),_0_0_2px_0_rgba(35,31,32,0.1)] transition-all duration-200 hover:shadow-[0px_8px_8px_rgba(0,0,0,0.05),_0px_0px_8px_rgba(35,31,32,0.1)]',
          { 'invisible opacity-0': !allDayMealItems?.length && !isLoading },
        )}
      >
        {isLoading ? (
          <DayBoxSummarySkeleton />
        ) : (
          allDayMealItems && (
            <div className='flex items-center justify-start gap-2.5'>
              {/* Default calories content */}
              <PieChart
                nutritionData={getTotalNutrition(allDayMealItems)}
                size={25}
                label={false}
              />
              <Typography className='inline-flex items-center gap-2'>
                {getTotalCalories(allDayMealItems)} Calories
                <LuInfo className='text-textGray text-base' />
              </Typography>
            </div>
          )
        )}
      </Button>
    </Popover>
  );
};

export default DayBoxSummary;
