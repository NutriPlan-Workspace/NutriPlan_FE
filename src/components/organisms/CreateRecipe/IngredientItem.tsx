import React from 'react';
import { IoMdCloseCircle } from 'react-icons/io';
import { Button, InputNumber, Select } from 'antd';

import { IngredientDisplay } from '@/types/ingredient';

interface IngredientItemProps {
  ingredient: IngredientDisplay;
  onRemove: (ingredientId: string) => void;
}

const IngredientItem: React.FC<IngredientItemProps> = ({
  ingredient,
  onRemove,
}) => (
  <div className='mb-2 flex items-center justify-between gap-4 bg-blue-50'>
    <div className='flex items-center gap-2'>
      <img
        src={ingredient.food.imgUrls[0]}
        alt=''
        className='h-20 w-20 object-cover'
      />
      <div className='flex flex-col justify-between gap-2 py-2'>
        <p>{ingredient.food.name}</p>
        <div className='flex items-center gap-2'>
          <InputNumber value={ingredient.amount} />
          <Select
            value={ingredient.unit}
            style={{ width: 160 }}
            options={ingredient.food.units.map((u, idx) => ({
              label: u.description,
              value: idx,
            }))}
          />
        </div>
      </div>
    </div>
    <Button
      className='mr-5 border-none bg-transparent hover:border-none hover:text-red-500'
      onClick={() => onRemove(ingredient.food._id)}
    >
      <IoMdCloseCircle className='h-5 w-5' />
    </Button>
  </div>
);

export default IngredientItem;
