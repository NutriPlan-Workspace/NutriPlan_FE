import { FC } from 'react';

import { nutritionFieldGroup } from '@/constants/nutritionFormat';
import type { NutritionFields } from '@/types/food';

import NutritionRow from './NutritionRow';

interface NutritionDetailedTableProps {
  nutrition: NutritionFields;
  type: string;
}

const NutritionDetailedTable: FC<NutritionDetailedTableProps> = ({
  nutrition,
  type,
}) => (
  <>
    {nutritionFieldGroup.map((item) => {
      const nutritionItem = item.field.map(({ key, title, unit }) => ({
        title,
        amount: nutrition[key as keyof NutritionFields],
        unit,
      }));
      return (
        <>
          <thead>
            <tr>
              <th className='py-2 text-left'>{item.label1}</th>
              <th className='py-2 text-right'>{item.label2}</th>
              <th className='py-2 text-right'>{item.label3}</th>
            </tr>
          </thead>
          <NutritionRow detailedNutrition={nutritionItem} type={type} />
        </>
      );
    })}
  </>
);

export default NutritionDetailedTable;
