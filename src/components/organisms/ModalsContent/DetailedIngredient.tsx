import React from 'react';
import { Content } from 'antd/es/layout/layout';

import NutritionSummary from '@/molecules/ModalFoodParts/NutritionSummary';
import ScaleIngredient from '@/molecules/ModalFoodParts/ScaleIngredient';
import { Food } from '@/types/food';

type ModalDetailedIngredientProp = {
  detailedIngredient: Food;
};

const DetailedIngredient: React.FC<ModalDetailedIngredientProp> = ({
  detailedIngredient,
}) => (
  <>
    <Content
      className='flex-grow bg-gray-50 p-6'
      style={{ backgroundColor: 'white' }}
    >
      <div className='mt-1 grid grid-cols-2 gap-8'>
        <div>
          {detailedIngredient?.imgUrls[0] ? (
            <img
              src={detailedIngredient?.imgUrls[0]}
              alt={detailedIngredient?.name || 'No Image'}
              className='h-[25%] w-full rounded-md object-cover'
            />
          ) : (
            <p>No Image Available</p>
          )}
          {detailedIngredient?.nutrition ? (
            <NutritionSummary
              nutrition={detailedIngredient.nutrition}
              type='ingredient'
            />
          ) : (
            <p>No Nutrition Info</p>
          )}
        </div>
        <div className='p-6'>
          <ScaleIngredient units={detailedIngredient?.units} />
        </div>
      </div>
    </Content>
  </>
);

export default DetailedIngredient;
