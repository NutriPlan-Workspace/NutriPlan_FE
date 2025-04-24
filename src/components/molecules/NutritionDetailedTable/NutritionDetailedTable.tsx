import { FC } from 'react';

import { nutritionFieldGroup } from '@/constants/nutritionFormat';
import type { NutritionFields } from '@/types/food';

import { NutritionRow } from '../NutritionRow';

interface NutritionDetailedTableProps {
  nutrition: NutritionFields;
  type: string;
}

const NutritionDetailedTable: FC<NutritionDetailedTableProps> = ({
  nutrition,
  type,
}) => (
  <table className='w-full border-none'>
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
              <th
                className={
                  item.nutriName === 'general'
                    ? 'pb-3 text-left text-lg'
                    : 'pt-10 pb-3 text-left text-lg'
                }
              >
                {item.label1}
              </th>
              <th
                className={
                  item.nutriName === 'general'
                    ? 'pb-3 text-right text-lg'
                    : 'pt-10 pb-3 text-right text-lg'
                }
              >
                {item.label2}
              </th>
              <th
                className={
                  item.nutriName === 'general'
                    ? 'pb-3 text-right text-lg'
                    : 'pt-10 pb-3 text-right text-lg'
                }
              >
                {item.label3}
              </th>
            </tr>
          </thead>
          <NutritionRow detailedNutrition={nutritionItem} type={type} />
        </>
      );
    })}
  </table>
);

export default NutritionDetailedTable;
