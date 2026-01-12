import React from 'react';
import { HiOutlineArchiveBoxXMark, HiOutlineArrowPath } from 'react-icons/hi2';
import { Button, Popover, Typography } from 'antd';

import { cn } from '@/helpers/helpers';
import { NutritionPopoverMeal } from '@/molecules/NutritionPopoverMeal';
import type { NutritionFields } from '@/types/food';
import type { MealPlanFood } from '@/types/mealPlan';

interface MealBoxHeaderProps {
  mealType: string;
  calories: number;
  nutritionData: NutritionFields;
  mealItems: MealPlanFood[];
  isHovered: boolean;
  onClearMealItems: () => void;
  onGenerateOptions: () => void;
  isGenerating?: boolean;
}

const MealBoxHeader: React.FC<MealBoxHeaderProps> = ({
  mealType,
  calories,
  nutritionData,
  mealItems,
  isHovered,
  onClearMealItems,
  onGenerateOptions,
  isGenerating = false,
}) => (
  <div className='flex items-center justify-between'>
    <div>
      <Typography className='text-[18px] font-bold capitalize'>
        {mealType}
      </Typography>
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
              mealType={mealType}
            />
          }
        >
          <Typography className='text-gray-500'>{calories} Calories</Typography>
        </Popover>
      )}
    </div>
    <div
      className={cn(
        'ml-auto flex items-center justify-center transition-all duration-200',
        {
          'opacity-0': !isHovered,
        },
      )}
    >
      <Button
        onClick={(e) => {
          e.preventDefault();
          onGenerateOptions();
        }}
        type='text'
        shape='circle'
        icon={<HiOutlineArrowPath className='text-xl' />}
        loading={isGenerating}
      />
      <Button
        onClick={() => {
          onClearMealItems();
        }}
        type='text'
        shape='circle'
        icon={<HiOutlineArchiveBoxXMark className='text-xl' />}
      />
    </div>
  </div>
);
export default MealBoxHeader;
