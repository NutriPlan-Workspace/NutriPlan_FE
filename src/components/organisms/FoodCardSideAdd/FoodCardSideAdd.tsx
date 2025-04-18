import React, { useState } from 'react';
import { IoMdAdd } from 'react-icons/io';
import { Button, Image, Popover, Typography } from 'antd';

import { cn } from '@/helpers/helpers';
import { useFoodCardSideAddDrag } from '@/hooks/useFoodCardSideAddDrag';
import { NutritionPopoverFood } from '@/molecules/NutritionPopoverFood';
import type { Food } from '@/types/food';

const { Link } = Typography;

interface FoodCardSideAddProps {
  food: Food;
}

const FoodCardSideAdd: React.FC<FoodCardSideAddProps> = ({ food }) => {
  const [isHovered, setIsHovered] = useState(false);
  const handleEnterHover = () => setIsHovered(true);
  const handleLeaveHover = () => setIsHovered(false);

  const { isDragging, foodCardSideAddRef } = useFoodCardSideAddDrag({
    food: food,
  });

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
            src={food.imgUrls ? food.imgUrls[0] : ''}
            className={cn(
              'h-[50px] w-[50px] max-w-[50px] rounded-[10px] object-cover transition-all duration-200',
              isHovered
                ? 'border-primary-400 border-2'
                : 'border-2 border-transparent',
            )}
          />
          <div className='ml-[10px] flex w-full flex-col justify-center gap-[3px] pr-[10px]'>
            {/* title */}
            <Link className='leading-4.5 font-bold text-black transition-all duration-200 hover:underline'>
              {food.name}
            </Link>
          </div>
          <Button
            className={cn(
              'hover:bg-primary mr-2 flex h-[40px] w-[40px] items-center justify-center rounded-sm border-2 border-transparent px-2 py-0 hover:text-black',
              { 'border-primary-400': isHovered },
            )}
          >
            <IoMdAdd className='h-5 w-5 hover:text-black' />
          </Button>
        </div>
      </Popover>
    </div>
  );
};

export default FoodCardSideAdd;
