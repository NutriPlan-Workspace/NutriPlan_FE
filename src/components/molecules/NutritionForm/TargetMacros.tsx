import React from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { Typography } from 'antd';

import { RangeSlider } from '@/atoms/RangeSlider';
import type { NutritionFormSchema } from '@/schemas/nutritionTargetSchema';

const { Title, Paragraph } = Typography;

interface TargetMacrosProps {
  control: Control<NutritionFormSchema>;
  errors: FieldErrors<NutritionFormSchema>;
}

const TargetMacros: React.FC<TargetMacrosProps> = ({ control, errors }) => (
  <div>
    <div className='pb-1'>
      <Title level={3} className='font-thin'>
        Target Macros
      </Title>
      <Paragraph className='max-w-[500px] text-sm font-thin'>
        Select the range of each macronutrient you want in your diet. A more
        flexible range will give you much more variety in your meals.
      </Paragraph>
    </div>
    <div className='flex items-center justify-between'>
      <Title level={3} className='font-thin'>
        Calculate macros
      </Title>
    </div>
    <Controller
      name='carbTarget'
      control={control}
      render={({ field }) => (
        <div className='mb-4'>
          <RangeSlider
            color='lightcoral'
            title='Carbs'
            {...field}
            maxValue={619}
          />
          {(errors?.carbTarget?.from || errors?.carbTarget?.to) && (
            <p className='mt-1 text-xs text-red-500'>
              {errors.carbTarget?.from?.message ||
                errors.carbTarget?.to?.message}
            </p>
          )}
        </div>
      )}
    />

    <Controller
      name='fatTarget'
      control={control}
      render={({ field }) => (
        <div className='mb-4'>
          <RangeSlider
            color='lightblue'
            title='Fats'
            {...field}
            maxValue={275}
          />
          {(errors?.fatTarget?.from || errors?.fatTarget?.to) && (
            <p className='mt-1 text-xs text-red-500'>
              {errors.fatTarget?.from?.message || errors.fatTarget?.to?.message}
            </p>
          )}
        </div>
      )}
    />

    <Controller
      name='proteinTarget'
      control={control}
      render={({ field }) => (
        <div className='mb-4'>
          <RangeSlider
            color='lightgreen'
            title='Proteins'
            {...field}
            maxValue={619}
          />
          {(errors?.proteinTarget?.from || errors?.proteinTarget?.to) && (
            <p className='mt-1 text-xs text-red-500'>
              {errors.proteinTarget?.from?.message ||
                errors.proteinTarget?.to?.message}
            </p>
          )}
        </div>
      )}
    />
  </div>
);

export default TargetMacros;
