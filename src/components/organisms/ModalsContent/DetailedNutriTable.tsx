import { FC } from 'react';

import NutritionDetailedTable from '@/molecules/ModalDetailedNutriParts/nutritionDetailedTable';
import type { NutritionFields } from '@/types/food';

interface NutritionDetailedTableProps {
  nutrition: NutritionFields;
}

const DetailedNutriTable: FC<NutritionDetailedTableProps> = ({ nutrition }) => (
  <table className='mt-5 w-full border-none'>
    <NutritionDetailedTable nutrition={nutrition} />
  </table>
);

export default DetailedNutriTable;
