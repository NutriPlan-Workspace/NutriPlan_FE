import { FC } from 'react';

import { nutritionFieldGroup, targetKeyMap } from '@/constants/nutritionFormat';
import type { NutritionFields } from '@/types/food';
import type { NutritionGoal } from '@/types/user';
import { roundNumber } from '@/utils/roundNumber';

import { NutritionRow } from '../NutritionRow';

interface NutritionDetailedTableProps {
  nutrition: NutritionFields;
  type: string;
  targetNutrition?: NutritionGoal;
}

const NutritionDetailedTable: FC<NutritionDetailedTableProps> = ({
  nutrition,
  type,
  targetNutrition,
}) => (
  <div className='space-y-10'>
    {nutritionFieldGroup.map((group) => {
      const nutritionItem = group.field.map(({ key, title, unit }) => {
        let targetText = '—';

        if (targetNutrition) {
          const keyMap = targetKeyMap[key as keyof typeof targetKeyMap];
          if (keyMap) {
            const targetVal = targetNutrition[keyMap];
            if (key === 'calories' && typeof targetVal === 'number') {
              targetText = `${roundNumber(targetVal, 0)}`;
            } else if (
              targetVal &&
              typeof targetVal === 'object' &&
              'from' in targetVal &&
              'to' in targetVal
            ) {
              targetText = `${roundNumber(targetVal.from, 1)} - ${roundNumber(targetVal.to, 1)}`;
            } else if (typeof targetVal === 'number') {
              if (key === 'fiber') {
                targetText = `> ${roundNumber(targetVal, 1)}`;
              } else if (
                ['sodium', 'cholesterol'].includes(key) &&
                targetVal > 0
              ) {
                targetText = `< ${roundNumber(targetVal, 1)}`;
              }
            }
          }
        }

        return {
          key,
          title,
          amount: nutrition[key as keyof NutritionFields],
          unit,
          target: targetText,
        };
      });

      return (
        <section key={group.nutriName}>
          <div className='mb-3 flex items-end justify-between gap-3'>
            <div className='text-lg font-semibold text-gray-900'>
              {group.label1}
            </div>
            <div className='grid grid-cols-2 gap-6 text-right text-xs font-semibold tracking-widest text-gray-500 uppercase'>
              <span>{group.label2 || 'Amount'}</span>
              {group.hasTarget && <span>{group.label3 || 'Target'}</span>}
            </div>
          </div>

          <div className='overflow-hidden rounded-2xl border border-black/5 bg-white/60'>
            <NutritionRow
              detailedNutrition={nutritionItem}
              type={type}
              hideTarget={!group.hasTarget}
            />
          </div>
        </section>
      );
    })}
  </div>
);

export default NutritionDetailedTable;
