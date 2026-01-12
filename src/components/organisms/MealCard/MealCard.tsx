import React, { memo, useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EyeOutlined } from '@ant-design/icons';
import { Image, Popover, Typography } from 'antd';

import { DropIndicator } from '@/atoms/DropIndicator';
import { PairButton } from '@/atoms/PairButton';
import { NUTRITION_POPOVER_BODY_STYLE } from '@/constants/popoverStyles';
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
import {
  closeSwapModal,
  mealPlanSelector,
  openSwapModal,
  setSwapModalData,
  setSwapModalLoading,
} from '@/redux/slices/mealPlan';
import { makeSelectMealPlanByDate } from '@/redux/slices/mealPlan/selectors';
import type { Food } from '@/types/food';
import type { MealPlanDay, MealPlanFood } from '@/types/mealPlan';
import type { MealType, SwapOptionsResponse } from '@/types/mealSwap';
import { fetchSwapOptions } from '@/utils/mealSwapApi';
import { showToastError } from '@/utils/toastUtils';

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
  const swapModal = useSelector(mealPlanSelector).swapModal;

  const handleEnterHover = () => setIsHovered(true);
  const handleLeaveHover = () => setIsHovered(false);

  const favoriteList = useSelector(collectionSelector).favoriteList;
  const isFavorite = favoriteList.some(
    (item) => item.food === mealItem.foodId._id,
  );
  const flashMealCardIds = useSelector(mealPlanSelector).flashMealCardIds;
  const shouldFlash = flashMealCardIds.includes(mealItem._id);
  const selectMealPlanByDate = useMemo(makeSelectMealPlanByDate, []);
  const currentMealPlan = useSelector(
    (state: import('@/redux/store').RootState) =>
      selectMealPlanByDate(state, mealDate),
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

  const handleOpenSwapOptions = useCallback(async () => {
    const mealPlanDay = currentMealPlan?.mealPlanDay;
    if (!mealPlanDay?._id) {
      showToastError('Meal plan not found for this day.');
      return;
    }

    dispatch(
      openSwapModal({
        swapType: 'food',
        mealPlanId: mealPlanDay._id,
        mealDate,
        mealType: mealType as MealType,
        targetFoodId: mealItem.foodId._id,
        targetItemId: mealItem._id,
        filters: {},
      }),
    );
    dispatch(setSwapModalLoading({ loading: true }));
    try {
      const data = await fetchSwapOptions(mealPlanDay._id, {
        swapType: 'food',
        mealType: mealType as MealType,
        targetFoodId: mealItem.foodId._id,
        targetItemId: mealItem._id,
        limit: 5,
        tolerance: 0.2,
      });
      dispatch(setSwapModalData({ data: data as SwapOptionsResponse }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Swap options failed';
      showToastError(message);
      dispatch(closeSwapModal());
    } finally {
      dispatch(setSwapModalLoading({ loading: false }));
    }
  }, [
    currentMealPlan,
    dispatch,
    mealDate,
    mealItem._id,
    mealItem.foodId._id,
    mealType,
  ]);

  const isSwappingThisCard =
    swapModal.open &&
    swapModal.loading &&
    swapModal.swapType === 'food' &&
    swapModal.targetItemId === mealItem._id;

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
          body: NUTRITION_POPOVER_BODY_STYLE,
        }}
        open={swapModal.open ? false : undefined}
        content={<NutritionPopoverFood mealItem={mealItem} />}
      >
        <div
          ref={mealCardRef}
          className={cn(
            'flex items-center rounded-2xl border-2 border-white/70 bg-white/85 p-2 shadow-[0_6px_14px_-10px_rgba(15,23,42,0.35)] backdrop-blur-sm transition-all duration-200 hover:shadow-[0_10px_18px_-12px_rgba(15,23,42,0.35)]',
            { 'border-primary-400': isHovered },
            shouldFlash && 'meal-card-flash',
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
              'h-[50px] w-[50px] max-w-[50px] rounded-xl border-2 border-white/60 object-cover transition-all duration-200',
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
            onRotate={handleOpenSwapOptions}
            isRotating={isSwappingThisCard}
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
