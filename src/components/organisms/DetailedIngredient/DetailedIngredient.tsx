import React from 'react';
import { Image } from 'antd';
import { Content } from 'antd/es/layout/layout';

import FoodActionButtons from '@/molecules/FoodActionButtons/FoodActionButtons';
import { NutritionSummary } from '@/molecules/NutritionSummary';
import { ScaleIngredient } from '@/molecules/ScaleIngredient';
import type { Food } from '@/types/food';

type ModalDetailedIngredientProp = {
  food: Food;
};

const DetailedIngredient: React.FC<ModalDetailedIngredientProp> = ({
  food,
}) => (
  <>
    <Content
      className='flex-grow bg-gray-50'
      style={{ backgroundColor: 'white' }}
    >
      <div className='grid grid-cols-2 gap-8'>
        <div className='w-[350px]'>
          <div className='h-[221px] overflow-hidden rounded-t-md border border-gray-200'>
            <Image
              src={
                food?.imgUrls?.[0] ||
                'https://res.cloudinary.com/dtwrwvffl/image/upload/v1746510206/whuexhkydv7ubiqh5rxe.jpg'
              }
              alt={food?.name}
              className='h-[220px] w-[350px] object-cover'
            />
          </div>
          {food && <FoodActionButtons food={food} />}

          {food?.nutrition ? (
            <NutritionSummary nutrition={food.nutrition} type='ingredient' />
          ) : (
            <p>No Nutrition Info</p>
          )}
        </div>
        <div>
          <ScaleIngredient
            units={
              food
                ? food.units
                : [
                    {
                      amount: 0,
                      description: 'No Unit',
                    },
                  ]
            }
          />
        </div>
      </div>
    </Content>
  </>
);

export default DetailedIngredient;
