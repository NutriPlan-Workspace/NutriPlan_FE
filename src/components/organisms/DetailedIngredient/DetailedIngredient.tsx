import React from 'react';
import { Content } from 'antd/es/layout/layout';

import { NutritionSummary } from '@/molecules/NutritionSummary';
import { ScaleIngredient } from '@/molecules/ScaleIngredient';
import type { Food } from '@/types/food';

type ModalDetailedIngredientProp = {
  food: Food | undefined;
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
        <div>
          <img
            src={
              food?.imgUrls?.[0] ||
              'https://www.eatthismuch.com/app/_app/immutable/assets/missing_thumbnail.BbdnfBW3.svg'
            }
            alt={food?.name || 'No Image'}
            className='h-[35%] w-full rounded-md object-cover'
          />
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
