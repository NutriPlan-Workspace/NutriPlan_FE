import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Image, Popover, Typography } from 'antd';

import { cn } from '@/helpers/helpers';
import { useFoodCardSideAddDrag } from '@/hooks/useFoodCardSideAddDrag';
import { NutritionPopoverFood } from '@/molecules/NutritionPopoverFood';
import {
  setIsModalDetailOpen,
  setViewingDetailFood,
} from '@/redux/slices/food';
import type { Food } from '@/types/food';

const { Link } = Typography;

interface FoodCardSideAddProps {
  food: Food;
}

const FoodCardSideAdd: React.FC<FoodCardSideAddProps> = ({ food }) => {
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);

  const { isDragging, foodCardSideAddRef } = useFoodCardSideAddDrag({ food });

  const handleEnterHover = () => setIsHovered(true);
  const handleLeaveHover = () => setIsHovered(false);

  return (
    <div className={cn({ 'opacity-40': isDragging })}>
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
        content={<NutritionPopoverFood mealItem={food} />}
      >
        <div
          ref={foodCardSideAddRef}
          className={cn(
            'flex items-center rounded-[5px] border-2 border-transparent bg-white p-[3px] transition-all duration-200 hover:shadow-md',
            { 'border-primary-400': isHovered },
          )}
          onMouseEnter={handleEnterHover}
          onMouseLeave={handleLeaveHover}
        >
          <Image
            src={food.imgUrls?.[0] || ''}
            className={cn(
              'h-[50px] w-[50px] max-w-[50px] rounded-[10px] object-cover transition-all duration-200',
              isHovered
                ? 'border-primary-400 border-2'
                : 'border-2 border-transparent',
            )}
          />
          <div className='ml-[10px] flex w-full flex-col justify-center gap-[3px] pr-[10px]'>
            <Link
              onClick={() => {
                dispatch(setViewingDetailFood(food));
                dispatch(setIsModalDetailOpen(true));
              }}
              className='leading-4.5 font-bold text-black transition-all duration-200 hover:underline'
            >
              {food.name}
            </Link>
          </div>
        </div>
      </Popover>
    </div>
  );
};

export default FoodCardSideAdd;
