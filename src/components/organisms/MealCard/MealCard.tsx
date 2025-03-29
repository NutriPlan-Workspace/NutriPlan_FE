import React, { useState } from 'react';
import { Image, Popover, Typography } from 'antd';

import { AmountSelector } from '@/molecules/AmountSelector';
import { NutritionPopoverFood } from '@/molecules/NutritionPopoverFood';
import type { MealItem, MealPlanDay } from '@/types/mealPlan';

import PairButton from '../../atoms/PairButton/PairButton';

const { Link } = Typography;

interface MealCardProps {
  mealItem: MealItem;
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

const MealCard: React.FC<MealCardProps> = ({
  mealItem,
  mealDate,
  mealType,
  onAmountChange,
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
      content={<NutritionPopoverFood mealItem={mealItem} showIngredient />}
    >
      <div
        className='hover:border-primary-400 flex rounded-[5px] border-2 border-transparent p-[3px_3px] transition-all duration-200 hover:border-2 hover:shadow-md'
        onMouseEnter={handleEnterHover}
        onMouseLeave={handleLeaveHover}
      >
        <Image
          src={mealItem.foodId?.imgUrls ? mealItem.foodId?.imgUrls[0] : ''}
          className={`h-[50px] w-[50px] max-w-[50px] rounded-[10px] object-cover transition-all duration-200 ${
            isHovered
              ? 'border-primary-400 border-2'
              : 'border-2 border-transparent'
          }`}
        />
        <div className='ml-[10px] flex w-full flex-col items-start justify-center pr-[10px]'>
          <Link className='mb-[2px] font-bold text-black transition-all duration-200 hover:underline'>
            {mealItem.foodId?.name}
          </Link>
          <AmountSelector
            currentUnit={mealItem.unit}
            currentAmount={mealItem.amount}
            options={mealItem.foodId?.units.map((unit) => ({
              amount: unit.amount,
              description: unit.description,
            }))}
            onAmountChange={(newAmount, newUnit) =>
              onAmountChange(
                mealDate,
                mealType,
                mealItem.id,
                newAmount,
                newUnit,
              )
            }
          />
        </div>
        <PairButton isHovered={isHovered} />
      </div>
    </Popover>
  );
};

export default MealCard;
