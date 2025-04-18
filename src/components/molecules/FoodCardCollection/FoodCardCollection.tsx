import React, { useState } from 'react';
import { MdDelete } from 'react-icons/md';
import { Image, Popover, Typography } from 'antd';

import { Button } from '@/atoms/Button';
import { cn } from '@/helpers/helpers';
import { NutritionPopoverFoodOverride } from '@/molecules/NutritionPopoverFood';
import type { Food } from '@/types/food';

const { Link } = Typography;

interface FoodCardCollectionProps {
  food: Food;
  onRemoveFood: (foodId: string) => void;
}

const FoodCardCollection: React.FC<FoodCardCollectionProps> = ({
  food,
  onRemoveFood,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const handleEnterHover = () => setIsHovered(true);
  const handleLeaveHover = () => setIsHovered(false);

  return (
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
      content={<NutritionPopoverFoodOverride food={food} showIngredient />}
    >
      <div
        className={cn(
          'flex max-w-[650px] items-center rounded-[5px] border-2 border-transparent bg-white p-[3px_3px] transition-all duration-200 hover:shadow-md',
          { 'border-primary-400': isHovered },
        )}
        onMouseEnter={handleEnterHover}
        onMouseLeave={handleLeaveHover}
      >
        <Image
          src={food.imgUrls[0]}
          className={`h-[50px] w-[50px] max-w-[50px] rounded-[10px] object-cover transition-all duration-200 ${isHovered ? 'border-primary-400 border-2' : 'border-2 border-transparent'}`}
        />
        <div className='ml-[10px] flex w-full flex-col justify-center gap-[3px] pr-[10px]'>
          <Link className='leading-4.5 font-bold text-black transition-all duration-200 hover:underline'>
            {food.name}
          </Link>
        </div>
        <Button
          className='hover:bg-primary-200 flex items-center justify-center rounded-full border-none p-2 hover:text-black'
          onClick={() => onRemoveFood?.(food._id)}
        >
          <MdDelete />
        </Button>
      </div>
    </Popover>
  );
};

export default FoodCardCollection;
