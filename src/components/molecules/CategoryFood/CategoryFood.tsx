import React, { useMemo } from 'react';

import { Button } from '@/atoms/Button';
import { FOOD_CATEGORIES } from '@/constants/foodCategories';
import { cn } from '@/helpers/helpers';
import { CategoryFoodSkeleton } from '@/molecules/CategoryFoodSkeleton';
import { FoodCardSideAdd } from '@/organisms/FoodCardSideAdd';
import type { Food } from '@/types/food';

interface CategoryFoodProps {
  foods: Food[];
  title: string;
  isRecent?: boolean;
  isLoading?: boolean;
  isAllCategory?: boolean;
  onViewMore?: () => void;
}

const CategoryFood: React.FC<CategoryFoodProps> = ({
  foods,
  title,
  isRecent = false,
  isLoading = false,
  isAllCategory = false,
  onViewMore,
}) => {
  const displayedFoods = isAllCategory ? foods.slice(0, 5) : foods;

  const categoryLabelByValue = useMemo(() => {
    const map = new Map<number, string>();
    FOOD_CATEGORIES.forEach((c) => map.set(c.value, c.label));
    return map;
  }, []);

  const groupedFoods = useMemo(() => {
    const getLabel = (food: Food) => {
      const raw = (food.categoryId ?? '').toString().trim();
      if (!raw) return 'Uncategorized';

      const numeric = Number(raw);
      if (Number.isFinite(numeric)) {
        const label = categoryLabelByValue.get(numeric);
        return label ?? `Category ${raw}`;
      }

      return raw;
    };

    const groups = new Map<string, Food[]>();
    for (const food of displayedFoods) {
      const label = getLabel(food);
      const existing = groups.get(label);
      if (existing) {
        existing.push(food);
      } else {
        groups.set(label, [food]);
      }
    }

    const sorted = Array.from(groups.entries()).sort(([a], [b]) => {
      if (a === 'Uncategorized') return 1;
      if (b === 'Uncategorized') return -1;
      return a.localeCompare(b);
    });

    return sorted;
  }, [categoryLabelByValue, displayedFoods]);

  if (isLoading) return <CategoryFoodSkeleton />;

  return (
    <div
      className={cn(
        'my-3 flex flex-col gap-3 rounded-2xl border border-slate-200/70 bg-white/85 p-3 shadow-sm',
        !isAllCategory && 'min-h-[360px]',
      )}
    >
      <div className='flex items-center justify-between'>
        <h1 className='text-[15px] font-semibold text-slate-800'>{title}</h1>
        {isAllCategory && Boolean(displayedFoods.length) && (
          <span className='text-[11px] font-medium tracking-wide text-slate-400 uppercase'>
            Top picks
          </span>
        )}
      </div>
      <div className='flex flex-col justify-center gap-2'>
        {!displayedFoods.length ? (
          <div className='rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-3 py-6 text-center'>
            <p className='text-[13px] font-medium text-slate-500'>
              No foods available.
            </p>
            <p className='text-[12px] text-slate-400'>
              Try a different keyword or category.
            </p>
          </div>
        ) : (
          groupedFoods.map(([groupLabel, groupFoods]) => (
            <div key={groupLabel} className='space-y-2'>
              <div className='flex items-center justify-between'>
                <h2 className='text-[12px] font-semibold tracking-wide text-slate-500'>
                  {groupLabel}
                </h2>
                <span className='text-[11px] font-medium text-slate-400'>
                  {groupFoods.length}
                </span>
              </div>
              <div className='flex flex-col gap-2'>
                {groupFoods.map((food) => (
                  <FoodCardSideAdd key={food._id} food={food} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
      {!isRecent && Boolean(displayedFoods.length) && (
        <div className='flex items-center justify-end'>
          <Button
            className='border-primary-100 bg-primary-50 text-primary-600 hover:bg-primary-100 rounded-full border px-3 py-1 text-[12px] font-semibold tracking-wide uppercase transition'
            onClick={onViewMore}
          >
            View More
          </Button>
        </div>
      )}
    </div>
  );
};

export default CategoryFood;
