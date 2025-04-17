import React from 'react';

import { formatDate, getDayOfWeek } from '@/utils/dateUtils';

interface MealPlanHeaderProps {
  mealDate: string;
}

const MealPlanHeader: React.FC<MealPlanHeaderProps> = ({ mealDate }) => (
  <div>
    <p className='text-[14.4px] text-[#61676B]'>{formatDate(mealDate)}</p>
    <h1 className='text-[23.04px] text-[#00538F]'>
      {getDayOfWeek(new Date(mealDate))}
    </h1>
  </div>
);

export default MealPlanHeader;
