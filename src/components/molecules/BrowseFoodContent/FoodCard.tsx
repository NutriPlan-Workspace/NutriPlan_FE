import React from 'react';
import { useDispatch } from 'react-redux';
import { Popover } from 'antd';

import { PieChart } from '@/molecules/PieChart';
import {
  setIsModalDetailOpen,
  setViewingDetailFood,
} from '@/redux/slices/food';
import type { Food } from '@/types/food';

import { NutritionPopoverFood } from '../NutritionPopoverFood';

interface FoodCardProps {
  foodItem: Food;
}

const FoodCard: React.FC<FoodCardProps> = ({ foodItem }) => {
  const dispatch = useDispatch();
  return (
    <>
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
          <NutritionPopoverFood
            mealItem={{
              _id: foodItem._id,
              foodId: foodItem,
              amount: 1,
              unit: 1,
            }}
          />
        }
      >
        <div
          className='cursor-pointer rounded-lg border-none shadow-md'
          onClick={() => {
            dispatch(setViewingDetailFood(foodItem));
            dispatch(setIsModalDetailOpen(true));
          }}
        >
          <div className='h-full w-full'>
            <div className='h-full w-full'>
              <img
                src={foodItem.imgUrls ? foodItem.imgUrls[0] : ''}
                alt={foodItem.name}
                className='h-[200px] w-full rounded-t-md object-cover'
              />
            </div>
          </div>
          <div className='mt-2'>
            <p className='truncate px-2 text-center font-bold text-gray-800'>
              {foodItem.name}
            </p>
          </div>
          <div className='flex items-center justify-center gap-2 pt-1 pb-2'>
            <PieChart nutritionData={foodItem.nutrition} label={false} />
            <p className='text-sm text-gray-400'>{`${Math.round(foodItem.nutrition.calories).toString()} Calories`}</p>
          </div>
        </div>
      </Popover>
    </>
  );
};

export default FoodCard;
