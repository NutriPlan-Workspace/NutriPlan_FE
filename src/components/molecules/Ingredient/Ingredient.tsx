import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Popover } from 'antd';
import Link from 'antd/es/typography/Link';

import { useScale } from '@/contexts/ScaleContext';
import {
  foodSelector,
  setPreviousViewingDetailFood,
  setViewingDetailFood,
} from '@/redux/slices/food';
import type { Food } from '@/types/food';
import { getUnitAmountFromUnits } from '@/utils/foodUnits';

import { PopoverIngreContent } from '../PopoverIngreContent';

interface IngredientProps {
  ingredientList: Food[];
}

const Ingredient: React.FC<IngredientProps> = ({ ingredientList }) => {
  const dispatch = useDispatch();
  const viewingDetailFood = useSelector(foodSelector).viewingDetailFood;
  const { amount, conversionFactor } = useScale();

  return (
    <>
      <div>
        <h2 className='mt-6 pb-3 text-xl font-semibold'>Ingredients</h2>
        <ul className='list-inside list-disc'>
          {ingredientList.map((item, index) => (
            <div
              key={index}
              className='flex cursor-pointer items-center gap-5 p-1 pl-2 hover:bg-gray-100'
            >
              <div className='flex h-[64px] w-[64px] items-center justify-center'>
                <Popover
                  mouseEnterDelay={0.5}
                  placement='right'
                  title={item.name}
                  content={
                    <PopoverIngreContent
                      calories={
                        Number(item.nutrition?.calories?.toFixed(2)) || 0
                      }
                      carbs={Number(item.nutrition?.carbs?.toFixed(2)) || 0}
                      fats={Number(item.nutrition?.fats?.toFixed(2)) || 0}
                      proteins={
                        Number(item.nutrition?.proteins?.toFixed(2)) || 0
                      }
                      fiber={Number(item.nutrition?.fiber?.toFixed(2)) || 0}
                      sodium={Number(item.nutrition?.sodium?.toFixed(2)) || 0}
                      cholesterol={
                        Number(item.nutrition?.cholesterol?.toFixed(2)) || 0
                      }
                    />
                  }
                >
                  <img
                    className='aspect-square w-full rounded-sm object-cover'
                    src={item.imgUrls[0] || ''}
                    alt={item.name}
                  />
                </Popover>
              </div>
              <div className='flex min-w-70 flex-col'>
                <Popover
                  mouseEnterDelay={0.5}
                  placement='right'
                  title={item.name}
                  content={
                    <PopoverIngreContent
                      calories={
                        Number(item.nutrition?.calories?.toFixed(2)) || 0
                      }
                      carbs={Number(item.nutrition?.carbs?.toFixed(2)) || 0}
                      fats={Number(item.nutrition?.fats?.toFixed(2)) || 0}
                      proteins={
                        Number(item.nutrition?.proteins?.toFixed(2)) || 0
                      }
                      fiber={Number(item.nutrition?.fiber?.toFixed(2)) || 0}
                      sodium={Number(item.nutrition?.sodium?.toFixed(2)) || 0}
                      cholesterol={
                        Number(item.nutrition?.cholesterol?.toFixed(2)) || 0
                      }
                    />
                  }
                >
                  <Link
                    onClick={() => {
                      if (!viewingDetailFood) return;
                      dispatch(setPreviousViewingDetailFood(viewingDetailFood));
                      dispatch(setViewingDetailFood(item));
                    }}
                    className='text-base font-semibold text-black hover:underline'
                  >
                    {item.name}
                  </Link>
                </Popover>
                <p className='text-gray-500'>
                  {item.description === 'NaN' ? '' : item.description}
                </p>
                <div className='flex gap-x-6 text-gray-500'>
                  {(() => {
                    const primaryUnitIndex = item.units?.[2]
                      ? 2
                      : item.units?.[1]
                        ? 1
                        : 0;

                    const secondaryUnitIndex = item.units?.[0]
                      ? 0
                      : item.units?.[1]
                        ? 1
                        : 0;

                    const primaryUnitAmount = getUnitAmountFromUnits(
                      item.units,
                      primaryUnitIndex,
                      1,
                    );
                    const secondaryUnitAmount = getUnitAmountFromUnits(
                      item.units,
                      secondaryUnitIndex,
                      1,
                    );

                    const primaryUnitLabel =
                      item.units?.[primaryUnitIndex]?.description ?? '';
                    const secondaryUnitLabel =
                      item.units?.[secondaryUnitIndex]?.description ?? '';

                    return (
                      <>
                        <span>
                          {(
                            (primaryUnitAmount * amount) /
                            conversionFactor
                          ).toFixed(1)}{' '}
                          {primaryUnitLabel}
                        </span>
                        <span>
                          {(
                            (secondaryUnitAmount * amount) /
                            conversionFactor
                          ).toFixed(1)}{' '}
                          {secondaryUnitLabel}
                        </span>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Ingredient;
