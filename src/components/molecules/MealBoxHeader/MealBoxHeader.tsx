import React from 'react';
import { Flex, Popover, Typography } from 'antd';

import { PairButton } from '@/atoms/PairButton';
import { NutritionPopoverMeal } from '@/molecules/NutritionPopoverMeal';
import type { NutritionFields } from '@/types/food';
import type { MealItem } from '@/types/mealPlan';
import { roundNumber } from '@/utils/roundNumber';

interface MealBoxHeaderProps {
  title: string;
  calories: number;
  nutritionData: NutritionFields;
  mealItems: MealItem[];
  isHovered: boolean;
}

const MealBoxHeader: React.FC<MealBoxHeaderProps> = ({
  title,
  calories,
  nutritionData,
  mealItems,
  isHovered,
}) => {
  const totalCalories =
    mealItems.length > 0
      ? (calories * mealItems[0]?.amount) /
        mealItems[0].foodId?.units?.[mealItems[0]?.unit]?.amount
      : 0;
  return (
    <Flex justify='space-between' align='center'>
      <div>
        <Typography className='text-[18px] font-bold'>{title}</Typography>
        {!mealItems.length ? (
          <Typography className='text-[13px] text-gray-500'>
            EMPTY MEAL
          </Typography>
        ) : (
          <Popover
            className='cursor-help'
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
              <NutritionPopoverMeal
                nutritionData={nutritionData}
                title={title}
              />
            }
          >
            <Typography className='text-gray-500'>
              {roundNumber(totalCalories, 1)} Calories
            </Typography>
          </Popover>
        )}
      </div>
      <PairButton isHovered={isHovered} />
    </Flex>
  );
};

export default MealBoxHeader;
