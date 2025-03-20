import React from 'react';
import { Divider, Typography } from 'antd';

import { nutritionFormat } from '@/constants/nutritionFormat';
import type { Food, NutritionFields } from '@/types/food';

const { Title } = Typography;

interface NutritionPopoverFoodProps {
  mealItem: Food;
}

const NutritionPopoverFood: React.FC<NutritionPopoverFoodProps> = ({
  mealItem,
}) => {
  // TODO: FIX THIS WHEN HAVE REAL DATA
  const currentUnit = mealItem.units[mealItem.defaultUnit];

  return (
    <div className='popover-content w-[240px]'>
      <div
        className='h-[150px] w-full bg-cover bg-center'
        style={{
          backgroundImage: `url(${mealItem.imgUrls ? mealItem.imgUrls[0] : ''})`,
        }}
      >
        <div className='flex h-full flex-col items-start justify-end bg-gradient-to-b from-transparent via-white/70 to-white p-3.5'>
          <Title className='title text-[1.1rem] text-black' level={5}>
            {mealItem.name}
          </Title>
          <Typography className='subtitle text-[0.8rem] text-black'>
            {`${mealItem.property.prepTime} min prep, ${mealItem.property.cookTime} mins cook`}
          </Typography>
        </div>
      </div>
      <div className='p-3.5'>
        <Typography className='mb-1 text-[0.8rem] font-medium tracking-widest text-black'>
          PER {currentUnit.amount} {currentUnit.description.toUpperCase()}(S)
        </Typography>
        {nutritionFormat.map((item, index) => (
          <div key={index}>
            {index === 4 && <br key={-1} />}
            <div className='mr-[20%] flex justify-between'>
              <Typography className={item.color}>{item.label}: </Typography>
              <Typography className={item.color}>
                {mealItem.nutrition[item.key as keyof NutritionFields]}
                {item.unit}
              </Typography>
            </div>
          </div>
        ))}
        <Divider className='mx-0 my-2.5 border-[#ddd]' />
        <div className='ingredients'>
          {mealItem.ingredients.map((ingredient) => (
            <Typography
              key={ingredient.ingredientFoodId}
              className='text-black'
            >
              {/* TODO: FIX THIS WHEN HAVE REAL DATA */}
              {ingredient.amount} {ingredient.preparation} {ingredient.unit} of{' '}
              {ingredient.ingredientFoodId}
            </Typography>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NutritionPopoverFood;
