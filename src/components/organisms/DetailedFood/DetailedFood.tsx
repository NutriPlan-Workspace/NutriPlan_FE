import React from 'react';
import { Content } from 'antd/es/layout/layout';

import { DirectionsList } from '@/molecules/DirectionList';
import { Ingredient } from '@/molecules/Ingredient';
import { NutritionSummary } from '@/molecules/NutritionSummary';
import { ScaleRecipe } from '@/molecules/ScaleRecipe';
import { TimeInfo } from '@/molecules/TimeInfo';
import { DetailedFoodResponse, Food } from '@/types/food';

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
  detailedFood: DetailedFoodResponse;
  setDetailedIngredient: (detailedIngredient: Food | null) => void;
}
const DetailedFood: React.FC<DetailedFoodProp> = ({
  detailedFood,
  setDetailedIngredient,
}) => (
  <>
    <Content
      className='flex-grow bg-gray-50'
      style={{ backgroundColor: 'white' }}
    >
      <div className='grid grid-cols-[2.3fr_3fr] gap-12'>
        <div>
          {detailedFood?.data.mainFood.imgUrls?.[0] ? (
            <img
              src={detailedFood?.data.mainFood.imgUrls[0]}
              alt={detailedFood?.data.mainFood.name}
              className='h-[25%] w-full rounded-md object-cover'
            />
          ) : (
            <p>No Image Available</p>
          )}
          {detailedFood?.data.mainFood.nutrition ? (
            <NutritionSummary
              nutrition={detailedFood?.data.mainFood.nutrition}
              type='food'
            />
          ) : (
            <p>No Nutrition Info</p>
          )}
        </div>
        <div className='col-span-1'>
          <TimeInfo
            prepTime={detailedFood?.data.mainFood.property.prepTime}
            cookTime={detailedFood?.data.mainFood.property.cookTime}
          />
          <ScaleRecipe
            units={detailedFood?.data.mainFood.units || DEFAULT_UNIT}
          />
          {detailedFood?.data.ingredientList.length ? (
            <Ingredient
              ingredientList={detailedFood.data.ingredientList}
              setDetailedIngredient={setDetailedIngredient}
            />
          ) : (
            <p>No Ingredients Available</p>
          )}
          {detailedFood?.data.mainFood.directions?.length ? (
            <DirectionsList
              directions={detailedFood?.data.mainFood.directions}
            />
          ) : (
            <p>No Directions Available</p>
          )}
        </div>
      </div>
    </Content>
  </>
);

export default DetailedFood;
