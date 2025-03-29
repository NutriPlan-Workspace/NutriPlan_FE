import React from 'react';
import { Divider, Typography } from 'antd';

import { nutritionFormat } from '@/constants/nutritionFormat';
import type { NutritionFields } from '@/types/food';
import { MealItem } from '@/types/mealPlan';
import { roundNumber } from '@/utils/roundNumber';

const { Title } = Typography;

interface NutritionPopoverFoodProps {
  mealItem: MealItem;
  showIngredient: boolean;
}

const NutritionPopoverFood: React.FC<NutritionPopoverFoodProps> = ({
  mealItem,
  showIngredient,
}) => {
  const currentUnit = mealItem.foodId.units[mealItem.unit];
  const diffCalories =
    mealItem?.amount / mealItem.foodId?.units?.[mealItem?.unit]?.amount;

  return (
    <div className='popover-content w-[240px]'>
      <div
        className='h-[150px] w-full bg-cover bg-center'
        style={{
          backgroundImage: `url(${mealItem.foodId.imgUrls ? mealItem.foodId.imgUrls[0] : ''})`,
        }}
      >
        <div className='flex h-full flex-col items-start justify-end bg-gradient-to-b from-transparent via-white/70 to-white p-3.5'>
          <Title className='title text-[1.1rem] text-black' level={5}>
            {mealItem.foodId.name}
          </Title>
          <Typography className='subtitle text-[0.8rem] text-black'>
            {`${mealItem.foodId.property.prepTime} min prep, ${mealItem.foodId.property.cookTime} mins cook`}
          </Typography>
        </div>
      </div>
      <div className='p-3.5'>
        <Typography className='mb-1 text-[0.8rem] font-medium tracking-widest text-black'>
          PER {mealItem.amount} {currentUnit?.description.toUpperCase()}(S)
        </Typography>
        {nutritionFormat.map((item, index) => (
          <div key={index}>
            {index === 4 && <br key={-1} />}
            <div className='mr-[20%] flex justify-between'>
              <Typography className={item.color}>{item.label}: </Typography>
              <Typography className={item.color}>
                {roundNumber(
                  mealItem.foodId.nutrition[item.key as keyof NutritionFields] *
                    diffCalories,
                  2,
                )}
                {item.unit}
              </Typography>
            </div>
          </div>
        ))}
        {showIngredient && (
          <>
            <Divider className='mx-0 my-2.5 border-[#ddd]' />
            <div className='ingredients'>
              {mealItem.foodId.ingredients.map((ingredient) => (
                <Typography
                  key={ingredient.ingredientFoodId.id}
                  className='text-black'
                >
                  {/* TODO: FIX THIS WHEN HAVE REAL DATA */}
                  {ingredient.amount} {ingredient.preparation} {ingredient.unit}{' '}
                  of {ingredient.ingredientFoodId.name}
                </Typography>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NutritionPopoverFood;
