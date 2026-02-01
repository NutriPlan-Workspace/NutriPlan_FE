import { FC } from 'react';

import { NutritionDetailedTable } from '@/molecules/NutritionDetailedTable';
import type { NutritionFields } from '@/types/food';
import type { NutritionGoal } from '@/types/user';

interface NutritionDetailedTableProps {
  nutrition: NutritionFields;
  type: string;
  targetNutrition?: NutritionGoal;
}
const DetailedNutriTable: FC<NutritionDetailedTableProps> = ({
  nutrition,
  type,
  targetNutrition,
}) => (
  <div className='w-full border-none'>
    <NutritionDetailedTable
      nutrition={nutrition}
      type={type}
      targetNutrition={targetNutrition}
    />
  </div>
);

export default DetailedNutriTable;
