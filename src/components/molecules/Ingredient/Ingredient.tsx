import React, { useEffect, useState } from 'react';
import { Popover } from 'antd';

import { useScale } from '@/contexts/ScaleContext';
import { useScaleIngre } from '@/contexts/ScaleIngreContext';
import { Food } from '@/types/food';

import { PopoverIngreContent } from '../PopoverIngreContent';

interface IngredientProps {
  ingredientList: Food[];
  setDetailedIngredient: (detailedIngredient: Food | null) => void;
}

const Ingredient: React.FC<IngredientProps> = ({
  ingredientList,
  setDetailedIngredient,
}) => {
  const { amount, conversionFactor } = useScale();
  const [ingredient, setIngredient] = useState<Food | null>(null);
  const { setAmountIngre, setUnitIngre } = useScaleIngre();

  const showModal = (detailedIngredient: Food) => {
    setIngredient(detailedIngredient);
    setAmountIngre(detailedIngredient.units[0].amount);
    setUnitIngre(detailedIngredient.units[0].description);
  };
  useEffect(() => {
    if (ingredient) {
      setDetailedIngredient(ingredient);
    }
  }, [ingredient]);

  return (
    <>
      <div>
        <h2 className='text-xl font-semibold'>Ingredients</h2>
        <ul className='mt-2 list-inside list-disc'>
          {ingredientList.map((item, index) => (
            <>
              <div
                key={index}
                className='flex cursor-pointer items-center space-y-2 space-x-1 hover:bg-gray-100'
                onClick={() => showModal(item)}
              >
                <span className='w-22 flex-shrink-0 p-3'>
                  <Popover
                    placement='right'
                    title={item.name}
                    content={
                      <PopoverIngreContent
                        calories={Number(item.nutrition.calories.toFixed(2))}
                        carbs={Number(item.nutrition.carbs.toFixed(2))}
                        fats={Number(item.nutrition.fats.toFixed(2))}
                        proteins={Number(item.nutrition.proteins.toFixed(2))}
                        fiber={Number(item.nutrition.fiber.toFixed(2))}
                        sodium={Number(item.nutrition.sodium.toFixed(2))}
                      />
                    }
                  >
                    <img
                      className='h-auto w-full object-cover'
                      src={item.imgUrls[0] || ''}
                      alt={item.name}
                    />
                  </Popover>
                </span>
                <div className='flex min-w-70 flex-col'>
                  <Popover
                    placement='right'
                    title={item.name}
                    content={
                      <PopoverIngreContent
                        calories={Number(item.nutrition.calories.toFixed(2))}
                        carbs={Number(item.nutrition.carbs.toFixed(2))}
                        fats={Number(item.nutrition.fats.toFixed(2))}
                        proteins={Number(item.nutrition.proteins.toFixed(2))}
                        fiber={Number(item.nutrition.fiber.toFixed(2))}
                        sodium={Number(item.nutrition.sodium.toFixed(2))}
                      />
                    }
                  >
                    <span className='text-lg font-semibold hover:underline'>
                      {item.name}
                    </span>
                  </Popover>
                  <p className='text-gray-500'>{item.description}</p>
                  <div className='flex gap-x-6 text-gray-500'>
                    <span>
                      {(
                        ((item.units[2].amount || 1) * amount) /
                        conversionFactor
                      ).toFixed(1)}{' '}
                      {item.units[2].description}
                    </span>
                    <span>
                      {(
                        ((item.units[0].amount || 1) * amount) /
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
    </>
  );
};

export default Ingredient;
