import { FC, useState } from 'react';
import { Button } from 'antd';

import { useScale } from '@/contexts/ScaleContext';
import { useScaleIngre } from '@/contexts/ScaleIngreContext';
import ModalNutritionDetail from '@/organisms/ModalNutritionDetail/ModalNutritionDetail';
import type { NutritionFields } from '@/types/food';
import { calculateNutrition } from '@/utils/calculateNutrition';

import { NutritionChart } from '../NutritionChart';

interface NutritionSummaryProp {
  nutrition: NutritionFields;
  type: string;
}

const NutritionSummary: FC<NutritionSummaryProp> = ({ nutrition, type }) => {
  const { amount, unit, conversionFactor } = useScale();
  const { amountIngre, unitIngre, conversionFactorIngre } = useScaleIngre();
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div className='mt-6'>
      <span className='pb-3 text-xl font-semibold'>Nutrition Info</span>
      <div className='flex items-center justify-center'>
        <NutritionChart nutrition={nutrition} type={type} />
      </div>
      <div className='flex flex-col space-y-2'>
        <div className='flex justify-between'>
          <h1 className='text-[0.8rem] font-medium tracking-widest text-black'>
            {type === 'food'
              ? `PER${' '}${amount}${' '}${unit.toUpperCase()}`
              : `PER${' '}${amountIngre}${' '}${unitIngre.toUpperCase()}`}
          </h1>
        </div>
        {dataNutriSummary.map((item, index) => (
          <div className='flex justify-between' key={index}>
            <div className='flex items-center gap-2'>
              {item.colorRounded && <span className={item.colorRounded}></span>}
              <span>{item.title}</span>
            </div>
            <span>
              {type === 'food'
                ? calculateNutrition(item.amountNutri, amount, conversionFactor)
                : calculateNutrition(
                    item.amountNutri,
                    amountIngre,
                    conversionFactorIngre,
                  )}
            </span>
          </div>
        ))}
        <Button
          className='mt-2 border-gray-400 text-gray-600 hover:border-gray-400 hover:bg-gray-200 hover:text-black'
          onClick={showModal}
        >
          Detailed Nutrition Information
        </Button>
        <ModalNutritionDetail
          nutrition={nutrition}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      </div>
    </div>
  );
};

export default NutritionSummary;
