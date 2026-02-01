import React from 'react';
import { MdDelete } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { Popover } from 'antd';

import { FOOD_CATEGORIES } from '@/constants/foodCategories';
import { NUTRITION_POPOVER_BODY_STYLE } from '@/constants/popoverStyles';
import { NutritionPopoverFood } from '@/molecules/NutritionPopoverFood';
import {
  setIsModalDetailOpen,
  setViewingDetailFood,
} from '@/redux/slices/food';
import type { Food } from '@/types/food';

const CATEGORY_LABEL_BY_VALUE = new Map<number, string>(
  FOOD_CATEGORIES.map((category) => [category.value, category.label]),
);

interface FoodCardCollectionProps {
  food: Food;
  onRemoveFood?: (foodId: string) => void;
  onClick?: (food: Food) => void;
  variant?: 'grid' | 'list';
}

const FoodCardCollection: React.FC<FoodCardCollectionProps> = ({
  food,
  onRemoveFood,
  onClick,
  variant = 'grid',
}) => {
  const dispatch = useDispatch();
  const calories = Math.round(food.nutrition?.calories ?? 0);
  const categoryLabels = (food.categories ?? [])
    .map((value) => CATEGORY_LABEL_BY_VALUE.get(value))
    .filter((value) => value !== undefined);

  const imageUrl =
    food.imgUrls?.[0] ||
    (food.isRecipe
      ? 'https://res.cloudinary.com/dtwrwvffl/image/upload/v1746510206/k52mpavgekiqflwmk9ex.avif'
      : 'https://res.cloudinary.com/dtwrwvffl/image/upload/v1746510206/whuexhkydv7ubiqh5rxe.jpg');

  const isGrid = variant === 'grid';

  const handleClick = () => {
    if (onClick) {
      onClick(food);
    } else {
      dispatch(setViewingDetailFood(food));
      dispatch(setIsModalDetailOpen(true));
    }
  };

  const gridCard = (
    <div
      className='group relative h-full cursor-pointer'
      onClick={handleClick}
      role='button'
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className='relative h-full overflow-hidden rounded-2xl border border-white/50 bg-white/60 shadow-[0_16px_40px_-34px_rgba(16,24,40,0.35)] backdrop-blur-sm transition duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_28px_64px_-44px_rgba(16,24,40,0.55)]'>
        {onRemoveFood && (
          <div className='absolute top-3 right-3 z-10 opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
            <button
              className='flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-colors hover:bg-red-400'
              onClick={(e) => {
                e.stopPropagation();
                onRemoveFood(food._id);
              }}
            >
              <MdDelete className='h-4 w-4' />
            </button>
          </div>
        )}

        <img
          src={imageUrl}
          alt={food.name}
          key={food.imgUrls?.[0]}
          className='h-[280px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]'
          loading='lazy'
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              'https://res.cloudinary.com/dtwrwvffl/image/upload/v1746510206/k52mpavgekiqflwmk9ex.avif';
          }}
        />

        {/* Dark gradients (top + longer bottom) */}
        <div className='pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/55 via-black/20 to-transparent' />
        <div className='pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 via-black/40 to-transparent' />

        {/* Acrylic tags (non-hover) */}
        <div className='absolute top-3 left-3 flex flex-wrap items-center gap-2'>
          <span className='rounded-full bg-white/25 px-3 py-1 text-[10px] font-semibold tracking-wide text-white backdrop-blur-md'>
            {food.isRecipe ? 'Recipe' : 'Food'}
          </span>
          {food.isCustom && (
            <span className='bg-secondary-500/25 rounded-full px-3 py-1 text-[10px] font-semibold tracking-wide text-white backdrop-blur-md'>
              Custom
            </span>
          )}
        </div>

        {/* Name + tags */}
        <div className='absolute inset-x-0 bottom-0 p-4 text-white'>
          <div className='line-clamp-2 text-[15px] leading-snug font-semibold drop-shadow-sm'>
            {food.name}
          </div>

          {/* Categories: 1 line only */}
          <div className='mt-2 flex items-center gap-2 overflow-hidden whitespace-nowrap'>
            {categoryLabels.slice(0, 2).map((label) => (
              <span
                key={label}
                className='shrink-0 rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-white backdrop-blur-md'
              >
                {label}
              </span>
            ))}
          </div>

          {/* Calories */}
          <div className='mt-2 overflow-hidden whitespace-nowrap'>
            <span className='inline-flex rounded-full bg-black/25 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-white backdrop-blur-md'>
              {calories} kcal
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const listCard = (
    <div
      className='group relative mb-3 flex cursor-pointer items-center gap-3 rounded-xl border border-gray-100 bg-white p-2 shadow-sm transition-all hover:border-gray-200 hover:shadow-md'
      onClick={handleClick}
      role='button'
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className='h-16 w-16 shrink-0 overflow-hidden rounded-lg'>
        <img
          src={imageUrl}
          alt={food.name}
          className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-110'
          loading='lazy'
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              'https://res.cloudinary.com/dtwrwvffl/image/upload/v1746510206/k52mpavgekiqflwmk9ex.avif';
          }}
        />
      </div>

      <div className='flex flex-1 flex-col justify-center'>
        <div className='group-hover:text-primary line-clamp-1 text-sm font-semibold text-gray-800'>
          {food.name}
        </div>

        <div className='mt-1 flex items-center gap-2 text-xs text-gray-500'>
          <span>{calories} kcal</span>
          <span>•</span>
          <span className='line-clamp-1'>
            {categoryLabels.slice(0, 2).join(', ')}
          </span>
        </div>
      </div>

      <div className='flex shrink-0 items-center gap-2'>
        {food.isCustom && (
          <span className='rounded bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600'>
            Custom
          </span>
        )}
      </div>
    </div>
  );

  return (
    <Popover
      mouseEnterDelay={0.5}
      placement={isGrid ? 'left' : 'right'}
      styles={{
        body: NUTRITION_POPOVER_BODY_STYLE,
      }}
      content={<NutritionPopoverFood mealItem={food} />}
    >
      {isGrid ? gridCard : listCard}
    </Popover>
  );
};

export default FoodCardCollection;
