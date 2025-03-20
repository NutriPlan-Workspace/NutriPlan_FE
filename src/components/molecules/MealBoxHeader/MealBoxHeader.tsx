import React from 'react';
import { Flex, Popover, Typography } from 'antd';

import { PairButton } from '@/atoms/PairButton';
import { NutritionPopoverMeal } from '@/molecules/NutritionPopoverMeal';
import type { Food, NutritionFields } from '@/types/food';

interface MealBoxHeaderProps {
  title: string;
  calories: number;
  nutritionData: NutritionFields;
  mealItems: Food[];
  isHovered: boolean;
}

const MealBoxHeader: React.FC<MealBoxHeaderProps> = ({
  title,
  calories,
  nutritionData,
  mealItems,
  isHovered,
}) => (
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
            <NutritionPopoverMeal nutritionData={nutritionData} title={title} />
          }
        >
          <Typography className='text-gray-500'>{calories} Calories</Typography>
        </Popover>
      )}
    </div>
    <PairButton isHovered={isHovered} />
  </Flex>
);

export default MealBoxHeader;
