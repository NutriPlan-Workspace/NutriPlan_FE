import React from 'react';
import { Content } from 'antd/es/layout/layout';

import DirectionsList from '@/molecules/ModalFoodParts/DirectionsList';
import Ingredient from '@/molecules/ModalFoodParts/Ingredient';
import NutritionSummary from '@/molecules/ModalFoodParts/NutritionSummary';
import ScaleRecipe from '@/molecules/ModalFoodParts/ScaleRecipe';
import TimeInfo from '@/molecules/ModalFoodParts/TimeInfo';
import { DetailedFoodResponse } from '@/types/food';

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
}

const DetailedFood: React.FC<DetailedFoodProp> = ({ detailedFood }) => (
  <Content
    className='flex-grow bg-gray-50 p-6'
    style={{ backgroundColor: 'white' }}
  >
    <div className='mt-1 grid grid-cols-3 gap-8'>
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
          <NutritionSummary nutrition={detailedFood?.data.mainFood.nutrition} />
        ) : (
          <p>No Nutrition Info</p>
        )}
      </div>
      <div className='col-span-2 p-6'>
        <TimeInfo
          prepTime={detailedFood?.data.mainFood.property.prepTime}
          cookTime={detailedFood?.data.mainFood.property.cookTime}
        />
        <ScaleRecipe
          units={detailedFood?.data.mainFood.units || DEFAULT_UNIT}
        />
        {detailedFood?.data.ingredientList.length ? (
          <Ingredient ingredientList={detailedFood.data.ingredientList} />
        ) : (
          <p>No Ingredients Available</p>
        )}
        {detailedFood?.data.mainFood.directions?.length ? (
          <DirectionsList directions={detailedFood?.data.mainFood.directions} />
        ) : (
          <p>No Directions Available</p>
        )}
      </div>
    </div>
  </Content>
);

export default DetailedFood;
