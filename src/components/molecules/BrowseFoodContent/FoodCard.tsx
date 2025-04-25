import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from '@tanstack/react-router';
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
  showPopover?: boolean;
}

const FoodCard: React.FC<FoodCardProps> = ({ foodItem,   showPopover = true, }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const id = foodItem._id;

  const handleFoodCardClick = () => {
    navigate({
      to: '/custom-recipes/$id',
      params: { id },
    });
  };
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
        open={!showPopover ? showPopover : undefined}
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
            if (showPopover) {
              dispatch(setViewingDetailFood(foodItem));
              dispatch(setIsModalDetailOpen(true));
            } else {
              handleFoodCardClick();
            }
          }}
        >
          <div className='h-full w-full'>
            <div className='h-full w-full'>
              <img
                src={
                  foodItem.imgUrls?.[0] ||
                  'https://cdn.vectorstock.com/i/500p/42/11/creative-concept-of-brain-food-symbolized-vector-53434211.jpg'
                }
                alt={foodItem.name}
                key={foodItem.imgUrls?.[0]}
                className='h-[200px] w-full rounded-t-md object-cover'
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    'https://cdn.vectorstock.com/i/500p/42/11/creative-concept-of-brain-food-symbolized-vector-53434211.jpg';
                }}
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
            <p className='text-sm text-gray-400'>
              {`${Math.round(foodItem.nutrition?.calories ?? 0)} Calories`}
            </p>
          </div>
        </div>
      </Popover>
    </>
  );
};

export default FoodCard;
