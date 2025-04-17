import React from 'react';
import { Typography } from 'antd';

import { nutritionFormat } from '@/constants/nutritionFormat';
import { PieChart } from '@/molecules/PieChart';
import type { NutritionSummaryFields } from '@/types/mealPlan';
import { roundNumber } from '@/utils/roundNumber';

const { Title } = Typography;
interface NutritionPopoverMealProps {
  mealType: string;
  nutritionData: NutritionSummaryFields;
}
const NutritionPopoverMeal: React.FC<NutritionPopoverMealProps> = ({
  mealType,
  nutritionData,
}) => (
  <div className='popover-content flex w-[200px] flex-col items-center'>
    <div className='w-full bg-[url("https://res.cloudinary.com/dtwrwvffl/image/upload/v1742271174/qr8amnrc7vkbcy04ftty.jpg")] bg-cover bg-center'>
      <div className='relative flex w-full flex-col items-center gap-2 bg-white/85 pt-3.5 pb-2'>
        <Title
          className='m-0 bg-white text-center text-lg leading-none text-black capitalize shadow-[0_0_10px_10px_white]'
          level={5}
        >
          {mealType} Nutrition
        </Title>
        <PieChart
          className='rounded-[75px] bg-white shadow-[0_0_8px_8px_white]'
          nutritionData={nutritionData}
          size={150}
          label={true}
        />
      </div>
    </div>
    <div className='w-full p-3.5'>
      {nutritionFormat.map((item, index) => (
        <div key={index}>
          {index === 4 && <br />}
          <div className='flex justify-between'>
            <Typography className={item.color}>{item.label}: </Typography>
            <Typography className={item.color}>
              {roundNumber(nutritionData[item.key], 2)}
              {item.unit}
            </Typography>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default NutritionPopoverMeal;
