import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FaCarrot, FaSeedling } from 'react-icons/fa';
import { FaLeaf } from 'react-icons/fa6';
import { GiMeat, GiSandwich } from 'react-icons/gi';
import { MdOutlineNoFood } from 'react-icons/md';
import { Card } from 'antd';

import { DIET_LABELS } from '@/constants/dietLabels';
import { cn } from '@/helpers/helpers';

const dietOptions = [
  { id: 1, icon: <GiSandwich />, label: DIET_LABELS.ANYTHING },
  { id: 2, icon: <MdOutlineNoFood />, label: DIET_LABELS.KETO },
  { id: 3, icon: <FaSeedling />, label: DIET_LABELS.MEDITERRANEAN },
  { id: 4, icon: <GiMeat />, label: DIET_LABELS.PALEO },
  { id: 5, icon: <FaLeaf />, label: DIET_LABELS.VEGAN },
  { id: 6, icon: <FaCarrot />, label: DIET_LABELS.VEGETARIAN },
];

const DietOptions: React.FC = () => {
  const { control } = useFormContext();

  return (
    <Controller
      name='diet'
      control={control}
      render={({ field }) => (
        <ul className='mb-4 flex justify-center gap-4'>
          {dietOptions.map((option) => (
            <li key={option.id}>
              <Card
                className={cn(
                  'flex h-28 w-28 cursor-pointer items-center justify-center border-4 text-black transition-all',
                  field.value === option.label
                    ? 'border-primary bg-primary-100'
                    : 'border-gray-300 bg-white',
                )}
                onClick={() => field.onChange(option.label)}
              >
                <div className='flex h-full flex-col items-center justify-center'>
                  <span className='text-3xl'>{option.icon}</span>
                  <span className='mt-2 text-sm font-medium'>
                    {option.label}
                  </span>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    />
  );
};

export default DietOptions;
