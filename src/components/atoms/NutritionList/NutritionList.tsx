import React from 'react';

import { nutritionData } from '@/data/nutritionData';

interface NutritionListProps {
  selectedDiet: string;
}

const NutritionList: React.FC<NutritionListProps> = ({ selectedDiet }) => {
  const nutritionList =
    nutritionData[selectedDiet] || nutritionData['Anything'];

  return (
    <ul className='flex flex-col items-center gap-[5px]'>
      {nutritionList.map((item, index) => (
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
