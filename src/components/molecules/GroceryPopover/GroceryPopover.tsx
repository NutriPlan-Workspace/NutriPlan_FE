import React from 'react';
import { Typography } from 'antd';

import { nutritionFormat } from '@/constants/nutritionFormat';
import type { NutritionFields } from '@/types/food';
import type { IngreResponse } from '@/types/mealPlan';
import { formatToDayAndDate } from '@/utils/dateUtils';
import { roundNumber } from '@/utils/roundNumber';

const { Title } = Typography;

interface NutritionPopoverFoodProps {
  data: IngreResponse;
}

const GroceryPopover: React.FC<NutritionPopoverFoodProps> = ({ data }) => (
  <div className='popover-content w-[240px]'>
    <div className='pl-3.5'>
      <Title className='title text-[1.1rem] text-black' level={5}>
        {data.name}
      </Title>
    </div>
    <div className='p-3.5'>
      {nutritionFormat.map((item, index) => (
        <div key={index}>
          {index === 4 && <br key={-1} />}
          <div className='mr-[20%] flex items-center justify-between'>
            {item.label === 'Carbs' && (
              <span className='mr-2 h-3 w-3 rounded-full bg-yellow-500' />
            )}
            {item.label === 'Fats' && (
              <span className='mr-2 h-3 w-3 rounded-full bg-blue-500' />
            )}
            {item.label === 'Proteins' && (
              <span className='mr-2 h-3 w-3 rounded-full bg-purple-500' />
            )}
            <Typography className='mr-auto'>{item.label}:</Typography>
            <Typography className={item.color}>
              {roundNumber(
                data.nutrition[item.key as keyof NutritionFields],
                2,
              )}
              {item.unit}
            </Typography>
          </div>
        </div>
      ))}
    </div>
    <div className='p-3.5'>
      {data.foodDetails.map((food, index) => (
        <div key={index} className='mb-4'>
          <p className='text-sm text-gray-500'>
            {formatToDayAndDate(food.date)}
          </p>
          <div className='flex items-center gap-2'>
            <img
              src={
                food.imgUrls[0] ||
                'https://res.cloudinary.com/dtwrwvffl/image/upload/v1746510206/k52mpavgekiqflwmk9ex.avif'
              }
              alt={food.name}
              className='h-15 w-15 rounded-md object-cover'
            />
            <div>
              <p className='text-[14px] text-gray-800'>{food.name}</p>
              <p className='text-gray-400'>
                {roundNumber(food.amount, 2)} {food.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
export default GroceryPopover;
