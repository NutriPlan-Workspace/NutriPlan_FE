import { FC } from 'react';
import { Button } from 'antd';

import { useScale } from '@/contexts/ScaleContext';
import { NutritionFields } from '@/types/food';
import { calculateNutrition } from '@/utils/calculateNutrition';

import NutritionChart from './NutritionChart';

interface NutritionSummaryProp {
  nutrition: NutritionFields;
}

const NutritionSummary: FC<NutritionSummaryProp> = ({ nutrition }) => {
  const { amount, unit, conversionFactor } = useScale();
  const dataNutriSummary = [
    {
      title: 'Calories',
      amountNutri: nutrition.calories,
    },
    {
      title: 'Carbs',
      amountNutri: nutrition.carbs,
      colorRounded: 'h-3 w-3 rounded-full bg-yellow-500',
    },
    {
      title: 'Fats',
      amountNutri: nutrition.fats,
      colorRounded: 'h-3 w-3 rounded-full bg-blue-500',
    },
    {
      title: 'Protein',
      amountNutri: nutrition.proteins,
      colorRounded: 'h-3 w-3 rounded-full bg-purple-500',
    },
  ];

  return (
    <div className='mt-4'>
      <h3 className='mb-2 text-lg font-semibold'>Nutrition Info</h3>
      <NutritionChart nutrition={nutrition} />
      <div className='flex flex-col space-y-4'>
        <div className='flex justify-between'>
          <h1>
            For {amount} {unit}
          </h1>
        </div>
        {dataNutriSummary.map((item, index) => (
          <div className='flex justify-between' key={index}>
            <div className='flex items-center gap-2'>
              {item.colorRounded && <span className={item.colorRounded}></span>}
              <span>{item.title}</span>
            </div>
            <span>
              {calculateNutrition(item.amountNutri, amount, conversionFactor)}g
            </span>
          </div>
        ))}
        <Button className='border-gray-400 text-gray-600 hover:border-gray-400 hover:bg-gray-200 hover:text-black'>
          Detailed Nutrition Information
        </Button>
      </div>
    </div>
  );
};

export default NutritionSummary;
