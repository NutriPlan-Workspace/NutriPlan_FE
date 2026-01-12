import React, { useState } from 'react';
import { MdDelete } from 'react-icons/md';
import { Image, Popover, Typography } from 'antd';

import { Button } from '@/atoms/Button';
import { NUTRITION_POPOVER_BODY_STYLE } from '@/constants/popoverStyles';
import { cn } from '@/helpers/helpers';
import { NutritionPopoverFood } from '@/molecules/NutritionPopoverFood';
import type { Food } from '@/types/food';

const { Link } = Typography;

interface FoodCardCollectionProps {
  food: Food;
  onRemoveFood?: (foodId: string) => void;
  onClick?: (food: Food) => void;
}

const FoodCardCollection: React.FC<FoodCardCollectionProps> = ({
  food,
  onRemoveFood,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const handleEnterHover = () => setIsHovered(true);
  const handleLeaveHover = () => setIsHovered(false);

  return (
    <Popover
      mouseEnterDelay={0.5}
      placement='left'
      color='white'
      styles={{
        body: NUTRITION_POPOVER_BODY_STYLE,
      }}
      content={<NutritionPopoverFood mealItem={food} />}
    >
      <div
        className={cn(
          'flex max-w-[650px] items-center rounded-[5px] border-2 border-transparent bg-white p-[3px_3px] transition-all duration-200 hover:shadow-md',
          { 'border-primary-400': isHovered },
        )}
        onMouseEnter={handleEnterHover}
        onMouseLeave={handleLeaveHover}
        onClick={() => onClick?.(food)}
      >
        <Image
          src={
            food.imgUrls.length > 0
              ? food.imgUrls[0]
              : food.isRecipe
                ? 'https://res.cloudinary.com/dtwrwvffl/image/upload/v1746510206/k52mpavgekiqflwmk9ex.avif'
                : 'https://res.cloudinary.com/dtwrwvffl/image/upload/v1746510206/whuexhkydv7ubiqh5rxe.jpg'
          }
          className={`h-[50px] w-[50px] max-w-[50px] rounded-[10px] object-cover transition-all duration-200 ${isHovered ? 'border-primary-400 border-2' : 'border-2 border-transparent'}`}
        />
        <div className='ml-[10px] flex w-full flex-col justify-center gap-[3px] pr-[10px]'>
          <Link className='leading-4.5 font-bold text-black transition-all duration-200 hover:underline'>
            {food.name}
          </Link>
        </div>
        {onRemoveFood && (
          <Button
            className='hover:bg-primary-200 flex items-center justify-center rounded-full border-none p-2 hover:text-black'
            onClick={() => onRemoveFood?.(food._id)}
          >
            <MdDelete />
          </Button>
        )}
      </div>
    </Popover>
  );
};

export default FoodCardCollection;
