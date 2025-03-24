import React from 'react';
import { Popover } from 'antd';

import { PieChart } from '@/molecules/PieChart';
import type { Food } from '@/types/food';

import { NutritionPopoverFood } from '../NutritionPopoverFood';

interface FoodCardProps {
  foodItem: Food;
}

const FoodCard: React.FC<FoodCardProps> = ({ foodItem }) => (
  <Popover
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
      <NutritionPopoverFood mealItem={foodItem} showIngredient={false} />
    }
  >
    <div className='cursor-pointer rounded-lg border-none'>
      <div className='h-full w-full'>
        <div className='h-full w-full'>
          <img
            src={foodItem.imgUrls ? foodItem.imgUrls[0] : ''}
            alt={foodItem.name}
            className='h-full w-full rounded-md object-cover'
          />
        </div>
      </div>
      <div className='mt-2'>
        <p className='text-center font-bold text-gray-800'>{foodItem.name}</p>
      </div>
      <div className='flex items-center justify-center gap-2 pt-1'>
        <PieChart nutritionData={foodItem.nutrition} label={false} />
        <p className='text-sm text-gray-400'>{`${Math.round(foodItem.nutrition.calories).toString()} Calories`}</p>
      </div>
    </div>
  </Popover>
);
export default FoodCard;
