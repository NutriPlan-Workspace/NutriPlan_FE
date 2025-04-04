import React, { useState } from 'react';
import {
  HiOutlineArchiveBoxXMark,
  HiOutlineDocumentDuplicate,
  HiOutlineStar,
} from 'react-icons/hi2';
import { Image, MenuProps, Popover, Typography } from 'antd';

import { DropIndicator } from '@/atoms/DropIndicator';
import PairButton from '@/atoms/PairButton/PairButton';
import { cn } from '@/helpers/helpers';
import { useMealCardDrag } from '@/hooks/useMealCardDrag';
import { AmountSelector } from '@/molecules/AmountSelector';
import { NutritionPopoverFood } from '@/molecules/NutritionPopoverFood';
import { MealPlanDay, MealPlanFood } from '@/types/mealPlan';

const { Link } = Typography;

interface MealCardProps {
  mealDate: string;
  mealType: keyof MealPlanDay['mealItems'];
  mealItem: MealPlanFood;
  onAmountChange: (amount: number, unit: number, cardId: string) => void;
  onRemoveFood: (cardId: string) => void;
  onDuplicateFood: (cardId: string) => void;
}

const MealCard: React.FC<MealCardProps> = ({
  mealDate,
  mealType,
  mealItem,
  onAmountChange,
  onRemoveFood,
  onDuplicateFood,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const handleEnterHover = () => setIsHovered(true);
  const handleLeaveHover = () => setIsHovered(false);

  const { mealCardRef, isDragging, closestEdge } = useMealCardDrag({
    mealDate,
    mealType,
    cardId: mealItem._id,
  });

  // TODO: Implement onClick for each menu item
  const menuItems: MenuProps['items'] = [
    {
      key: '0',
      label: 'Add to Favorite',
      icon: <HiOutlineStar />,
    },
    {
      key: '1',
      label: 'Remove Food',
      icon: <HiOutlineArchiveBoxXMark />,
      onClick: () => {
        onRemoveFood(mealItem._id);
      },
    },
    { type: 'divider' },
    {
      key: '2',
      label: 'Duplicate this Food',
      icon: <HiOutlineDocumentDuplicate />,
      onClick: () => onDuplicateFood(mealItem._id),
    },
  ];

  return (
    <div
      ref={mealCardRef}
      className={cn('relative', { 'opacity-40': isDragging })}
    >
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
          className={cn(
            'flex items-center rounded-[5px] border-2 border-transparent bg-white p-[3px_3px] transition-all duration-200 hover:shadow-md',
            { 'border-primary-400': isHovered },
          )}
          onMouseEnter={handleEnterHover}
          onMouseLeave={handleLeaveHover}
        >
          <Image
            src={mealItem.foodId.imgUrls ? mealItem.foodId.imgUrls[0] : ''}
            className={`h-[50px] w-[50px] max-w-[50px] rounded-[10px] object-cover transition-all duration-200 ${isHovered ? 'border-primary-400 border-2' : 'border-2 border-transparent'}`}
          />
          <div className='ml-[10px] flex w-full flex-col justify-center gap-[3px] pr-[10px]'>
            {/* title */}
            <Link className='leading-4.5 font-bold text-black transition-all duration-200 hover:underline'>
              {mealItem.foodId.name}
            </Link>
            <AmountSelector
              cardId={mealItem._id}
              currentUnit={mealItem.unit}
              currentAmount={mealItem.amount}
              options={mealItem.foodId?.units.map((unit, index) => ({
                index: index,
                amount: unit.amount,
                description: unit.description,
              }))}
              onAmountChange={onAmountChange}
            />
          </div>
          <PairButton isHovered={isHovered} menuItems={menuItems} />
        </div>
      </Popover>
      {closestEdge && <DropIndicator edge={closestEdge} mealCardHeight={10} />}
    </div>
  );
};

export default MealCard;
