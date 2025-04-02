import React from 'react';

import { useScale } from '@/contexts/ScaleContext';
import { Food } from '@/types/food';

interface IngredientProps {
  ingredientList: Food[];
}

const Ingredient: React.FC<IngredientProps> = ({ ingredientList }) => {
  const { amount, conversionFactor } = useScale();

  return (
    <div className='mt-4 mb-4'>
      <h2 className='text-lg font-semibold'>Ingredients</h2>
      <ul className='mt-2 list-inside list-disc'>
        {ingredientList.map((item, index) => (
          <>
            <div key={index} className='flex items-center space-x-4'>
              <span className='w-12 flex-shrink-0'>
                <img
                  className='h-auto w-full object-cover'
                  src={item.imgUrls[0]}
                  alt={item.name}
                />
              </span>
              <div className='flex min-w-70 flex-col'>
                <h1 className='text-lg font-semibold'>{item.name}</h1>
                <p className='text-gray-500'>{item.description}</p>
                <div className='flex gap-x-6 text-gray-500'>
                  <span>
                    {(
                      (item.units[2].amount * amount) /
                      conversionFactor
                    ).toFixed(1)}{' '}
                    {item.units[2].description}
                  </span>
                  <span>
                    {(
                      (item.units[0].amount * amount) /
                      conversionFactor
                    ).toFixed(1)}{' '}
                    {item.units[0].description}
                  </span>
                </div>
              </div>
            </div>
          </>
        ))}
      </ul>
    </div>
  );
};

export default Ingredient;
