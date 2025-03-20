import React, { useState } from 'react';
import { Image, Popover, Typography } from 'antd';

import { AmountSelector } from '@/molecules/AmountSelector';
import { NutritionPopoverFood } from '@/molecules/NutritionPopoverFood';
import type { Food } from '@/types/food';

import PairButton from '../../atoms/PairButton/PairButton';

const { Link } = Typography;

interface MealCardProps {
  mealItem: Food;
}

const MealCard: React.FC<MealCardProps> = ({ mealItem }) => {
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
      content={<NutritionPopoverFood mealItem={mealItem} />}
    >
      <div
        className='hover:border-primary-400 flex rounded-[5px] border-2 border-transparent p-[3px_3px] transition-all duration-200 hover:border-2 hover:shadow-md'
        onMouseEnter={handleEnterHover}
        onMouseLeave={handleLeaveHover}
      >
        {/* image */}
        <Image
          src={mealItem.imgUrls ? mealItem.imgUrls[0] : ''}
          className={`h-[50px] w-[50px] max-w-[50px] rounded-[10px] object-cover transition-all duration-200 ${isHovered ? 'border-primary-400 border-2' : 'border-2 border-transparent'}`}
        />
        <div className='ml-[10px] flex w-full flex-col items-start justify-center pr-[10px]'>
          {/* title */}
          <Link className='mb-[2px] font-bold text-black transition-all duration-200 hover:underline'>
            {mealItem.name}
          </Link>
          {/* unit */}
          <AmountSelector
            defaultOptionValue={mealItem.defaultUnit.toString()}
            options={mealItem.units.map((unit) => ({
              value: unit.amount.toString(),
              amount: unit.amount,
              label: unit.description,
            }))}
          />
        </div>
        <PairButton isHovered={isHovered} />
      </div>
    </Popover>
  );
};

export default MealCard;
