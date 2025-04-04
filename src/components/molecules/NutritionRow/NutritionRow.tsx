import { FC } from 'react';

import { useScale } from '@/contexts/ScaleContext';
import { useScaleIngre } from '@/contexts/ScaleIngreContext';
import { calculateNutrition } from '@/utils/calculateNutrition';

interface NutritionRowProp {
  detailedNutrition: {
    title: string;
    amount: number;
    unit: string;
  }[];
  type: string;
}

const NutritionRow: FC<NutritionRowProp> = ({ detailedNutrition, type }) => {
  const { amount, conversionFactor } = useScale();
  const { amountIngre, conversionFactorIngre } = useScaleIngre();
  return (
    <tbody>
      {detailedNutrition.map((item, index) => (
        <tr key={index}>
          <td className='flex items-center gap-1'>
            {item.title === 'Carbs' && (
              <span className='h-3 w-3 rounded-full bg-yellow-500'></span>
            )}
            {item.title === 'Fat' && (
              <span className='h-3 w-3 rounded-full bg-blue-500'></span>
            )}
            {item.title === 'Protein' && (
              <span className='h-3 w-3 rounded-full bg-purple-500'></span>
            )}
            <span>{item.title}</span>
          </td>
          <td className='text-right'>
            {type === 'food'
              ? calculateNutrition(item.amount, amount, conversionFactor)
              : calculateNutrition(
                  item.amount,
                  amountIngre,
                  conversionFactorIngre,
                )}{' '}
            {item.unit}
          </td>
          <td className='text-right'>--</td>
        </tr>
      ))}
    </tbody>
  );
};

export default NutritionRow;
