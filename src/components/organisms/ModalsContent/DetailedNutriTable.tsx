import { FC } from 'react';

import NutritionDetailedTable from '@/molecules/ModalDetailedNutriParts/NutritionDetailedTable';
import type { NutritionFields } from '@/types/food';

interface NutritionDetailedTableProps {
  nutrition: NutritionFields;
  type: string;
}

const DetailedNutriTable: FC<NutritionDetailedTableProps> = ({
  nutrition,
  type,
}) => (
  <table className='mt-5 w-full border-none'>
    <NutritionDetailedTable nutrition={nutrition} type={type} />
  </table>
);

export default DetailedNutriTable;
