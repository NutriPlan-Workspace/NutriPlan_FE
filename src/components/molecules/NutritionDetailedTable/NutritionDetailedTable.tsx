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
  <div className='space-y-10'>
    {nutritionFieldGroup.map((group) => {
      const nutritionItem = group.field.map(({ key, title, unit }) => ({
        key,
        title,
        amount: nutrition[key as keyof NutritionFields],
        unit,
      }));

      return (
        <section key={group.nutriName}>
          <div className='mb-3 flex items-end justify-between gap-3'>
            <div className='text-lg font-semibold text-gray-900'>
              {group.label1}
            </div>
            <div className='grid grid-cols-2 gap-6 text-right text-xs font-semibold tracking-widest text-gray-500 uppercase'>
              <span>{group.label2 || 'Amount'}</span>
              <span>{group.label3 || 'Target'}</span>
            </div>
          </div>

          <div className='overflow-hidden rounded-2xl border border-black/5 bg-white/60'>
            <NutritionRow detailedNutrition={nutritionItem} type={type} />
          </div>
        </section>
      );
    })}
  </div>
);

export default NutritionDetailedTable;
