import React from 'react';
import { HiOutlineArrowPath } from 'react-icons/hi2';
import { Typography } from 'antd';

import { MealCard } from '@/organisms/MealCard';
import type { Food } from '@/types/food';

interface MealBoxContentProps {
  mealItems: Food[];
}

const MealBoxContent: React.FC<MealBoxContentProps> = ({ mealItems }) => (
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
        <MealCard key={mealItem.id} mealItem={mealItem} />
      ))}
    </div>
  </>
);

export default MealBoxContent;
