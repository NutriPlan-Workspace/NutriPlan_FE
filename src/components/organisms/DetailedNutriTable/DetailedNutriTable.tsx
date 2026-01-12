import { FC } from 'react';

import { NutritionDetailedTable } from '@/molecules/NutritionDetailedTable';
import type { NutritionFields } from '@/types/food';

interface NutritionDetailedTableProps {
  nutrition: NutritionFields;
  type: string;
}
const DetailedNutriTable: FC<NutritionDetailedTableProps> = ({
  nutrition,
  type,
}) => (
  <div className='w-full border-none'>
    <NutritionDetailedTable nutrition={nutrition} type={type} />
  </div>
);

export default DetailedNutriTable;
