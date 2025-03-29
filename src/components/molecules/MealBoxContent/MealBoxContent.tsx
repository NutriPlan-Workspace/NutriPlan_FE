import React from 'react';
import { HiOutlineArrowPath } from 'react-icons/hi2';
import { Typography } from 'antd';

import { MealCard } from '@/organisms/MealCard';
import type { MealItem, MealPlanDay } from '@/types/mealPlan';

interface MealBoxContentProps {
  mealItems: MealItem[];
  mealDate: Date;
  mealType: keyof MealPlanDay['mealItems'];
  onAmountChange: (
    mealDate: Date,
    mealType: keyof MealPlanDay['mealItems'],
    mealItemId: string,
    newAmount: number,
    newUnit: number,
  ) => void;
}

const MealBoxContent: React.FC<MealBoxContentProps> = ({
  mealItems,
  mealDate,
  mealType,
  onAmountChange,
}) => (
  <>
    {mealItems.length === 0 && (
      <Typography className='mt-2 text-gray-500'>
        Hit{' '}
        <span className='inline-flex'>
          <HiOutlineArrowPath className='mx-1' />
        </span>{' '}
        to generate, or search for foods to add and drag them in.
      </Typography>
    )}
    <div>
      {mealItems.map((mealItem) => (
        <MealCard
          key={mealItem.foodId?.id}
          mealItem={mealItem}
          mealDate={mealDate}
          mealType={mealType}
          onAmountChange={onAmountChange}
        />
      ))}
    </div>
  </>
);

export default MealBoxContent;
