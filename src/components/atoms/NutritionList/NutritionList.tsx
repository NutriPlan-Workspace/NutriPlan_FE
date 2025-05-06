import React from 'react';
import { useFormContext } from 'react-hook-form';

import { MealPlanFormData } from '@/schemas/mealPlan.schema';
import { calculateNutritionAmounts } from '@/utils/nutrition';

interface NutritionListProps {
  selectedDiet: string;
}

const NutritionList: React.FC<NutritionListProps> = ({ selectedDiet }) => {
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
    <ul className='flex flex-col items-center gap-[5px]'>
      {nutritionItems.map((item, index) => (
        <li key={index} className='flex items-center space-x-2'>
          <span className={`h-3 w-3 rounded-full ${item.className}`} />
          <span>
            At least <b>{item.amount}</b> {item.label}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default NutritionList;
