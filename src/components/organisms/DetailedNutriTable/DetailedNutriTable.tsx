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
  <div className='h-[70vh] w-full overflow-y-scroll border-none px-8 pb-8'>
    <NutritionDetailedTable nutrition={nutrition} type={type} />
  </div>
);

export default DetailedNutriTable;
