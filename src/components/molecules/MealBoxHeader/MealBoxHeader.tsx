import React from 'react';
import {
  HiOutlineAdjustmentsVertical,
  HiOutlineArchiveBoxXMark,
  HiOutlineDocumentDuplicate,
} from 'react-icons/hi2';
import { MenuProps, Popover, Typography } from 'antd';

import { PairButton } from '@/atoms/PairButton';
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
}

const MealBoxHeader: React.FC<MealBoxHeaderProps> = ({
  mealType,
  calories,
  nutritionData,
  mealItems,
  isHovered,
  onClearMealItems,
}) => {
  // TODO: Implement onClick for each menu item
  const menuItems: MenuProps['items'] = [
    {
      label: 'Copy to another Meal Plan',
      icon: <HiOutlineDocumentDuplicate />,
      key: '0',
    },
    {
      label: 'Clear Foods',
      icon: <HiOutlineArchiveBoxXMark />,
      key: '1',
      onClick: () => {
        onClearMealItems();
      },
    },
    {
      type: 'divider',
    },
    {
      label: 'Edit Meal Setting',
      icon: <HiOutlineAdjustmentsVertical />,
      key: '2',
    },
  ];

  return (
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
            <Typography className='text-gray-500'>
              {calories} Calories
            </Typography>
          </Popover>
        )}
      </div>
      <PairButton isHovered={isHovered} menuItems={menuItems} />
    </div>
  );
};

export default MealBoxHeader;
