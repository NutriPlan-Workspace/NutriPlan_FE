import React from 'react';
import { Image } from 'antd';
import { Content } from 'antd/es/layout/layout';

import { DirectionsList } from '@/molecules/DirectionList';
import FoodActionButtons from '@/molecules/FoodActionButtons/FoodActionButtons';
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
  food: Food;
  listIngredient?: Food[];
}
const DetailedFood: React.FC<DetailedFoodProp> = ({ food, listIngredient }) => (
  <>
    <Content
      className='flex-grow bg-gray-50'
      style={{ backgroundColor: 'white' }}
    >
      <div className='grid grid-cols-[2.3fr_3fr] gap-12'>
        <div className='w-[350px]'>
          <div className='h-[221px] overflow-hidden rounded-t-md border border-gray-200'>
            <Image
              src={
                food?.imgUrls?.[0] ||
                'https://res.cloudinary.com/dtwrwvffl/image/upload/v1746510206/k52mpavgekiqflwmk9ex.avif'
              }
              alt={food?.name}
              className='h-[220px] w-[350px] object-cover'
            />
          </div>

          <FoodActionButtons food={food} listIngredient={listIngredient} />

          {food?.nutrition ? (
            <NutritionSummary nutrition={food?.nutrition} type='food' />
          ) : (
            <p>No Nutrition Info</p>
          )}
        </div>
        <div className='col-span-1'>
          <TimeInfo
            prepTime={food ? food.property?.prepTime : 0}
            cookTime={
              food ? food.property?.totalTime || food.property?.cookTime : 0
            }
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
