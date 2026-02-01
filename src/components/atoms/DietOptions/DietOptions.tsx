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
        <ul className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
          {dietOptions.map((option) => (
            <li key={option.id}>
              <Card
                className={cn(
                  'flex w-full cursor-pointer items-center gap-3 rounded-2xl border-2 px-3 py-3 text-left transition-all',
                  field.value === option.label
                    ? 'border-emerald-500 bg-emerald-50 shadow-[0_12px_24px_-16px_rgba(16,24,40,0.35)]'
                    : 'border-gray-200 bg-white hover:border-emerald-200',
                )}
                onClick={() => field.onChange(option.label)}
              >
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-xl text-xl',
                    field.value === option.label
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-gray-100 text-gray-600',
                  )}
                >
                  {option.icon}
                </div>
                <div>
                  <p className='m-0 text-sm font-semibold text-gray-900'>
                    {option.label}
                  </p>
                  <p className='m-0 text-xs text-gray-500'>Tap to select</p>
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
