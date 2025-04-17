import React from 'react';
import { Typography } from 'antd';

import { nutritionFormat } from '@/constants/nutritionFormat';
import type { Food } from '@/types/food';
import type { MealPlanFood, NutritionSummaryFields } from '@/types/mealPlan';
import { roundNumber } from '@/utils/roundNumber';

const { Title } = Typography;

interface NutritionPopoverFoodProps {
  mealItem: MealPlanFood | Food;
}

const isMealItem = (item: MealPlanFood | Food): item is MealPlanFood =>
  (item as MealPlanFood).foodId !== undefined;

const NutritionPopoverFood: React.FC<NutritionPopoverFoodProps> = ({
  mealItem,
}) => {
  const food = isMealItem(mealItem) ? mealItem.foodId : mealItem;
  const currentUnit = isMealItem(mealItem)
    ? food.units[mealItem.unit]
    : food.units[0];
  const diffCalories = isMealItem(mealItem)
    ? mealItem.amount / food.units[mealItem.unit]?.amount
    : 1;

  return (
    <div className='popover-content w-[240px]'>
      <div
        className='h-[220px] w-full bg-cover bg-center'
        style={{
          backgroundImage: `url(${food.imgUrls ? food.imgUrls[0] : ''})`,
        }}
      >
        <div className='flex h-full flex-col items-start justify-end bg-gradient-to-b from-transparent via-white/80 to-white p-3.5'>
          <Title className='title text-[1.1rem] text-black' level={5}>
            {food.name}
          </Title>
          <Typography className='subtitle text-[0.8rem] text-black'>
            {`${food.property.prepTime} min prep, ${food.property.cookTime} mins cook`}
          </Typography>
        </div>
      </div>
      <div className='p-3.5 pb-4.5'>
        <Typography className='mb-1 text-[0.8rem] font-medium tracking-widest text-black'>
          PER{' '}
          {isMealItem(mealItem)
            ? `${mealItem.amount} ${currentUnit?.description.toUpperCase()}(S)`
            : `1 ${currentUnit?.description.toUpperCase()}`}
        </Typography>
        {nutritionFormat.map((item, index) => (
          <div key={index}>
            {index === 4 && <br key={-1} />}
            <div className='mr-[20%] flex justify-between'>
              <Typography className={item.color}>{item.label}: </Typography>
              <Typography className={item.color}>
                {roundNumber(
                  food.nutrition[item.key as keyof NutritionSummaryFields] *
                    diffCalories,
                  2,
                )}
                {item.unit}
              </Typography>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NutritionPopoverFood;
