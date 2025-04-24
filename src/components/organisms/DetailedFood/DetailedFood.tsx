import React from 'react';
import { Content } from 'antd/es/layout/layout';

import { DirectionsList } from '@/molecules/DirectionList';
import { Ingredient } from '@/molecules/Ingredient';
import { NutritionSummary } from '@/molecules/NutritionSummary';
import { ScaleRecipe } from '@/molecules/ScaleRecipe';
import { TimeInfo } from '@/molecules/TimeInfo';
import type { Food } from '@/types/food';

const DEFAULT_UNIT = [
  {
    amount: 1,
    description: 'gram',
  },
  {
    amount: 1,
    description: 'serving',
  },
];

interface DetailedFoodProp {
  food: Food | undefined;
  listIngredient?: Food[];
}
const DetailedFood: React.FC<DetailedFoodProp> = ({ food, listIngredient }) => (
  <>
    <Content
      className='flex-grow bg-gray-50'
      style={{ backgroundColor: 'white' }}
    >
      <div className='grid grid-cols-[2.3fr_3fr] gap-12'>
        <div>
          {food?.imgUrls?.[0] ? (
            <div className='aspect-[1.618] w-full overflow-hidden rounded-md'>
              <img
                src={food?.imgUrls[0]}
                alt={food?.name}
                className='h-full w-full object-cover'
              />
            </div>
          ) : (
            <p>No Image Available</p>
          )}
          {food?.nutrition ? (
            <NutritionSummary nutrition={food?.nutrition} type='food' />
          ) : (
            <p>No Nutrition Info</p>
          )}
        </div>
        <div className='col-span-1'>
          <TimeInfo
            prepTime={food ? food.property.prepTime : 0}
            cookTime={food ? food.property.cookTime : 0}
          />
          <ScaleRecipe units={food?.units || DEFAULT_UNIT} />
          {listIngredient ? (
            <Ingredient ingredientList={listIngredient} />
          ) : (
            <p>No Ingredients Available</p>
          )}
          {food?.directions?.length ? (
            <DirectionsList directions={food?.directions} />
          ) : (
            <p>No Directions Available</p>
          )}
        </div>
      </div>
    </Content>
  </>
);

export default DetailedFood;
