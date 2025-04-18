import React from 'react';
import { Divider, Typography } from 'antd';

import { nutritionFormat } from '@/constants/nutritionFormat';
import type { NutritionFields } from '@/types/food';
import type { Food } from '@/types/food';
import { roundNumber } from '@/utils/roundNumber';

interface NutritionPopoverFoodOverrideProps {
  food: Food;
  showIngredient: boolean;
}

const { Title } = Typography;

const NutritionPopoverFoodOverride: React.FC<
  NutritionPopoverFoodOverrideProps
> = ({ food, showIngredient }) => {
  const currentUnit = food?.units[food.defaultUnit];
  return (
    <div className='popover-content w-[240px]'>
      <div
        className='h-[150px] w-full bg-cover bg-center'
        style={{
          backgroundImage: `url(${food?.imgUrls ? food.imgUrls[0] : ''})`,
        }}
      >
        <div className='flex h-full flex-col items-start justify-end bg-gradient-to-b from-transparent via-white/70 to-white p-3.5'>
          <Title className='title text-[1.1rem] text-black' level={5}>
            {food.name}
          </Title>
          <Typography className='subtitle text-[0.8rem] text-black'>
            {`${food.property.prepTime} min prep, ${food.property.cookTime} mins cook`}
          </Typography>
        </div>
      </div>
      <div className='p-3.5'>
        <Typography className='mb-1 text-[0.8rem] font-medium tracking-widest text-black'>
          PER 1 {currentUnit?.description.toUpperCase()}
        </Typography>

        {nutritionFormat.map((item, index) => (
          <div key={index}>
            {index === 4 && <br />}
            <div className='mr-[20%] flex justify-between'>
              <Typography className={item.color}>{item.label}: </Typography>
              <Typography className={item.color}>
                {roundNumber(
                  food.nutrition[item.key as keyof NutritionFields],
                  2,
                )}
                {item.unit}
              </Typography>
            </div>
          </div>
        ))}

        {showIngredient && food.ingredients && (
          <>
            <Divider className='mx-0 my-2.5 border-[#ddd]' />
            <div className='ingredients'>
              {food.ingredients.map((ingredient) => (
                <Typography
                  key={ingredient.ingredientFoodId._id}
                  className='text-black'
                >
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
export default NutritionPopoverFoodOverride;
