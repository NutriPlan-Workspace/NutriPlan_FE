import React from 'react';
import { InputNumber, Popover, Select, Typography } from 'antd';

import { IngreResponse } from '@/types/mealPlan';
import { roundNumber } from '@/utils/roundNumber';

import { GroceryPopover } from '../GroceryPopover';

const { Link } = Typography;

interface MealCardProps {
  data: IngreResponse[];
}

const GroceryCard: React.FC<MealCardProps> = ({ data }) => (
  <div className='h-[calc(100vh-50px)] overflow-y-auto'>
    {data.length ? (
      <div className='grid grid-cols-1 gap-4 p-4 md:grid-cols-2'>
        {data.map((ingredient) => (
          <div
            key={ingredient.id}
            className='rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-lg'
          >
            <div className='flex p-3'>
              <div className='flex-shrink-0'>
                <img
                  src={ingredient.imgUrls[0]}
                  className='h-24 w-24 rounded-md object-cover'
                  alt={ingredient.name}
                />
              </div>
              <div className='ml-4 flex flex-grow flex-col justify-center'>
                <Popover
                  placement='right'
                  color='white'
                  styles={{
                    body: {
                      padding: 0,
                      borderRadius: '10px',
                      overflow: 'hidden',
                    },
                  }}
                  content={<GroceryPopover data={ingredient} />}
                >
                  <Link className='mb-2 text-lg text-gray-800 transition-colors duration-200 hover:text-blue-600'>
                    {ingredient.name}
                  </Link>
                </Popover>
                <div className='flex items-center gap-2'>
                  <InputNumber
                    type='number'
                    value={roundNumber(ingredient.totalAmount, 2)}
                    controls={false}
                    className='w-24'
                    min={0}
                    step={0.1}
                  />
                  <Select
                    defaultValue={ingredient.unit?.description}
                    dropdownMatchSelectWidth={false}
                    onChange={(value) => {
                      console.log('Selected unit:', value);
                    }}
                    className='w-32'
                  >
                    {ingredient.units?.map((unit) => (
                      <Select.Option key={unit.id} value={unit.description}>
                        {unit.description}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className='flex h-[calc(100vh-50px)] flex-col items-center justify-center gap-4'>
        <img
          className='h-[189px] w-[250px]'
          src='https://res.cloudinary.com/dtwrwvffl/image/upload/v1745210117/f7w9ldxl0gs9iyv648av.png'
          alt='Empty'
        />
        <p className='text-lg text-gray-600'>No items on Grocery List</p>
      </div>
    )}
  </div>
);

export default GroceryCard;
