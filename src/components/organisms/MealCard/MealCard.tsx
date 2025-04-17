import React, { useState } from 'react';
import { Image, Popover, Typography } from 'antd';

import { DropIndicator } from '@/atoms/DropIndicator';
import { PairButton } from '@/atoms/PairButton';
import { cn } from '@/helpers/helpers';
import { useMealCardDrag } from '@/hooks/useMealCardDrag';
import { AmountSelector } from '@/molecules/AmountSelector';
import { NutritionPopoverFood } from '@/molecules/NutritionPopoverFood';
import { Food } from '@/types/food';
import { MealPlanDay, MealPlanFood } from '@/types/mealPlan';

import { getMenuItems } from './MenuItemMealCard';

const { Link } = Typography;

interface MealCardProps {
  mealDate: string;
  mealType: keyof MealPlanDay['mealItems'];
  mealItem: MealPlanFood | Food;
  isAddFood?: boolean;
  onAmountChange?: (amount: number, unit: number, cardId: string) => void;
  onRemoveFood?: (cardId: string) => void;
  onDuplicateFood?: (cardId: string) => void;
}

const isMealPlanFood = (item: MealPlanFood | Food): item is MealPlanFood =>
  (item as MealPlanFood).foodId !== undefined;

const MealCard: React.FC<MealCardProps> = ({
  mealDate,
  mealType,
  mealItem,
  onAmountChange,
  onRemoveFood,
  onDuplicateFood,
  isAddFood = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const handleEnterHover = () => setIsHovered(true);
  const handleLeaveHover = () => setIsHovered(false);

  const { mealCardRef, isDragging, closestEdge, draggingCardHeight } =
    useMealCardDrag({
      mealDate,
      mealType,
      cardId: mealItem._id,
    });

  const food = isMealPlanFood(mealItem) ? mealItem.foodId : mealItem;

  const menuItems = getMenuItems({
    isAddFood,
    onRemoveFood,
    onDuplicateFood,
    mealItem,
  });

  return (
    <div className={cn('relative', { 'opacity-40': isDragging })}>
      {closestEdge === 'top' && (
        <DropIndicator edge='top' mealCardHeight={draggingCardHeight} />
      )}

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
          ref={mealCardRef}
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
              'h-[50px] w-[50px] max-w-[50px] rounded-[10px] border-2 border-transparent object-cover transition-all duration-200',
              { 'border-primary-400 border-2': isHovered },
            )}
          />
          <div className='ml-[10px] flex w-full flex-col justify-center gap-[3px] pr-[10px]'>
            {/* title */}
            <Link className='leading-4.5 font-bold text-black transition-all duration-200 hover:underline'>
              {food.name}
            </Link>
            {isMealPlanFood(mealItem) && onAmountChange && (
              <AmountSelector
                cardId={mealItem._id}
                currentUnit={mealItem.unit}
                currentAmount={mealItem.amount}
                options={food.units.map((unit, index) => ({
                  index: index,
                  amount: unit.amount,
                  description: unit.description,
                }))}
                onAmountChange={onAmountChange}
              />
            )}
          </div>
          {!isAddFood && (
            <PairButton isHovered={isHovered} menuItems={menuItems} />
          )}
        </div>
      </Popover>
      {closestEdge === 'bottom' && (
        <DropIndicator edge='bottom' mealCardHeight={draggingCardHeight} />
      )}
    </div>
  );
};

export default MealCard;
