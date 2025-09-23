import React, { memo, useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EyeOutlined } from '@ant-design/icons';
import { Image, Popover, Typography } from 'antd';

import { DropIndicator } from '@/atoms/DropIndicator';
import { PairButton } from '@/atoms/PairButton';
import { cn } from '@/helpers/helpers';
import { useMealCardDrag } from '@/hooks/useMealCardDrag';
import { AmountSelector } from '@/molecules/AmountSelector';
import { NutritionPopoverFood } from '@/molecules/NutritionPopoverFood';
import { useUpdateFavoriteFoodsMutation } from '@/redux/query/apis/collection/collectionApi';
import {
  addToFavoriteList,
  collectionSelector,
  removeFromFavoriteList,
} from '@/redux/slices/collection';
import {
  setIsModalDetailOpen,
  setViewingDetailFood,
} from '@/redux/slices/food';
import type { Food } from '@/types/food';
import type { MealPlanDay, MealPlanFood } from '@/types/mealPlan';

import { getMenuItems } from './MenuItemMealCard';

const { Link } = Typography;

interface MealCardProps {
  index: number;
  mealDate: string;
  mealType: keyof MealPlanDay['mealItems'];
  mealItem: MealPlanFood;
  onAmountChange: (amount: number, unit: number, cardId: string) => void;
  onRemoveFood: (index: number) => void;
  onDuplicateFood: (index: number) => void;
}

const isMealPlanFood = (item: MealPlanFood | Food): item is MealPlanFood =>
  (item as MealPlanFood).foodId !== undefined;

const MealCardComponent: React.FC<MealCardProps> = ({
  index,
  mealDate,
  mealType,
  mealItem,
  onAmountChange,
  onRemoveFood,
  onDuplicateFood,
}) => {
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);

  const handleEnterHover = () => setIsHovered(true);
  const handleLeaveHover = () => setIsHovered(false);

  const favoriteList = useSelector(collectionSelector).favoriteList;
  const isFavorite = favoriteList.some(
    (item) => item.food === mealItem.foodId._id,
  );

  const [updateFavoriteFoods] = useUpdateFavoriteFoodsMutation();

  const { dragState, mealCardRef, closestEdge, draggingCardHeight } =
    useMealCardDrag({
      mealDate,
      mealType,
      cardId: mealItem._id,
      index,
    });

  const food = isMealPlanFood(mealItem) ? mealItem.foodId : mealItem;

  const onAddToFavorite = useCallback(() => {
    const newFavoriteFood = {
      food: food._id,
      date: new Date().toISOString(),
    };
    const newFavoriteList = [...favoriteList, newFavoriteFood];
    updateFavoriteFoods({ data: newFavoriteList });
    dispatch(addToFavoriteList(newFavoriteFood));
  }, [dispatch, favoriteList, food._id, updateFavoriteFoods]);

  const onRemoveFromFavorite = useCallback(() => {
    const newFavoriteList = favoriteList.filter(
      (item) => item.food !== food._id,
    );
    updateFavoriteFoods({ data: newFavoriteList });
    dispatch(removeFromFavoriteList(food._id));
  }, [dispatch, favoriteList, food._id, updateFavoriteFoods]);

  const menuItems = useMemo(
    () =>
      getMenuItems({
        isFavorite,
        onAddToFavorite: onAddToFavorite,
        onRemoveFromFavorite: onRemoveFromFavorite,
        onRemoveFood,
        onDuplicateFood,
        index,
      }),
    [
      index,
      isFavorite,
      onAddToFavorite,
      onDuplicateFood,
      onRemoveFood,
      onRemoveFromFavorite,
    ],
  );

  return (
    <div className='relative'>
      {dragState && closestEdge === 'top' && (
        <DropIndicator edge='top' mealCardHeight={draggingCardHeight} />
      )}
      <Popover
        mouseEnterDelay={0.5}
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
            src={
              food.imgUrls?.[0] ||
              'https://res.cloudinary.com/dtwrwvffl/image/upload/v1746510206/k52mpavgekiqflwmk9ex.avif'
            }
            className={cn(
              'h-[50px] w-[50px] max-w-[50px] rounded-[10px] border-2 border-transparent object-cover transition-all duration-200',
              { 'border-primary-400 border-2': isHovered },
            )}
            loading='lazy'
            preview={{
              mask: <EyeOutlined style={{ fontSize: 20, color: 'white' }} />,
            }}
          />
          <div className='ml-[10px] flex w-full flex-col justify-center gap-[3px] pr-[10px]'>
            {/* title */}
            <Link
              className='leading-4.5 font-bold text-black transition-all duration-200 hover:underline'
              onClick={() => {
                dispatch(setViewingDetailFood(mealItem));
                dispatch(setIsModalDetailOpen(true));
              }}
            >
              {mealItem.foodId.name}
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
          <PairButton
            isHovered={isHovered}
            menuItems={menuItems}
            mealDate={new Date(mealDate)}
          />
        </div>
      </Popover>
      {dragState && closestEdge === 'bottom' && (
        <DropIndicator edge='bottom' mealCardHeight={draggingCardHeight} />
      )}
    </div>
  );
};

type ShallowMealItem = {
  _id?: string;
  amount?: number;
  unit?: number;
};

const areEqual = (prev: MealCardProps, next: MealCardProps) => {
  if (
    prev.index !== next.index ||
    prev.mealDate !== next.mealDate ||
    prev.mealType !== next.mealType
  )
    return false;

  // Compare critical fields of mealItem only
  const prevItem = prev.mealItem as ShallowMealItem;
  const nextItem = next.mealItem as ShallowMealItem;
  if (prevItem?._id !== nextItem?._id) return false;
  if (prevItem?.amount !== nextItem?.amount) return false;
  if (prevItem?.unit !== nextItem?.unit) return false;

  // Assume handlers are stable via useCallback upstream.
  return true;
};

const MealCard = memo(MealCardComponent, areEqual);

export default MealCard;
