import React from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { Typography } from 'antd';
import { Tooltip } from 'antd';

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
    <div>
      <Tooltip
        title={
          errors?.carbTarget?.from?.message || errors?.carbTarget?.to?.message
        }
        visible={!!errors?.carbTarget}
      >
        <Controller
          name='carbTarget'
          control={control}
          render={({ field }) => (
            <RangeSlider
              color='lightcoral'
              title='Carbs'
              {...field}
              maxValue={619}
            />
          )}
        />
      </Tooltip>

      <Tooltip
        title={
          errors?.fatTarget?.from?.message || errors?.fatTarget?.to?.message
        }
        visible={!!errors?.fatTarget}
      >
        <Controller
          name='fatTarget'
          control={control}
          render={({ field }) => (
            <RangeSlider
              color='lightblue'
              title='Fats'
              {...field}
              maxValue={275}
            />
          )}
        />
      </Tooltip>

      <Tooltip
        title={
          errors?.proteinTarget?.from?.message ||
          errors?.proteinTarget?.to?.message
        }
        visible={!!errors?.proteinTarget}
      >
        <Controller
          name='proteinTarget'
          control={control}
          render={({ field }) => (
            <RangeSlider
              color='lightgreen'
              title='Proteins'
              {...field}
              maxValue={619}
            />
          )}
        />
      </Tooltip>
    </div>
  </div>
);

export default TargetMacros;
