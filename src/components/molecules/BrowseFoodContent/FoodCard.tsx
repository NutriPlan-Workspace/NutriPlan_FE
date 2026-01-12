import React from 'react';
import { useDispatch } from 'react-redux';
import { Popover } from 'antd';

import { FOOD_CATEGORIES } from '@/constants/foodCategories';
import { NUTRITION_POPOVER_BODY_STYLE } from '@/constants/popoverStyles';
import {
  setIsModalDetailOpen,
  setViewingDetailFood,
} from '@/redux/slices/food';
import type { Food } from '@/types/food';

import { NutritionPopoverFood } from '../NutritionPopoverFood';

const CATEGORY_LABEL_BY_VALUE = new Map(
  FOOD_CATEGORIES.map((category) => [category.value, category.label] as const),
);

interface FoodCardProps {
  foodItem: Food;
  showPopover?: boolean;
}

const FoodCard: React.FC<FoodCardProps> = ({
  foodItem,
  showPopover = true,
}) => {
  const dispatch = useDispatch();
  const calories = Math.round(foodItem.nutrition?.calories ?? 0);
  const categoryLabels = (foodItem.categories ?? [])
    .map((value) => CATEGORY_LABEL_BY_VALUE.get(value))
    .filter((value): value is string => Boolean(value));

  const imageUrl =
    foodItem.imgUrls?.[0] ||
    (foodItem.isRecipe
      ? 'https://res.cloudinary.com/dtwrwvffl/image/upload/v1746510206/k52mpavgekiqflwmk9ex.avif'
      : 'https://res.cloudinary.com/dtwrwvffl/image/upload/v1746510206/whuexhkydv7ubiqh5rxe.jpg');

  const card = (
    <div
      className='group relative cursor-pointer'
      onClick={() => {
        dispatch(setViewingDetailFood(foodItem));
        dispatch(setIsModalDetailOpen(true));
      }}
      role='button'
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          dispatch(setViewingDetailFood(foodItem));
          dispatch(setIsModalDetailOpen(true));
        }
      }}
    >
      <div className='relative overflow-hidden rounded-2xl border border-white/50 bg-white/60 shadow-[0_16px_40px_-34px_rgba(16,24,40,0.35)] backdrop-blur-sm transition duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_28px_64px_-44px_rgba(16,24,40,0.55)]'>
        <img
          src={imageUrl}
          alt={foodItem.name}
          key={foodItem.imgUrls?.[0]}
          className='h-[380px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]'
          loading='lazy'
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              'https://res.cloudinary.com/dtwrwvffl/image/upload/v1746510206/k52mpavgekiqflwmk9ex.avif';
          }}
        />

        {/* Dark gradients (top + longer bottom) */}
        <div className='pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/55 via-black/20 to-transparent' />
        <div className='pointer-events-none absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-black/75 via-black/35 to-transparent' />

        {/* Acrylic tags (non-hover) */}
        <div className='absolute top-3 left-3 flex flex-wrap items-center gap-2'>
          <span className='rounded-full bg-white/25 px-3 py-1 text-[11px] font-semibold tracking-wide text-white backdrop-blur-md'>
            {foodItem.isRecipe ? 'Recipe' : 'Food'}
          </span>
          {foodItem.isCustom && (
            <span className='bg-secondary-500/25 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide text-white backdrop-blur-md'>
              Custom
            </span>
          )}
        </div>

        {/* Name + tags */}
        <div className='absolute inset-x-0 bottom-0 p-4 text-white'>
          <div className='line-clamp-2 text-[15px] leading-snug font-semibold drop-shadow-sm'>
            {foodItem.name}
          </div>

          {/* Categories: 1 line only */}
          <div className='mt-2 flex items-center gap-2 overflow-hidden whitespace-nowrap'>
            {categoryLabels.slice(0, 3).map((label) => (
              <span
                key={label}
                className='shrink-0 rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold tracking-wide text-white backdrop-blur-md'
              >
                {label}
              </span>
            ))}
          </div>

          {/* Calories: separate 1-line row */}
          <div className='mt-2 overflow-hidden whitespace-nowrap'>
            <span className='inline-flex rounded-full bg-black/25 px-3 py-1 text-[11px] font-semibold tracking-wide text-white backdrop-blur-md'>
              {calories} kcal
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {showPopover ? (
        <Popover
          mouseEnterDelay={0.35}
          placement='left'
          styles={{ body: NUTRITION_POPOVER_BODY_STYLE }}
          content={
            <NutritionPopoverFood
              mealItem={{
                _id: foodItem._id,
                foodId: foodItem,
                amount: 1,
                unit: 1,
              }}
            />
          }
        >
          {card}
        </Popover>
      ) : (
        card
      )}
    </>
  );
};

export default FoodCard;
