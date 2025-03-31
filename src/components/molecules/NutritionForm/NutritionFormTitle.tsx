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
  <>
    <div className='flex items-center justify-between border-b border-b-black/10 pr-4'>
      <label htmlFor='calories'>Calories</label>
      <Controller
        name='calories'
        control={control}
        render={({ field }) => (
          <Tooltip
            title={errors.calories?.message}
            visible={!!errors.calories}
            placement='topLeft'
          >
            <InputField
              {...field}
              type='number'
              className='hover:border-primary-200 focus:border-primary-200 mb-2 w-[100px] rounded-md'
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          </Tooltip>
        )}
      />
    </div>
  </>
);

export default NutritionTitle;
