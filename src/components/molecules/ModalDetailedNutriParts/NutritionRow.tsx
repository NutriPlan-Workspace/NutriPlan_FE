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
          <td className='py-2'>{item.title}</td>
          <td className='py-2 text-right'>
            {type === 'food'
              ? calculateNutrition(item.amount, amount, conversionFactor)
              : calculateNutrition(
                  item.amount,
                  amountIngre,
                  conversionFactorIngre,
                )}{' '}
          </td>
          <td className='py-2 text-right'>--</td>
        </tr>
      ))}
    </tbody>
  );
};

export default NutritionRow;
