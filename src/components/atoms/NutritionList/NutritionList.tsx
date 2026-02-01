import React from 'react';
import { useFormContext } from 'react-hook-form';

import { MealPlanFormData } from '@/schemas/mealPlan.schema';
import { calculateNutritionAmounts } from '@/utils/nutrition';

interface NutritionListProps {
  selectedDiet: string;
  children?: React.ReactNode;
}

const NutritionList: React.FC<NutritionListProps> = ({
  selectedDiet,
  children,
}) => {
  const { watch } = useFormContext<MealPlanFormData>();
  const calories = watch('calories');

  const nutritionAmounts = calculateNutritionAmounts(calories, selectedDiet);

  const nutritionItems = [
    {
      label: 'Carbs',
      amount: nutritionAmounts.carbs,
      className: 'bg-yellow-300',
    },
    {
      label: 'Protein',
      amount: nutritionAmounts.protein,
      className: 'bg-blue-400',
    },
    { label: 'Fat', amount: nutritionAmounts.fat, className: 'bg-purple-400' },
  ];

  return (
    <div className='rounded-2xl border border-emerald-100/70 bg-gradient-to-b from-white/90 via-white/85 to-emerald-50/30 p-4 shadow-[0_18px_48px_-36px_rgba(16,24,40,0.35)]'>
      {children ? <div className='mb-4'>{children}</div> : null}

      <div className='mb-3 flex items-center justify-between gap-3'>
        <p className='m-0 text-xs font-semibold tracking-[0.22em] text-slate-500 uppercase'>
          Macro preview
        </p>
        <span className='rounded-full border border-emerald-100 bg-white/70 px-3 py-1 text-xs font-semibold text-emerald-700'>
          Live
        </span>
      </div>

      <ul className='m-0 grid list-none gap-2 p-0 text-sm text-slate-700'>
        {nutritionItems.map((item) => (
          <li
            key={item.label}
            className='flex items-center justify-between gap-3 rounded-xl border border-white/60 bg-white/70 px-3 py-2'
          >
            <span className='flex items-center gap-2'>
              <span className={`h-2.5 w-2.5 rounded-full ${item.className}`} />
              <span className='font-semibold text-slate-800'>{item.label}</span>
            </span>
            <span className='text-slate-600'>
              At least{' '}
              <span className='font-semibold text-slate-900'>
                {item.amount}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NutritionList;
