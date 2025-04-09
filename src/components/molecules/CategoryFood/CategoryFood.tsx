import React from 'react';

import { Button } from '@/atoms/Button';
import { CategoryFoodSkeleton } from '@/molecules/CategoryFoodSkeleton';
import { MealCard } from '@/organisms/MealCard';
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
  if (isLoading) return <CategoryFoodSkeleton />;

  const displayedFoods = isAllCategory ? foods.slice(0, 5) : foods;

  return (
    <div className='my-3 flex flex-col gap-2 border-b border-b-black/10 pb-3'>
      <h1 className='text-[18px] font-semibold'>{title}</h1>
      <div className='flex flex-col justify-center gap-2'>
        {!displayedFoods.length ? (
          <p className='text-[18px] font-thin text-gray-500 italic'>
            No foods available.
          </p>
        ) : (
          displayedFoods.map((food) => (
            <MealCard key={food._id} mealItem={food} isAddFood={true} />
          ))
        )}
      </div>
      {!isRecent && Boolean(displayedFoods.length) && (
        <div className='flex items-center justify-end'>
          <Button
            className='text-primary border-none uppercase'
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
