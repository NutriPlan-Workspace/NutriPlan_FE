import React from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { Tooltip } from 'antd';

import { InputField } from '@/atoms/Input';
import type { NutritionFormSchema } from '@/schemas/nutritionTargetSchema';

interface NutritionTitleProps {
  control: Control<NutritionFormSchema>;
  errors: FieldErrors<NutritionFormSchema>;
}

const NutritionTitle: React.FC<NutritionTitleProps> = ({ control, errors }) => (
  <div className='flex items-center justify-between gap-4'>
    <div className='flex flex-col'>
      <label htmlFor='calories' className='text-sm font-medium text-gray-700'>
        Daily calories
      </label>
      <span className='text-xs text-gray-500'>kcal / day</span>
    </div>

    <Controller
      name='calories'
      control={control}
      render={({ field }) => (
        <Tooltip
          title={errors.calories?.message}
          open={!!errors.calories}
          placement='topLeft'
          overlayClassName='np-tooltip'
        >
          <InputField
            {...field}
            type='number'
            inputMode='numeric'
            className='hover:border-primary-200 focus:border-primary-200 h-10 w-[140px] rounded-xl text-right'
            onChange={(e) => field.onChange(Number(e.target.value))}
          />
        </Tooltip>
      )}
    />
  </div>
);

export default NutritionTitle;
