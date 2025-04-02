import { FC } from 'react';

import { useScale } from '@/contexts/ScaleContext';
import { calculateNutrition } from '@/utils/calculateNutrition';

interface NutritionRowProp {
  detailedNutrition: {
    title: string;
    amount: number;
    unit: string;
  }[];
}

const NutritionRow: FC<NutritionRowProp> = ({ detailedNutrition }) => {
  const { amount, conversionFactor } = useScale();
  return (
    <tbody>
      {detailedNutrition.map((item, index) => (
        <tr key={index}>
          <td className='py-2'>{item.title}</td>
          <td className='py-2 text-right'>
            {calculateNutrition(item.amount, amount, conversionFactor)}{' '}
            {item.unit}
          </td>
          <td className='py-2 text-right'>--</td>
        </tr>
      ))}
    </tbody>
  );
};

export default NutritionRow;
